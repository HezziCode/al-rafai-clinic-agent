import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from agents import Runner, SQLiteSession
from app.agents.triage import triage_agent
from app.agents.context import ClinicContext
from app.models.schemas import WSChatMessage

logger = logging.getLogger("websocket_chat")
router = APIRouter()

@router.websocket("/ws/chat/{session_id}")
async def websocket_chat_endpoint(websocket: WebSocket, session_id: str):
    """
    Bi-directional WebSocket endpoint for streaming AI chatbot responses.
    Uses SQLiteSession for persistent multi-turn conversational memory across user turns.
    """
    await websocket.accept()
    logger.info(f"WebSocket client connected with session ID: {session_id}")

    # Initialize persistent multi-turn SQLite session
    session = SQLiteSession(session_id=session_id, db_path="chat_sessions.db")

    # Create local clinic context
    context = ClinicContext(session_id=session_id)

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

            logger.info(f"Session [{session_id}] Received User Input: {user_input}")

            # Run agent with streaming
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
                    if event.type == "text_delta":
                        delta_text = getattr(event, "delta", "")
                        full_text += delta_text
                        await websocket.send_json({
                            "type": "stream",
                            "delta": delta_text
                        })
                    elif event.type == "agent_changed":
                        if hasattr(event, "new_agent") and hasattr(event.new_agent, "name"):
                            current_agent_name = event.new_agent.name

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

    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected for session: {session_id}")
    except Exception as e:
        logger.error(f"Unexpected WebSocket error: {e}")
        try:
            await websocket.close()
        except Exception:
            pass
