<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/OpenAI_Agents_SDK-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white" alt="Google Sheets" />
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio" />
  <img src="https://img.shields.io/badge/Vapi_Voice-6C63FF?style=for-the-badge&logo=audiomack&logoColor=white" alt="Vapi" />
  <img src="https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<h1 align="center">🏥 CarePulse AI — Clinic Booking Agent</h1>

<p align="center">
  <strong>AI-powered appointment booking system for a single-doctor medical practice</strong><br/>
  Real-time text chat (WebSocket streaming) · Vapi voice agent · Google Sheets ledger · WhatsApp doctor alerts
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#environment-variables">Environment</a> •
  <a href="#license">License</a>
</p>

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Agent AI System** | Triage → FAQ / Booking agent handoff architecture using [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) |
| **Real-Time WebSocket Chat** | Token-by-token streaming via `Runner.run_streamed()` for a true conversational feel |
| **Vapi Voice Integration** | Webhook endpoint for [Vapi AI](https://vapi.ai/) voice agent — patients can call in and book by voice |
| **Google Sheets Ledger** | All appointments stored in a shared Google Sheet with auto-created tabs (`Appointments`, `Doctor_Schedules`, `Blocked_Slots`) |
| **Thread-Safe Booking** | Python `threading.Lock` prevents double-booking race conditions on concurrent requests |
| **WhatsApp Doctor Alerts** | Instant Twilio WhatsApp notification to the doctor on every new booking |
| **Persistent Chat Memory** | `SQLiteSession` from OpenAI Agents SDK maintains multi-turn conversation context per session |
| **Slot Availability Checker** | Interactive date picker on the frontend that queries live slot data from Google Sheets |
| **Fallback Call CTA** | After 3 failed date/time input attempts, the chatbot shows a direct phone call button |
| **Glassmorphic UI** | Dark-mode clinic website with glass-panel cards, gradient CTAs, and smooth micro-animations |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND  (Next.js 14)                       │
│  ┌──────────┐  ┌───────────┐  ┌────────────┐  ┌─────────────────┐  │
│  │  Navbar   │  │   Hero    │  │ SlotChecker│  │   ChatWidget    │  │
│  │          │  │           │  │  (REST)    │  │  (WebSocket)    │  │
│  └──────────┘  └───────────┘  └─────┬──────┘  └────────┬────────┘  │
│                                     │                   │           │
└─────────────────────────────────────┼───────────────────┼───────────┘
                                      │                   │
                              REST API │        WebSocket  │
                                      ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND  (FastAPI)                           │
│                                                                     │
│  ┌──────────────────┐   ┌──────────────────────────────────────┐   │
│  │  /api/appointments│   │  /ws/chat/{session_id}               │   │
│  │  /api/clinic/info │   │  Runner.run_streamed(triage_agent)   │   │
│  │  /api/vapi/webhook│   │                                      │   │
│  └────────┬─────────┘   │  ┌────────────┐                      │   │
│           │              │  │TriageAgent │──┐                   │   │
│           │              │  └────────────┘  │ handoff            │   │
│           │              │       ┌─────────┼─────────┐          │   │
│           │              │  ┌────▼───┐  ┌──▼────────┐│          │   │
│           │              │  │FAQAgent│  │BookingAgent││          │   │
│           │              │  └────────┘  └─────┬─────┘│          │   │
│           │              │                    │      │          │   │
│           │              └────────────────────┼──────┘          │   │
│           │                                   │                 │   │
│           ▼                                   ▼                 │   │
│  ┌─────────────────────────────────────────────────────┐        │   │
│  │              GoogleSheetsService                     │        │   │
│  │  • get_available_slots()   • book_appointment()      │        │   │
│  │  • Thread-safe lock        • Auto-create worksheet   │        │   │
│  └──────────────────────┬──────────────────────────────┘        │   │
│                         │                                       │   │
│  ┌──────────────────────▼──────────────────────────────┐        │   │
│  │           WhatsApp Notifier (Twilio)                 │        │   │
│  └─────────────────────────────────────────────────────┘        │   │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    Google Sheets    │
              │  (Appointment DB)   │
              └─────────────────────┘
```

---

## Tech Stack

### Backend

| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Async web framework with WebSocket support |
| **OpenAI Agents SDK** | Multi-agent orchestration with handoffs, tool calling, and streaming |
| **gspread** + **google-auth** | Google Sheets API client for appointment CRUD |
| **Twilio** | WhatsApp messaging for doctor notifications |
| **Pydantic v2** | Request/response schema validation |
| **SQLite** (`SQLiteSession`) | Persistent multi-turn chat memory |
| **Tenacity** | Retry logic for Google Sheets API calls |

### Frontend

| Technology | Purpose |
|-----------|---------|
| **Next.js 14** (App Router) | React framework with server components |
| **TypeScript** | Type-safe frontend development |
| **Tailwind CSS 3** | Utility-first styling with custom design tokens |
| **Lucide React** | Icon library |
| **WebSocket API** | Real-time bidirectional chat streaming |

---

## Project Structure

```
clinic-booking-agent/
│
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI app, CORS, lifespan, router mounts
│   │   ├── __init__.py
│   │   │
│   │   ├── agents/                   # OpenAI Agents SDK multi-agent system
│   │   │   ├── triage.py             # Triage router — determines intent, hands off
│   │   │   ├── faq.py                # FAQ agent — clinic info, hours, services
│   │   │   ├── booking.py            # Booking agent — collects details, books slots
│   │   │   ├── tools.py              # @function_tool definitions (slots, booking, info)
│   │   │   └── context.py            # ClinicContext dataclass for session state
│   │   │
│   │   ├── api/                      # Route handlers
│   │   │   ├── websocket.py          # /ws/chat/{session_id} — streaming AI chat
│   │   │   ├── appointments.py       # REST: /api/appointments/slots, /book, /list
│   │   │   └── vapi_webhook.py       # POST /api/vapi/webhook — voice agent integration
│   │   │
│   │   ├── core/                     # Infrastructure services
│   │   │   ├── config.py             # Pydantic Settings (env-driven configuration)
│   │   │   ├── sheets.py             # GoogleSheetsService (thread-safe, auto-init)
│   │   │   └── whatsapp.py           # Twilio WhatsApp notification sender
│   │   │
│   │   └── models/
│   │       └── schemas.py            # Pydantic v2 request/response models
│   │
│   ├── .env                          # Environment variables (not committed)
│   ├── service_account.json          # GCP service account key (not committed)
│   └── requirements.txt              # Python dependencies
│
├── frontend/                         # Next.js 14 App Router
│   ├── app/
│   │   ├── layout.tsx                # Root layout with metadata & fonts
│   │   ├── page.tsx                  # Homepage — assembles all sections
│   │   └── globals.css               # Design tokens, glassmorphism, animations
│   │
│   ├── components/
│   │   ├── Navbar.tsx                # Top navigation with chat & dashboard triggers
│   │   ├── Hero.tsx                  # Hero section with gradient CTA
│   │   ├── StatsBar.tsx              # Trust indicators (patients, ratings, etc.)
│   │   ├── ServicesBento.tsx         # Services grid with glass-card hover effects
│   │   ├── SlotChecker.tsx           # Interactive date → slot availability checker
│   │   ├── ChatWidget.tsx            # Floating AI chatbot drawer (WebSocket)
│   │   └── AppointmentsDrawer.tsx    # Doctor-facing appointment list panel
│   │
│   ├── tailwind.config.js            # Custom colors (navy, teal, cyan) & fonts
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Python 3.11+** and `pip`
- **Node.js 18+** and `npm`
- **Google Cloud** service account with Sheets API enabled
- **OpenAI API** key (GPT-4o / GPT-4o-mini)
- *(Optional)* Twilio account for WhatsApp notifications
- *(Optional)* [Vapi](https://vapi.ai/) account for voice agent

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/clinic-booking-agent.git
cd clinic-booking-agent
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file from the template:

```bash
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
```

Fill in your credentials (see [Environment Variables](#environment-variables) below).

Place your Google Cloud `service_account.json` in the `backend/` directory.

> **Important:** Share your Google Sheet with your service account email (e.g., `your-sa@your-project.iam.gserviceaccount.com`) as an **Editor**.

### 3. Start the Backend

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API is now live at **http://localhost:8000**

### 4. Frontend Setup

```bash
cd ../frontend

npm install
npm run dev
```

The UI is now live at **http://localhost:3000**

---

## API Reference

### WebSocket

| Endpoint | Description |
|----------|-------------|
| `ws://localhost:8000/ws/chat/{session_id}` | Bidirectional streaming AI chat |

**Send** (JSON):
```json
{ "content": "I want to book an appointment" }
```

**Receive** (JSON):
```json
{ "type": "stream", "delta": "Sure" }
{ "type": "complete", "content": "Sure, I can help...", "agent": "BookingAgent" }
{ "type": "error", "error": "An error occurred." }
```

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — returns clinic name, doctor, sheet connection status |
| `GET` | `/api/clinic/info` | Clinic details (name, doctor, hours, address, services) |
| `GET` | `/api/appointments/slots?date=YYYY-MM-DD` | Available 30-min slots for a given date |
| `POST` | `/api/appointments/book` | Book an appointment (JSON body) |
| `GET` | `/api/appointments/list` | List all appointments (doctor dashboard) |
| `POST` | `/api/vapi/webhook` | Vapi AI voice agent tool-call webhook |

### Booking Request Body

```json
{
  "patient_name": "John Doe",
  "patient_phone": "+1234567890",
  "visit_reason": "Annual checkup",
  "appointment_date": "2026-08-20",
  "start_time": "14:00"
}
```

---

## Environment Variables

Create a `backend/.env` file with the following variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | OpenAI API key for GPT-4o / GPT-4o-mini |
| `GOOGLE_SHEET_ID` | ✅ | Google Sheet ID for appointment storage |
| `GOOGLE_SERVICE_ACCOUNT_PATH` | ✅ | Path to GCP service account JSON (default: `service_account.json`) |
| `TWILIO_ACCOUNT_SID` | ❌ | Twilio Account SID (falls back to console logging) |
| `TWILIO_AUTH_TOKEN` | ❌ | Twilio Auth Token |
| `TWILIO_WHATSAPP_NUMBER` | ❌ | Twilio WhatsApp sender number |
| `DOCTOR_WHATSAPP_NUMBER` | ❌ | Doctor's WhatsApp number for alerts |
| `CLINIC_NAME` | ❌ | Clinic display name |
| `CLINIC_DOCTOR_NAME` | ❌ | Doctor's full name |
| `CLINIC_PHONE` | ❌ | Clinic phone number |
| `CLINIC_ADDRESS` | ❌ | Clinic street address |
| `CLINIC_HOURS` | ❌ | Display string for clinic hours |

---

## Agent System

The backend uses a **multi-agent triage architecture** powered by the OpenAI Agents SDK:

```
User Message
     │
     ▼
┌──────────┐
│  Triage  │  ← Determines intent (FAQ vs. Booking)
│  Agent   │     Model: gpt-4o-mini  |  Temp: 0.3
└────┬─────┘
     │ handoff
     ├──────────────────────┐
     ▼                      ▼
┌──────────┐          ┌───────────┐
│   FAQ    │          │  Booking  │
│  Agent   │          │   Agent   │
│ gpt-4o-  │          │  gpt-4o   │
│  mini    │          │  Temp:0.2 │
└──────────┘          └───────────┘
     │                      │
     ▼                      ▼
get_clinic_info()     get_available_slots()
                      book_appointment()
                      save_patient_details()
```

- **TriageAgent** — Front-desk router. Greets users and hands off to the correct specialist.
- **FAQAgent** — Answers clinic info questions (hours, address, services, doctor details).
- **BookingAgent** — Conversationally collects patient details, checks live slot availability, and confirms bookings.

---

## License

This project is for educational and portfolio demonstration purposes.

---

<p align="center">
  Built with ❤️ using Next.js 14, FastAPI, and the OpenAI Agents SDK
</p>
