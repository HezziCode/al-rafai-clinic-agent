import sys
import json
import urllib.request
import urllib.error

ASSISTANT_ID = "ca0ce886-2681-4888-b103-99ae48fcdc18"

SYSTEM_PROMPT = """## ROLE & IDENTITY
Aap Al-Rafai Clinic ki AI Voice Receptionist hain jo Dr. Fatima ki taraf se baat kar rahi hain.
Aapka lehja nihayat shista, meethha, professional aur madadgar hona chahiye.

## CLINIC DETAILS
- Doctor Name: Dr. Fatima (Clinic mein sirf aik hi doctor hain: Dr. Fatima). Mareez se doctor choose karne ka mat poochein, saari appointments Dr. Fatima ke sath hi hoti hain.
- Clinic Timings: Rozana Dopehar 12:00 PM se Shaam 6:00 PM (12:00 to 18:00).
- Appointment Duration: Har slot 30 minutes ka hota hai (12:00, 12:30, 13:00, 13:30, 14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00, 17:30).
- Clinic Address: 5A/2, North Karachi.
- Phone Number: +1 (555) 234-5678.

## LANGUAGE GUIDELINES
- Baat cheet Roman Urdu mein karein (jaise: "Aap kis tareekh ko tashreef lana chahein ge?", "Aapka shubh naam kya hai?").
- Agar mareez English mein baat kare toh aap foran English mein jawab dein.
- Hamesha izzat ke sath 'Aap' keh kar mukhatib karein.

## STEP-BY-STEP BOOKING FLOW
Aapko mareez se 5 zaroori tafseelat leni hain:
1. Patient ka Mukammal Naam (Full Name)
2. Contact Phone Number
3. Visit ki Wajah ya Checkup ka Maqsad (Reason for visit / symptoms)
4. Appointment ki Tareekh (Date in YYYY-MM-DD format, e.g. 2026-08-18)
5. Appointment ka Waqt (Time between 12:00 PM and 6:00 PM)

## TOOLS USAGE:
1. Jab mareez appointment book karne ka bole ya koi date bataye, pehle `get_available_slots` tool call karein taake Google Sheet se live open slots check ho sakein.
2. Mareez ko available slots batayein aur unse preferred time, naam, phone number aur bimari/wajah poochein.
3. Jab 5 cheezain mukammal ho jayein, foran `book_appointment` tool call karein. Yeh details direct Dr. Fatima ki Google Sheet mein save kar dega aur doctor ko WhatsApp par notify kar dega.
4. Booking ke baad mareez ko confirmation message dein: "Aapki appointment Dr. Fatima ke sath [Date] ko [Time] par confirm ho chuki hai. Shukriya!"
5. Agar mareez clinic timings, location ya services pooche toh `get_clinic_info` tool call karein ya direct jawab dein.
6. Agar appointment cancel karni ho toh `cancel_appointment` tool call karein.
7. Agar date/time tabdeel (reschedule) karni ho toh `reschedule_appointment` tool call karein."""

FIRST_MESSAGE = "Assalam-o-Alaikum! Main Dr. Fatima ke clinic ki AI assistant bol rahi hoon. Main aapki appointment book karne mein kya madad kar sakti hoon?"

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_available_slots",
            "description": "Checks available 30-minute appointment slots for Dr. Fatima on a specified date (12:00 PM to 6:00 PM).",
            "parameters": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "string",
                        "description": "Date in YYYY-MM-DD format, e.g. 2026-08-18"
                    }
                },
                "required": ["date"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "book_appointment",
            "description": "Saves and books an appointment for Dr. Fatima into the clinic Google Sheet ledger.",
            "parameters": {
                "type": "object",
                "properties": {
                    "patient_name": {
                        "type": "string",
                        "description": "Full name of the patient"
                    },
                    "patient_phone": {
                        "type": "string",
                        "description": "Contact phone number"
                    },
                    "visit_reason": {
                        "type": "string",
                        "description": "Reason for visit or main symptom"
                    },
                    "appointment_date": {
                        "type": "string",
                        "description": "Date in YYYY-MM-DD format"
                    },
                    "start_time": {
                        "type": "string",
                        "description": "Start time in HH:MM format between 12:00 and 18:00"
                    }
                },
                "required": ["patient_name", "patient_phone", "visit_reason", "appointment_date", "start_time"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_clinic_info",
            "description": "Returns clinic hours (12 PM - 6 PM Daily), address, and Dr. Fatima details.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "cancel_appointment",
            "description": "Cancels an existing appointment using booking ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "booking_id": {
                        "type": "string",
                        "description": "Booking ID string"
                    }
                },
                "required": ["booking_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "reschedule_appointment",
            "description": "Reschedules an appointment to a new date and time.",
            "parameters": {
                "type": "object",
                "properties": {
                    "booking_id": {"type": "string", "description": "Booking ID"},
                    "new_date": {"type": "string", "description": "New date in YYYY-MM-DD format"},
                    "new_time": {"type": "string", "description": "New time in HH:MM format"}
                },
                "required": ["booking_id", "new_date", "new_time"]
            }
        }
    }
]

def update_assistant(api_key: str):
    url = f"https://api.vapi.ai/assistant/{ASSISTANT_ID}"
    payload = {
        "name": "CarePulse Dr. Fatima Voice Receptionist",
        "firstMessage": FIRST_MESSAGE,
        "model": {
            "provider": "openai",
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                }
            ],
            "tools": TOOLS
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        method="PATCH"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"✅ SUCCESS: Assistant {ASSISTANT_ID} updated on Vapi!")
            print(f"Assistant Name: {data.get('name')}")
            return True
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode()
        print(f"❌ HTTP Error {e.code}: {err_msg}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python update_vapi_assistant.py <VAPI_PRIVATE_API_KEY>")
        sys.exit(1)
    
    key = sys.argv[1].strip()
    update_assistant(key)
