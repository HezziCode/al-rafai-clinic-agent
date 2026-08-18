from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any

@dataclass
class ClinicContext:
    session_id: str = "default_session"
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    visit_reason: Optional[str] = None
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    invalid_date_attempts: int = 0
    collected_data: Dict[str, Any] = field(default_factory=dict)
