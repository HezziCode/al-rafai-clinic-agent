import os
import json
import logging
import threading
from datetime import datetime, time, timedelta, timezone
from typing import List, Dict, Any, Tuple

import gspread
from google.oauth2.service_account import Credentials
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type

from app.core.config import settings
from app.core.whatsapp import send_whatsapp_notification, send_patient_whatsapp_notification

logger = logging.getLogger("google_sheets_service")

# Lock for thread safety to prevent double booking
sheet_lock = threading.Lock()

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

class GoogleSheetsService:
    def __init__(self):
        self.client: gspread.Client | None = None
        self.spreadsheet: gspread.Spreadsheet | None = None
        self.appointments_sheet: gspread.Worksheet | None = None
        self.initialized = False
        self._initialize()

    def _initialize(self):
        try:
            creds = None
            json_str = settings.GOOGLE_SERVICE_ACCOUNT_JSON or ""
            if not json_str and settings.GOOGLE_SERVICE_ACCOUNT_PATH and settings.GOOGLE_SERVICE_ACCOUNT_PATH.strip().startswith("{"):
                json_str = settings.GOOGLE_SERVICE_ACCOUNT_PATH

            if json_str:
                try:
                    info = json.loads(json_str)
                    creds = Credentials.from_service_account_info(info, scopes=SCOPES)
                except Exception as je:
                    logger.error(f"Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON: {je}")

            if not creds:
                creds_path = settings.GOOGLE_SERVICE_ACCOUNT_PATH
                if not os.path.isabs(creds_path):
                    # Look relative to backend root
                    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
                    creds_path = os.path.join(base_dir, creds_path)

                if not os.path.exists(creds_path):
                    logger.warning(f"Google service account file not found at: {creds_path}")
                    return

                creds = Credentials.from_service_account_file(creds_path, scopes=SCOPES)

            self.client = gspread.authorize(creds)
            self.spreadsheet = self.client.open_by_key(settings.GOOGLE_SHEET_ID)

            # Ensure Appointments worksheet tab exists with proper headers
            self.appointments_sheet = self._get_or_create_worksheet(
                "Appointments",
                [
                    "Booking_ID",
                    "Patient_Name",
                    "Patient_Phone",
                    "Visit_Reason",
                    "Appointment_Date",
                    "Start_Time",
                    "End_Time",
                    "Doctor_Name",
                    "Status",
                    "Created_At"
                ]
            )

            # Ensure Doctor_Schedules tab exists
            self._get_or_create_worksheet(
                "Doctor_Schedules",
                ["Doctor_Name", "Shift_Start", "Shift_End", "Slot_Duration_Mins", "Is_Active"],
                default_rows=[[settings.CLINIC_DOCTOR_NAME, "12:00", "18:00", str(settings.SLOT_DURATION_MINUTES), "TRUE"]]
            )

            # Ensure Blocked_Slots tab exists
            self._get_or_create_worksheet(
                "Blocked_Slots",
                ["Block_ID", "Block_Date", "Start_Time", "End_Time", "Reason"]
            )

            self.initialized = True
            logger.info(f"Google Sheets Service successfully initialized for Sheet ID: {settings.GOOGLE_SHEET_ID}")
        except Exception as e:
            logger.error(f"Failed to initialize Google Sheets service: {e}")
            self.initialized = False

    def _get_or_create_worksheet(self, title: str, headers: List[str], default_rows: List[List[str]] = None) -> gspread.Worksheet:
        try:
            ws = self.spreadsheet.worksheet(title)
        except gspread.exceptions.WorksheetNotFound:
            ws = self.spreadsheet.add_worksheet(title=title, rows=100, cols=len(headers))
            ws.append_row(headers, value_input_option="USER_ENTERED")
            if default_rows:
                for r in default_rows:
                    ws.append_row(r, value_input_option="USER_ENTERED")
            logger.info(f"Created new worksheet '{title}' with default headers.")
        else:
            # Check if header exists, add if empty
            all_values = ws.get_all_values()
            if not all_values:
                ws.append_row(headers, value_input_option="USER_ENTERED")
                if default_rows:
                    for r in default_rows:
                        ws.append_row(r, value_input_option="USER_ENTERED")
        return ws

    @retry(
        wait=wait_exponential(multiplier=1, min=2, max=10),
        stop=stop_after_attempt(3),
        retry=retry_if_exception_type((gspread.exceptions.APIError, gspread.exceptions.GSpreadException)),
        reraise=False
    )
    def get_all_appointments(self) -> List[Dict[str, Any]]:
        """Returns all appointments as a list of dicts."""
        if not self.initialized or not self.appointments_sheet:
            return []
        try:
            return self.appointments_sheet.get_all_records()
        except Exception as e:
            logger.error(f"Error reading appointments sheet: {e}")
            return []

    def get_available_slots(self, date_str: str) -> List[str]:
        """
        Calculates available 30-minute slots for a given YYYY-MM-DD date.
        Working hours: 12:00 PM (12:00) to 6:00 PM (18:00).
        """
        # Generate standard daily fixed slots from 12:00 to 17:30 (ending at 18:00)
        all_possible_slots = [
            "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
            "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
        ]

        if not self.initialized:
            # Fallback mock slots if Sheet service not online yet
            return all_possible_slots

        existing_appointments = self.get_all_appointments()
        booked_times = set()

        target_mm_dd = date_str[-5:] if len(date_str) >= 5 else date_str

        for apt in existing_appointments:
            apt_date = str(apt.get("Appointment_Date", "")).strip()
            status = str(apt.get("Status", "")).strip().upper()

            is_date_match = (apt_date == date_str) or (len(apt_date) >= 5 and apt_date[-5:] == target_mm_dd)
            if is_date_match and status in ["BOOKED", "PENDING", "CONFIRMED", "RESCHEDULED"]:
                start_t = str(apt.get("Start_Time", "")).strip()
                if start_t:
                    booked_times.add(start_t)

        # Also check blocked slots tab if present
        try:
            blocked_ws = self.spreadsheet.worksheet("Blocked_Slots")
            blocked_records = blocked_ws.get_all_records()
            for block in blocked_records:
                if str(block.get("Block_Date", "")).strip() == date_str:
                    b_start = str(block.get("Start_Time", "")).strip()
                    if b_start:
                        booked_times.add(b_start)
        except Exception:
            pass

        available = [slot for slot in all_possible_slots if slot not in booked_times]
        return available

    def book_appointment(
        self,
        patient_name: str,
        patient_phone: str,
        visit_reason: str,
        appointment_date: str,
        start_time: str
    ) -> Tuple[bool, str]:
        """
        Thread-safe double-booking check and sheet record creation.
        """
        with sheet_lock:
            # 1. Double booking check
            available_slots = self.get_available_slots(appointment_date)
            if start_time not in available_slots:
                return False, f"Slot {start_time} on {appointment_date} is no longer available. Please pick another slot."

            # Calculate end time (30 mins after start time)
            try:
                dt_start = datetime.strptime(start_time, "%H:%M")
                dt_end = dt_start + timedelta(minutes=settings.SLOT_DURATION_MINUTES)
                end_time = dt_end.strftime("%H:%M")
            except ValueError:
                end_time = start_time

            # Generate unique booking ID
            now_stamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
            booking_id = f"APT-{now_stamp}"
            created_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

            row_data = [
                booking_id,
                patient_name,
                patient_phone,
                visit_reason,
                appointment_date,
                start_time,
                end_time,
                settings.CLINIC_DOCTOR_NAME,
                "BOOKED",
                created_at
            ]

            # Write to Sheet if initialized
            if self.initialized and self.appointments_sheet:
                try:
                    self.appointments_sheet.append_row(row_data, value_input_option="USER_ENTERED")
                    logger.info(f"Appointment {booking_id} successfully saved to Google Sheet.")
                except Exception as e:
                    logger.error(f"Failed to append row to Google Sheet: {e}")
            else:
                logger.info(f"[LOCAL MOCK RECORD]: {row_data}")

            # Trigger WhatsApp notification to Doctor & Patient
            booking_dict = {
                "booking_id": booking_id,
                "patient_name": patient_name,
                "patient_phone": patient_phone,
                "visit_reason": visit_reason,
                "appointment_date": appointment_date,
                "start_time": start_time,
                "end_time": end_time
            }
            send_whatsapp_notification(booking_dict)

            return True, booking_id

    def cancel_appointment(self, booking_id: str) -> Tuple[bool, str]:
        """
        Cancels an appointment by searching for booking_id in the Appointments worksheet
        and updating its Status column to 'CANCELLED'.
        """
        with sheet_lock:
            if not booking_id:
                return False, "Booking ID is required."
            
            clean_id = booking_id.strip().upper()

            if self.initialized and self.appointments_sheet:
                try:
                    records = self.appointments_sheet.get_all_records()
                    row_idx = None
                    patient_name = "Patient"
                    patient_phone = ""

                    for idx, r in enumerate(records, start=2):
                        r_id = str(r.get("Booking_ID", "")).strip().upper()
                        if r_id == clean_id:
                            row_idx = idx
                            patient_name = str(r.get("Patient_Name", "Patient"))
                            patient_phone = str(r.get("Patient_Phone", ""))
                            break

                    if not row_idx:
                        return False, f"Appointment {booking_id} not found."

                    # Status is column 9
                    self.appointments_sheet.update_cell(row_idx, 9, "CANCELLED")
                    logger.info(f"Appointment {clean_id} updated to CANCELLED in row {row_idx}.")

                    # Notify patient
                    send_patient_whatsapp_notification({
                        "booking_id": clean_id,
                        "patient_name": patient_name,
                        "patient_phone": patient_phone
                    }, action="CANCELLED")

                    return True, f"Appointment {clean_id} has been successfully cancelled."
                except Exception as e:
                    logger.error(f"Error cancelling appointment in Google Sheet: {e}")
                    return False, f"Failed to update appointment: {str(e)}"
            else:
                logger.info(f"[LOCAL MOCK CANCEL]: {clean_id}")
                return True, f"Appointment {clean_id} has been successfully cancelled (Mock mode)."

    def reschedule_appointment(self, booking_id: str, new_date: str, new_time: str) -> Tuple[bool, str]:
        """
        Reschedules an existing appointment to new_date and new_time after checking availability.
        """
        with sheet_lock:
            if not booking_id:
                return False, "Booking ID is required."
            
            clean_id = booking_id.strip().upper()

            # Check if new slot is available
            available_slots = self.get_available_slots(new_date)
            if new_time not in available_slots:
                return False, f"Slot {new_time} on {new_date} is not available. Please pick another slot."

            # Calculate end time
            try:
                dt_start = datetime.strptime(new_time, "%H:%M")
                dt_end = dt_start + timedelta(minutes=settings.SLOT_DURATION_MINUTES)
                end_time = dt_end.strftime("%H:%M")
            except ValueError:
                end_time = new_time

            if self.initialized and self.appointments_sheet:
                try:
                    records = self.appointments_sheet.get_all_records()
                    row_idx = None
                    patient_name = "Patient"
                    patient_phone = ""

                    for idx, r in enumerate(records, start=2):
                        r_id = str(r.get("Booking_ID", "")).strip().upper()
                        if r_id == clean_id:
                            row_idx = idx
                            patient_name = str(r.get("Patient_Name", "Patient"))
                            patient_phone = str(r.get("Patient_Phone", ""))
                            break

                    if not row_idx:
                        return False, f"Appointment {booking_id} not found."

                    # Col 5: Appointment_Date, Col 6: Start_Time, Col 7: End_Time, Col 9: Status
                    self.appointments_sheet.update_cell(row_idx, 5, new_date)
                    self.appointments_sheet.update_cell(row_idx, 6, new_time)
                    self.appointments_sheet.update_cell(row_idx, 7, end_time)
                    self.appointments_sheet.update_cell(row_idx, 9, "RESCHEDULED")
                    logger.info(f"Appointment {clean_id} rescheduled to {new_date} {new_time} in row {row_idx}.")

                    # Send patient WhatsApp notification
                    send_patient_whatsapp_notification({
                        "booking_id": clean_id,
                        "patient_name": patient_name,
                        "patient_phone": patient_phone,
                        "appointment_date": new_date,
                        "start_time": new_time
                    }, action="RESCHEDULED")

                    return True, f"Appointment {clean_id} successfully rescheduled to {new_date} at {new_time}."
                except Exception as e:
                    logger.error(f"Error rescheduling appointment in Google Sheet: {e}")
                    return False, f"Failed to update appointment: {str(e)}"
            else:
                logger.info(f"[LOCAL MOCK RESCHEDULE]: {clean_id} to {new_date} {new_time}")
                return True, f"Appointment {clean_id} successfully rescheduled to {new_date} at {new_time} (Mock mode)."

# Global instance
sheets_service = GoogleSheetsService()
