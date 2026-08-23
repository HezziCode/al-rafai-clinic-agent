import logging
from typing import Dict, Any
from fastapi import APIRouter, Request
from app.core.sheets import sheets_service
from app.core.config import settings

logger = logging.getLogger("vapi_webhook")
router = APIRouter()

@router.post("/vapi/webhook")
async def vapi_webhook_handler(request: Request):
    """
    Webhook handler for Vapi AI Voice Agent.
    Executes tool calls (check slots, book, cancel, reschedule appointment, get clinic info) requested by voice callers.
    """
    payload = await request.json()
    logger.info(f"Received Vapi Voice Webhook: {payload}")

    message = payload.get("message", {})
    msg_type = message.get("type")

    # Handle Tool Call Request from Vapi AI Voice Agent
    if msg_type == "tool-calls":
        tool_calls = message.get("toolCalls", [])
        results = []

        for call in tool_calls:
            tool_call_id = call.get("id")
            function_data = call.get("function", {})
            fn_name = function_data.get("name")
            args = function_data.get("arguments", {})

            result_str = ""

            if fn_name == "get_clinic_info":
                result_str = (
                    f"{settings.CLINIC_NAME} with {settings.CLINIC_DOCTOR_NAME}. "
                    f"Hours: {settings.CLINIC_HOURS}. Phone: {settings.CLINIC_PHONE}. "
                    f"Address: {settings.CLINIC_ADDRESS}."
                )

            elif fn_name == "get_available_slots":
                date_str = args.get("date", "")
                slots = sheets_service.get_available_slots(date_str)
                if slots:
                    result_str = f"Available slots on {date_str} are: {', '.join(slots)}"
                else:
                    result_str = f"No open slots available on {date_str}."

            elif fn_name == "book_appointment":
                patient_name = args.get("patient_name", "")
                patient_phone = args.get("patient_phone", "")
                visit_reason = args.get("visit_reason", "")
                appointment_date = args.get("appointment_date", "")

                # Auto-correct wrong year (e.g. 2024 instead of 2026)
                from datetime import datetime
                current_year = datetime.now().year
                today_str = datetime.now().strftime("%Y-%m-%d")
                if appointment_date:
                    parts = appointment_date.split("-")
                    if len(parts) == 3:
                        try:
                            booked_year = int(parts[0])
                            # If year is in the past, replace with current year
                            if booked_year < current_year:
                                appointment_date = f"{current_year}-{parts[1]}-{parts[2]}"
                            # If corrected date is still in the past, reject it
                            if appointment_date < today_str:
                                appointment_date = f"{current_year + 1}-{parts[1]}-{parts[2]}"
                        except (ValueError, IndexError):
                            pass

                start_time = args.get("start_time", "")

                success, result_id = sheets_service.book_appointment(
                    patient_name=patient_name,
                    patient_phone=patient_phone,
                    visit_reason=visit_reason,
                    appointment_date=appointment_date,
                    start_time=start_time
                )

                if success:
                    result_str = f"Appointment confirmed with ID {result_id} for {patient_name} on {appointment_date} at {start_time}."
                else:
                    result_str = f"Could not book appointment: {result_id}"

            elif fn_name == "cancel_appointment":
                booking_id = args.get("booking_id", "")
                success, msg = sheets_service.cancel_appointment(booking_id)
                result_str = msg

            elif fn_name == "reschedule_appointment":
                booking_id = args.get("booking_id", "")
                new_date = args.get("new_date", "")
                new_time = args.get("new_time", "")
                success, msg = sheets_service.reschedule_appointment(booking_id, new_date, new_time)
                result_str = msg

            else:
                result_str = f"Tool {fn_name} not recognized."

            results.append({
                "toolCallId": tool_call_id,
                "result": result_str
            })

        return {"results": results}

    # Default fallback response for non-tool call pings
    return {"status": "ok", "message": "Vapi webhook processed."}
