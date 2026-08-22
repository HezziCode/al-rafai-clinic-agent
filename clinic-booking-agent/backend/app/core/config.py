import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    OPENAI_API_KEY: str = ""
    GOOGLE_SHEET_ID: str = "1DYIMdEyNscWOnn1u6naMQW5kCMTCO9EfS5NN5p2vxmo"
    GOOGLE_SERVICE_ACCOUNT_PATH: str = "service_account.json"
    GOOGLE_SERVICE_ACCOUNT_JSON: str = ""

    FRONTEND_ORIGIN: str = "http://localhost:3000"
    ADMIN_API_KEY: str = "carepulse-secret-admin-key-2026"

    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_NUMBER: str = "whatsapp:+14155238886"
    DOCTOR_WHATSAPP_NUMBER: str = "whatsapp:+15551234567"

    CLINIC_NAME: str = "AL-RAFAI CLINIC"
    CLINIC_DOCTOR_NAME: str = "Dr. Fatima"
    CLINIC_PHONE: str = "+1 (555) 234-5678"
    CLINIC_ADDRESS: str = "5A/2, North Karachi"
    CLINIC_HOURS: str = "12:00 PM – 6:00 PM Daily"
    SLOT_DURATION_MINUTES: int = 30

settings = Settings()
