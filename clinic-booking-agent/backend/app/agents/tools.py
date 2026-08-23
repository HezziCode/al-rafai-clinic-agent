import logging
from typing import List, Dict, Any
from agents import function_tool, RunContextWrapper
from app.agents.context import ClinicContext
from app.core.config import settings
from app.core.sheets import sheets_service

logger = logging.getLogger("agent_tools")

@function_tool
def get_clinic_info(ctx: RunContextWrapper[ClinicContext]) -> str:
    """
    Returns essential clinic details including clinic name, doctor name, working hours, phone number, address, and offered services.
    """
    return (
        f"--- {settings.CLINIC_NAME} Info ---\n"
        f"Doctor: {settings.CLINIC_DOCTOR_NAME} (Single Doctor Practice)\n"
        f"Working Hours: {settings.CLINIC_HOURS} (Every day from 12:00 PM to 6:00 PM)\n"
        f"Phone: {settings.CLINIC_PHONE}\n"
        f"Address: {settings.CLINIC_ADDRESS}\n"
        f"Services Offered: General Consultation, Routine Health Checkups, Chronic Condition Management, Wellness Counseling, Preventive Care."
    )

@function_tool
def get_available_slots(ctx: RunContextWrapper[ClinicContext], date: str) -> str:
    """
    Checks and returns available 30-minute appointment slots for a specified date (YYYY-MM-DD format).
    Working hours are 12:00 PM to 6:00 PM daily.

    Args:
        date: The date to check in YYYY-MM-DD format.
    """
    ctx.context.preferred_date = date
    slots = sheets_service.get_available_slots(date)
    if not slots:
        return f"No open slots available on {date}. All slots between 12:00 PM and 6:00 PM are fully booked."
    
    slots_formatted = ", ".join(slots)
    return (
        f"Available slots on {date} for {settings.CLINIC_DOCTOR_NAME}:\n"
        f"[{slots_formatted}]\n"
        f"Note: Each appointment is {settings.SLOT_DURATION_MINUTES} minutes."
    )

@function_tool
def book_appointment(
    ctx: RunContextWrapper[ClinicContext],
    patient_name: str,
    patient_phone: str,
    visit_reason: str,
    appointment_date: str,
    start_time: str
) -> str:
    """
    Saves and confirms an appointment in the clinic Google Sheet.

    Args:
        patient_name: Patient's full name.
        patient_phone: Patient's contact phone number.
        visit_reason: Brief description of reason for visit or symptoms.
        appointment_date: Appointment date in YYYY-MM-DD format.
        start_time: Start time in HH:MM (24-hour) format, e.g., '14:00' or '15:30'.
    """
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

    success, result_msg_or_id = sheets_service.book_appointment(
        patient_name=patient_name,
        patient_phone=patient_phone,
        visit_reason=visit_reason,
        appointment_date=appointment_date,
        start_time=start_time
    )

    if success:
        ctx.context.patient_name = patient_name
        ctx.context.patient_phone = patient_phone
        ctx.context.visit_reason = visit_reason
        ctx.context.preferred_date = appointment_date
        ctx.context.preferred_time = start_time
        
        return (
            f"✅ SUCCESS: Appointment successfully booked!\n"
            f"Booking ID: {result_msg_or_id}\n"
            f"Patient: {patient_name}\n"
            f"Doctor: {settings.CLINIC_DOCTOR_NAME}\n"
            f"Date: {appointment_date}\n"
            f"Time: {start_time}\n"
            f"Reason: {visit_reason}"
        )
    else:
        return (
            f"❌ SLOT ALREADY BOOKED: The time slot {start_time} on "
            f"{appointment_date} is already taken by another patient. "
            f"Please call get_available_slots for {appointment_date} again "
            f"to see which slots are still open, and ask the patient to "
            f"choose a different time."
        )

@function_tool
def save_patient_details(
    ctx: RunContextWrapper[ClinicContext],
    patient_name: str = None,
    patient_phone: str = None,
    visit_reason: str = None
) -> str:
    """
    Saves intermediate patient details into current session context.
    """
    if patient_name:
        ctx.context.patient_name = patient_name
    if patient_phone:
        ctx.context.patient_phone = patient_phone
    if visit_reason:
        ctx.context.visit_reason = visit_reason
    return "Patient details updated in session."

@function_tool
def cancel_appointment(
    ctx: RunContextWrapper[ClinicContext],
    booking_id: str
) -> str:
    """
    Cancels an existing appointment given its Booking ID (e.g., 'APT-20260817...').

    Args:
        booking_id: Unique booking ID string of the appointment to cancel.
    """
    success, message = sheets_service.cancel_appointment(booking_id)
    if success:
        return f"✅ SUCCESS: {message}"
    else:
        return f"❌ CANCELLATION FAILED: {message}"

@function_tool
def reschedule_appointment(
    ctx: RunContextWrapper[ClinicContext],
    booking_id: str,
    new_date: str,
    new_time: str
) -> str:
    """
    Reschedules an existing appointment to a new date and time.

    Args:
        booking_id: Unique booking ID string (e.g., 'APT-20260817...').
        new_date: New preferred date in YYYY-MM-DD format.
        new_time: New start time in HH:MM (24-hour) format, e.g., '14:30'.
    """
    success, message = sheets_service.reschedule_appointment(booking_id, new_date, new_time)
    if success:
        return f"✅ SUCCESS: {message}"
    else:
        return f"❌ RESCHEDULE FAILED: {message}"

