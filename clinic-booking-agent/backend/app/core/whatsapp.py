import logging
from app.core.config import settings

logger = logging.getLogger("whatsapp_notifier")

def send_whatsapp_notification(booking_details: dict) -> bool:
    """
    Sends a WhatsApp notification to the doctor about a new appointment booking.
    Uses Twilio API if credentials are set; otherwise logs the message cleanly.
    """
    patient_name = booking_details.get("patient_name", "N/A")
    patient_phone = booking_details.get("patient_phone", "N/A")
    reason = booking_details.get("visit_reason", "N/A")
    date_str = booking_details.get("appointment_date", "N/A")
    time_str = booking_details.get("start_time", "N/A")
    booking_id = booking_details.get("booking_id", "N/A")

    message_body = (
        f"🚨 *NEW APPOINTMENT BOOKED* 🚨\n\n"
        f"📋 *ID*: {booking_id}\n"
        f"👤 *Patient*: {patient_name}\n"
        f"📞 *Phone*: {patient_phone}\n"
        f"📅 *Date*: {date_str}\n"
        f"⏰ *Time*: {time_str}\n"
        f"📝 *Reason*: {reason}\n\n"
        f"Doctor: {settings.CLINIC_DOCTOR_NAME}"
    )

    if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        try:
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            msg = client.messages.create(
                from_=settings.TWILIO_WHATSAPP_NUMBER,
                to=settings.DOCTOR_WHATSAPP_NUMBER,
                body=message_body
            )
            logger.info(f"WhatsApp doctor notification sent successfully. SID: {msg.sid}")
        except Exception as e:
            logger.error(f"Failed to send Twilio doctor WhatsApp message: {e}")
    else:
        logger.info(f"[MOCK WHATSAPP NOTIFICATION TO DOCTOR]:\n{message_body}")

    # Also attempt sending confirmation directly to patient
    send_patient_whatsapp_notification(booking_details)
    return True

def send_patient_whatsapp_notification(booking_details: dict, action: str = "BOOKED") -> bool:
    """
    Sends a confirmation or update WhatsApp message to the patient.
    """
    patient_name = booking_details.get("patient_name", "Patient")
    patient_phone = booking_details.get("patient_phone", "")
    date_str = booking_details.get("appointment_date", "")
    time_str = booking_details.get("start_time", "")
    booking_id = booking_details.get("booking_id", "")

    if not patient_phone:
        return False

    to_number = patient_phone if patient_phone.startswith("whatsapp:") else f"whatsapp:{patient_phone}"

    if action == "CANCELLED":
        msg_text = (
            f"❌ *Appointment Cancelled*\n\n"
            f"Dear {patient_name},\n"
            f"Your appointment ({booking_id}) at {settings.CLINIC_NAME} has been cancelled.\n"
            f"If this was a mistake or you wish to rebook, please contact us at {settings.CLINIC_PHONE}."
        )
    elif action == "RESCHEDULED":
        msg_text = (
            f"🗓️ *Appointment Rescheduled*\n\n"
            f"Dear {patient_name},\n"
            f"Your appointment ({booking_id}) with {settings.CLINIC_DOCTOR_NAME} at {settings.CLINIC_NAME} has been rescheduled to:\n"
            f"📅 Date: {date_str}\n"
            f"⏰ Time: {time_str}\n\n"
            f"We look forward to seeing you!"
        )
    else:
        msg_text = (
            f"✅ *Appointment Confirmed*\n\n"
            f"Dear {patient_name},\n"
            f"Your appointment with {settings.CLINIC_DOCTOR_NAME} at {settings.CLINIC_NAME} is confirmed!\n"
            f"📋 Booking ID: {booking_id}\n"
            f"📅 Date: {date_str}\n"
            f"⏰ Time: {time_str}\n"
            f"📍 Location: {settings.CLINIC_ADDRESS}\n\n"
            f"Thank you!"
        )

    if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        try:
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            msg = client.messages.create(
                from_=settings.TWILIO_WHATSAPP_NUMBER,
                to=to_number,
                body=msg_text
            )
            logger.info(f"WhatsApp patient notification sent. SID: {msg.sid}")
            return True
        except Exception as e:
            logger.error(f"Failed to send Twilio patient WhatsApp message to {to_number}: {e}")
            return False
    else:
        logger.info(f"[MOCK WHATSAPP NOTIFICATION TO PATIENT ({to_number})]:\n{msg_text}")
        return True
