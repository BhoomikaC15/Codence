# Codence 🌲✨
> Master code through battle. Learn, compete, and level up with your guild.

Built for the **Amazon Nova AI Hackathon 2026**.

---

## 🎮 What is Codence?

Codence is a multiplayer RPG-styled, pixel-art themed web app that makes learning code actually fun.

Students often glance at code, think they understand it, and move on — only to forget everything later. Codence fixes that by making them *do something* with the code rather than just read it.

### How it works:
1. 🏰 Players create or join a private **Guild** (room) with friends
2. 📜 A player submits a code file — any language
3. 🧠 **Amazon Nova AI** explains it statement by statement with text, visuals, and voice
4. ⚔️ The game begins — lines of code **vanish** and a timer starts
5. ✍️ Players race to fill in the missing lines from memory
6. 🧩 **Quiz rounds** test deeper understanding of the code
7. 🏆 Points and leaderboard keep it competitive — within your guild only

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Framer Motion, Monaco Editor |
| Backend | Python, FastAPI, python-socketio |
| AI | Amazon Bedrock — Nova Pro, Nova Sonic, Nova Lite |
| Realtime | Socket.io (multiplayer room sync) |

---

## 📁 Project Structure
```
Codence/
├── frontend/         → React app (UI, game screens, animations)
├── backend/          → FastAPI server, Socket.IO, game state & Nova AI integration
└── README.md
```

---

## 🚀 Getting Started

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate     # Mac/Linux
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:combined_app --reload --port 8001
 maind
🤖 Nova AI Integration

Codence integrates multiple AI models through Amazon Bedrock to power different stages of the gameplay experience.

Model	Role in Codence
Nova Pro	Analyzes submitted code and generates line-by-line explanations of the program logic
Nova Sonic	Converts explanations into voice narration during the learning phase
Nova Lite	Generates quiz questions from the submitted code and evaluates player answers during quiz rounds
AI-Driven Learning Flow

📜 A player uploads a code file

🧠 Nova Pro analyzes the code and generates a clear step-by-step explanation

🔊 Nova Sonic converts the explanation into audio narration for better understanding

🧩 Nova Lite generates multiple-choice quiz questions based on the code

⚡ During quiz rounds, Nova Lite evaluates answers and helps calculate scores

This demonstrates multimodal AI capabilities including code reasoning, natural language explanation, and voice interaction.

⚙️ Backend Infrastructure

The backend powers all real-time multiplayer functionality and game state management.

Key Features

FastAPI server with REST endpoints and health checks

Socket.IO integration for real-time communication between players

Guild Room System — players can create rooms and share a unique 6-digit join code

Game State Management — tracks players, scores, rounds, and leaderboard

Automatic Cleanup — removes disconnected players and deletes empty rooms

Live Leaderboard Updates — score changes are broadcast instantly to all players

🔌 Socket.IO Events
Event	Direction	Description
create_room_event	Client → Server	Creates a guild room and returns a 6-digit code
join_room_event	Client → Server	Joins an existing room using the code
leave_room_event	Client → Server	Removes a player from a room
submit_score	Client → Server	Updates player score and broadcasts leaderboard
player_joined	Server → All	Notifies room when a player joins
player_left	Server → All	Notifies room when a player leaves
leaderboard_update	Server → All	Sends live leaderboard updates
📂 Important Backend Files

backend/main.py → FastAPI + Socket.IO server and event handlers

backend/game_state.py → Room creation, player management, and score tracking

backend/requirements.txt → Python dependencies

👾 Team
Name	Role
Bhoomika Choudhury	Frontend — UI & Game Screens
Disha Tyagi	Backend — FastAPI Server, Socket.IO Multiplayer & Game State
Himani Lal	Backend — Rooms, Sockets & Deployment
Ghanisht Sobti	AI Integration — Nova Pro & Nova Sonic Code Explanation
=======
```
---
## 🧠 AI Code Explanation

Codence uses **Amazon Nova AI via AWS Bedrock** to explain code before gameplay begins.

When a user submits code:

1. The backend sends the code to **Amazon Nova Pro**.
2. Nova Pro generates a **statement-by-statement explanation** of the code.
3. The explanation is sent to **Amazon Nova Sonic** to generate **voice narration**.
4. The backend returns both **text explanation and audio narration** to the frontend.

### API Endpoint

POST /explain-code

Request:
{
  "code": "def add(a,b): return a+b"
}

Response:
{
  "explanation": "Step-by-step explanation of the code",
  "audio_base64": "generated audio narration"
}

## 🤖 Nova AI Integration

| Model | Role in Codence |
|---|---|
| **Nova Pro** | Analyzes submitted code, generates statement-by-statement explanation and quiz questions |
| **Nova Sonic** | Converts explanation to voice narration played during the explanation phase |
| **Nova Lite** | Evaluates player fill-in-the-blank answers and generates quiz options |

---
## ⚙️ Backend Infrastructure

The backend powers all real-time multiplayer functionality and game state for Codence.

### What's built:
- **FastAPI server** with REST routes and health check endpoint
- **Socket.IO integration** for real-time communication between players
- **Room (Guild) system** — players can create a room and get a unique 6-digit code, or join an existing room using a code
- **Game state management** — tracks all players in a room, their scores, current round, and leaderboard
- **Auto cleanup** — empty rooms are deleted automatically, disconnected players are removed gracefully
- **Leaderboard broadcasting** — score updates are pushed live to all players in the room

### Socket.IO Events:

| Event | Direction | What it does |
|---|---|---|
| `create_room_event` | Client → Server | Creates a new guild room, returns 6-digit code |
| `join_room_event` | Client → Server | Joins an existing room using a code |
| `leave_room_event` | Client → Server | Removes player from room |
| `submit_score` | Client → Server | Updates player score, broadcasts leaderboard |
| `player_joined` | Server → All | Notifies room when someone joins |
| `player_left` | Server → All | Notifies room when someone leaves |
| `leaderboard_update` | Server → All | Pushes live leaderboard to all players |

### Files:
- `backend/main.py` — FastAPI + Socket.IO server, all event handlers
- `backend/game_state.py` — Room creation, player management, score tracking
- `backend/requirements.txt` — Python dependencies

---

## 👾 Team

| Name | Role |
|---|---|
| Bhoomika Choudhury | Frontend — UI & Game Screens |
| Disha Tyagi | Backend — FastAPI Server, Socket.IO Multiplayer & Game State |
| Himani Lal | Backend —  Rooms, Sockets & Deployment  |
| Ghanisht Sobti | Nova Pro + Sonic — Code Explanation |

---

## 🏆 Hackathon

This project is submitted under the **Multimodal Understanding** category of the Amazon Nova AI Hackathon 2026, demonstrating the use of Nova Pro, Nova Sonic, and Nova Lite across text, voicmain
