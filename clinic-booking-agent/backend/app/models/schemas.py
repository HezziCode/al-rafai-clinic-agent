from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class WSChatMessage(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    session_id: str = Field(default="default_session", description="Unique session ID for chat memory")
    content: str = Field(..., min_length=1, max_length=4096, description="User message content")

class ChatResponseChunk(BaseModel):
    type: str = Field(..., description="Message event type: 'stream', 'complete', 'error'")
    delta: Optional[str] = None
    content: Optional[str] = None
    agent: Optional[str] = None
    error: Optional[str] = None

class SlotRequest(BaseModel):
    date: str = Field(..., description="Date in YYYY-MM-DD format")

class SlotResponse(BaseModel):
    date: str
    available_slots: List[str]
    doctor_name: str
    clinic_hours: str

class BookingRequest(BaseModel):
    patient_name: str = Field(..., min_length=2)
    patient_phone: str = Field(..., min_length=7)
    visit_reason: str = Field(..., min_length=2)
    appointment_date: str = Field(..., description="YYYY-MM-DD format")
    start_time: str = Field(..., description="HH:MM format, e.g., '14:00'")

class BookingResponse(BaseModel):
    success: bool
    message: str
    booking_id: Optional[str] = None
    doctor_name: str
    patient_name: str
    appointment_date: str
    start_time: str

class CancelRequest(BaseModel):
    booking_id: str = Field(..., description="Booking ID e.g., 'APT-20260817...'")

class CancelResponse(BaseModel):
    success: bool
    message: str
    booking_id: str

class RescheduleRequest(BaseModel):
    booking_id: str = Field(..., description="Booking ID to reschedule")
    new_date: str = Field(..., description="New date in YYYY-MM-DD format")
    new_time: str = Field(..., description="New start time in HH:MM format")

class RescheduleResponse(BaseModel):
    success: bool
    message: str
    booking_id: str
    new_date: str
    new_time: str

class VapiWebhookMessage(BaseModel):
    message: Dict[str, Any]
