import logging
from typing import Optional
from fastapi import APIRouter, Query, HTTPException, Security, Depends
from fastapi.security import APIKeyHeader
from app.models.schemas import (
    SlotResponse,
    BookingRequest,
    BookingResponse,
    CancelRequest,
    CancelResponse,
    RescheduleRequest,
    RescheduleResponse
)
from app.core.sheets import sheets_service
from app.core.config import settings

logger = logging.getLogger("appointments_api")
router = APIRouter()

api_key_header = APIKeyHeader(name="X-Admin-Key", auto_error=False)

async def verify_admin_key(
    x_admin_key: Optional[str] = Security(api_key_header),
    admin_key: Optional[str] = Query(None)
):
    """
    Verifies static admin API key via X-Admin-Key header or admin_key query param.
    """
    provided_key = x_admin_key or admin_key
    if not provided_key or provided_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Missing or invalid X-Admin-Key header / admin_key parameter."
        )

@router.get("/clinic/info")
async def get_clinic_info_endpoint():
    """Returns clinic information."""
    return {
        "clinic_name": settings.CLINIC_NAME,
        "doctor_name": settings.CLINIC_DOCTOR_NAME,
        "phone": settings.CLINIC_PHONE,
        "address": settings.CLINIC_ADDRESS,
        "hours": settings.CLINIC_HOURS,
        "services": [
            "General Health Consultation",
            "Routine Physical Exams",
            "Chronic Disease Management",
            "Preventive Care & Wellness",
            "Vaccinations & Lab Orders"
        ]
    }

@router.get("/appointments/slots", response_model=SlotResponse)
async def get_available_slots_endpoint(date: str = Query(..., description="YYYY-MM-DD format")):
    """Returns available appointment slots for a specific date."""
    slots = sheets_service.get_available_slots(date)
    return SlotResponse(
        date=date,
        available_slots=slots,
        doctor_name=settings.CLINIC_DOCTOR_NAME,
        clinic_hours=settings.CLINIC_HOURS
    )

@router.post("/appointments/book", response_model=BookingResponse)
async def book_appointment_endpoint(payload: BookingRequest):
    """Direct REST endpoint to book an appointment."""
    success, result_id = sheets_service.book_appointment(
        patient_name=payload.patient_name,
        patient_phone=payload.patient_phone,
        visit_reason=payload.visit_reason,
        appointment_date=payload.appointment_date,
        start_time=payload.start_time
    )

    if success:
        return BookingResponse(
            success=True,
            message="Appointment successfully booked!",
            booking_id=result_id,
            doctor_name=settings.CLINIC_DOCTOR_NAME,
            patient_name=payload.patient_name,
            appointment_date=payload.appointment_date,
            start_time=payload.start_time
        )
    else:
        raise HTTPException(status_code=400, detail=result_id)

@router.post("/appointments/cancel", response_model=CancelResponse)
async def cancel_appointment_endpoint(payload: CancelRequest):
    """Direct REST endpoint to cancel an existing appointment."""
    success, message = sheets_service.cancel_appointment(payload.booking_id)
    if success:
        return CancelResponse(
            success=True,
            message=message,
            booking_id=payload.booking_id
        )
    else:
        raise HTTPException(status_code=400, detail=message)

@router.post("/appointments/reschedule", response_model=RescheduleResponse)
async def reschedule_appointment_endpoint(payload: RescheduleRequest):
    """Direct REST endpoint to reschedule an existing appointment."""
    success, message = sheets_service.reschedule_appointment(
        booking_id=payload.booking_id,
        new_date=payload.new_date,
        new_time=payload.new_time
    )
    if success:
        return RescheduleResponse(
            success=True,
            message=message,
            booking_id=payload.booking_id,
            new_date=payload.new_date,
            new_time=payload.new_time
        )
    else:
        raise HTTPException(status_code=400, detail=message)

@router.get("/appointments/list", dependencies=[Depends(verify_admin_key)])
async def list_appointments_endpoint():
    """Returns all booked appointments (Protected Doctor View)."""
    appointments = sheets_service.get_all_appointments()
    return {
        "total": len(appointments),
        "appointments": appointments,
        "sheets_connected": sheets_service.initialized,
        "warning": None if sheets_service.initialized else "Google Sheets disconnected — new bookings are NOT being saved!"
    }
