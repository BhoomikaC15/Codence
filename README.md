# Codence 🌲✨
> Master code through battle. Learn, compete, and level up with your guild.

Built for the **Amazon Nova AI Hackathon 2026** — Multimodal Understanding category.

---

## 🎮 What is Codence?

Codence is a multiplayer RPG-styled, pixel-art themed web app that makes learning code interactive and competitive.

Students often glance at code, think they understand it, and move on — only to forget everything later. Codence fixes that by making them *do something* with the code rather than just read it.

### How it works
1. 🏰 Players create or join a private **Guild** room.
2. 📜 A player submits a code snippet.
3. 🧠 **Amazon Nova Lite** explains the code statement by statement.
4. 🔊 **Amazon Polly (Neural TTS)** converts the explanation to voice.
5. ⚔️ In the game round, code lines vanish and players fill blanks from memory.
6. 🧩 **Nova Lite** generates quiz questions and evaluates answers.
7. 🏆 Live leaderboard keeps the guild battle competitive.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS, Framer Motion, Monaco Editor |
| Backend | Python, FastAPI, python-socketio, Uvicorn |
| AI (Code Understanding) | Amazon Bedrock Runtime with **Nova Lite** |
| AI (Voice) | **Amazon Polly** (Neural TTS) |
| Realtime | Socket.IO |

---

## 📁 Project Structure

```text
Codence/
├── .env
├── README.md
├── backend/
│   ├── main.py                # FastAPI + Socket.IO combined ASGI app
│   ├── game_state.py          # In-memory rooms, players, scores, leaderboard
│   ├── bedrock.py             # Nova Lite explanation + Polly TTS integration
│   ├── quiz_generator.py      # Nova Lite quiz generation and answer evaluation
│   └── requirements.txt
└── frontend/
    ├── package.json
    ├── .env                   # REACT_APP_BACKEND_URL
    ├── public/
    └── src/
        ├── App.js
        ├── Components/
        │   ├── PageTransition.js
        │   └── PixelButton.js
        ├── pages/
        │   ├── LandingPage.js
        │   ├── CreateGuild.js
        │   ├── JoinGuild.js
        │   ├── GuildLobby.js
        │   ├── CodeInput.js
        │   ├── Explanation.js
        │   ├── Game.js
        │   ├── Quiz.js
        │   └── Results.js
        └── socket/
            └── socket.js
```

---

## 🚀 Getting Started

### 1) Clone and configure env
```bash
git clone <your-repo-url>
cd Codence
```

Create a root `.env` file:

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1

BEDROCK_REGION=us-east-1
BEDROCK_EXPLAIN_MODEL_ID=us.amazon.nova-lite-v1:0

POLLY_REGION=ap-south-1
POLLY_VOICE_ID=Joanna
```

### 2) Backend
```bash
# from repo root
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r backend/requirements.txt
python -m uvicorn --app-dir backend main:combined_app --reload
```

Backend runs on: `http://localhost:8000`

### 3) Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

Set frontend backend URL in `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 🤖 AI Integration

| Service | Role in Codence |
|---|---|
| **Nova Lite (Bedrock)** | Code explanation, quiz generation, answer evaluation |
| **Amazon Polly** | Voice narration for code explanations |

### AI-driven flow
1. Submit code snippet.
2. Nova Lite returns explanation text.
3. Polly generates narration audio.
4. Nova Lite creates 5-question MCQ quiz.
5. Nova Lite evaluates player fill-in answers.

---

## 🔌 API Endpoints

### REST endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Basic welcome + online status |
| `GET` | `/health` | Health check |
| `GET` | `/rooms` | Active room codes and count |
| `POST` | `/explain-code` | Nova Lite explanation + Polly audio (`audio_base64`) |
| `POST` | `/generate-quiz` | Generate MCQ quiz from submitted code |
| `POST` | `/evaluate-answer` | Evaluate fill-in-the-blank answer |

### Socket.IO events (core)

| Event | Direction | Description |
|---|---|---|
| `create_room_event` | Client → Server | Create guild room |
| `join_room_event` | Client → Server | Join room by code |
| `leave_room_event` | Client → Server | Leave room |
| `submit_score` | Client → Server | Submit points and trigger leaderboard refresh |
| `request_leaderboard` | Client → Server | Fetch latest leaderboard |
| `player_joined` | Server → Room | Notify room on join |
| `player_left` | Server → Room | Notify room on leave/disconnect |
| `leaderboard_update` | Server → Room / Client | Push leaderboard updates |
| `welcome` | Server → Client | Initial socket welcome payload |
| `pong` | Server → Client | Ping response |

---

## ⚙️ Backend Notes

- Room codes are generated in-memory; data resets when backend restarts.
- Empty rooms are auto-deleted.
- `.env` loading is path-stable from backend modules.
- CORS is currently open (`*`) for hackathon speed; lock this down for production.

---

## 👾 Team

| Name | Role |
|---|---|
| Bhoomika Choudhury | Frontend — UI & game screens |
| Disha Tyagi | AI explanation + voice integration |
| Himani Lal | Quiz generation + answer evaluation |
| Ghanisht Sobti | Backend — FastAPI, Socket.IO, rooms, deployment |

---

## 🏆 Hackathon

Submitted under **Multimodal Understanding** for the Amazon Nova AI Hackathon 2026, combining code reasoning, voice narration, multiplayer gameplay, and quiz-based reinforcement.

**#AmazonNova**