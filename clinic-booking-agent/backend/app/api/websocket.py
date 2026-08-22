import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from agents import Runner, SQLiteSession
from app.agents.triage import triage_agent
from app.agents.context import ClinicContext
from app.models.schemas import WSChatMessage

logger = logging.getLogger("websocket_chat")
router = APIRouter()

def extract_tool_name(event) -> str:
    """Helper to safely extract tool name from various agent event formats."""
    # 1. Direct tool_name attribute
    if hasattr(event, "tool_name") and event.tool_name:
        return str(event.tool_name)
    
    # 2. Check item attribute (RunItemStreamEvent)
    item = getattr(event, "item", None)
    if item:
        if hasattr(item, "tool_name") and item.tool_name:
            return str(item.tool_name)
        if hasattr(item, "_resolved_tool_name") and item._resolved_tool_name:
            return str(item._resolved_tool_name)
        if hasattr(item, "title") and item.title:
            return str(item.title)
        
        raw_item = getattr(item, "raw_item", None)
        if raw_item:
            if hasattr(raw_item, "name") and raw_item.name:
                return str(raw_item.name)
            if hasattr(raw_item, "function") and hasattr(raw_item.function, "name"):
                return str(raw_item.function.name)
            if isinstance(raw_item, dict):
                if "name" in raw_item:
                    return str(raw_item["name"])
                if "function" in raw_item and isinstance(raw_item["function"], dict):
                    return str(raw_item["function"].get("name", ""))

    # 3. Direct name attribute (if not generic event name)
    name = getattr(event, "name", "")
    if name and name not in ("tool_called", "tool_call", "tool_output", "run_item_stream_event", "message_output_created"):
        return str(name)
        
    return ""


@router.websocket("/ws/chat/{session_id}")
async def websocket_chat_endpoint(websocket: WebSocket, session_id: str):
    """
    Bi-directional WebSocket endpoint for streaming AI chatbot responses with tool call & handoff visibility.
    Uses SQLiteSession for persistent multi-turn conversational memory.
    """
    await websocket.accept()
    logger.info(f"WebSocket client connected with session ID: {session_id}")

    # Initialize persistent multi-turn SQLite session
    session = SQLiteSession(session_id=session_id, db_path="chat_sessions.db")

    # Create local clinic context
    context = ClinicContext(session_id=session_id)

    # Per-connection streaming lock guard
    is_streaming = False

    try:
        while True:
            raw_text = await websocket.receive_text()
            try:
                msg_data = json.loads(raw_text)
                user_input = msg_data.get("content", "").strip()
            except Exception:
                user_input = raw_text.strip()

            if not user_input:
                continue

            # Backend-side streaming guard: lock input during response generation
            if is_streaming:
                logger.warning(f"Session [{session_id}] received message while streaming was active. Sending busy signal.")
                await websocket.send_json({
                    "type": "busy",
                    "message": "Please wait, still responding..."
                })
                continue

            logger.info(f"Session [{session_id}] Received User Input: {user_input}")

            is_streaming = True
            
            # 1. Send immediate typing indicator before LLM tokens start generating
            await websocket.send_json({"type": "typing"})

            try:
                run_result = Runner.run_streamed(
                    triage_agent,
                    input=user_input,
                    session=session,
                    context=context
                )

                full_text = ""
                current_agent_name = triage_agent.name

                async for event in run_result.stream_events():
                    event_type = getattr(event, "type", "")
                    event_name = getattr(event, "name", "")
                    item = getattr(event, "item", None)
                    item_type = getattr(item, "type", "") if item else ""

                    # --- A. Tool Call Started ---
                    if (
                        event_name == "tool_called" 
                        or event_type in ("tool_call", "tool_called")
                        or item_type == "tool_call_item"
                    ):
                        tool_name = extract_tool_name(event)
                        logger.info(f"Session [{session_id}] Tool Call Started: {tool_name}")
                        await websocket.send_json({
                            "type": "tool_call",
                            "tool_name": tool_name
                        })

                    # --- B. Tool Call Completed ---
                    elif (
                        event_name == "tool_output"
                        or event_type in ("tool_result", "tool_done", "tool_output")
                        or item_type == "tool_call_output_item"
                    ):
                        logger.info(f"Session [{session_id}] Tool Call Completed")
                        await websocket.send_json({
                            "type": "tool_done"
                        })

                    # --- C. Agent Handoff / Updated Event ---
                    elif (
                        event_type in ("agent_changed", "agent_updated_stream_event")
                        or event_name in ("handoff_occured", "handoff_requested")
                    ):
                        new_name = None
                        if hasattr(event, "new_agent") and hasattr(event.new_agent, "name"):
                            new_name = event.new_agent.name
                        elif item and hasattr(item, "raw_item"):
                            raw = getattr(item, "raw_item", None)
                            if hasattr(raw, "name"):
                                new_name = str(raw.name)
                        
                        if new_name and new_name != current_agent_name:
                            current_agent_name = new_name
                            logger.info(f"Session [{session_id}] Agent Handoff -> {new_name}")
                            await websocket.send_json({
                                "type": "agent_handoff",
                                "agent": new_name
                            })

                    # --- D. Streaming Text Delta ---
                    elif event_type == "text_delta":
                        delta_text = getattr(event, "delta", "")
                        if delta_text:
                            full_text += delta_text
                            await websocket.send_json({
                                "type": "stream",
                                "delta": delta_text
                            })

                    # --- E. Raw Response Event Chunks ---
                    elif event_type == "raw_response_event":
                        data = getattr(event, "data", None)
                        if data and hasattr(data, "choices") and data.choices:
                            delta = getattr(data.choices[0], "delta", None)
                            if delta and hasattr(delta, "content") and delta.content:
                                content_delta = delta.content
                                full_text += content_delta
                                await websocket.send_json({
                                    "type": "stream",
                                    "delta": content_delta
                                })

                # Format final response output
                final_output_str = full_text if full_text else str(getattr(run_result, 'final_output', ''))

                active_agent = getattr(run_result, 'current_agent', getattr(run_result, 'agent', None))
                if active_agent and hasattr(active_agent, 'name'):
                    current_agent_name = active_agent.name

                await websocket.send_json({
                    "type": "complete",
                    "content": final_output_str,
                    "agent": current_agent_name
                })

            except Exception as e:
                logger.error(f"Error during agent execution loop: {e}", exc_info=True)
                await websocket.send_json({
                    "type": "error",
                    "error": f"An error occurred: {str(e)}"
                })
            finally:
                is_streaming = False

    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected for session: {session_id}")
    except Exception as e:
        logger.error(f"Unexpected WebSocket error: {e}")
        try:
            await websocket.close()
        except Exception:
            pass
