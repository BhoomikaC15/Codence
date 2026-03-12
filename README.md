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
├── backend/          → FastAPI server + Nova AI integration
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
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🤖 Nova AI Integration

| Model | Role in Codence |
|---|---|
| **Nova Pro** | Analyzes submitted code, generates statement-by-statement explanation and quiz questions |
| **Nova Sonic** | Converts explanation to voice narration played during the explanation phase |
| **Nova Lite** | Evaluates player fill-in-the-blank answers and generates quiz options |

---

## 👾 Team

| Name | Role |
|---|---|
| Bhoomika Choudhury | Frontend — UI & Game Screens |
| Disha Tyagi | Backend — Rooms, Sockets & Deployment |
| Himani Lal | Nova Lite — Quiz Generation |
| Ghanisht Sobti | Nova Pro + Sonic — Code Explanation |

---

## 🏆 Hackathon

This project is submitted under the **Multimodal Understanding** category of the Amazon Nova AI Hackathon 2026, demonstrating the use of Nova Pro, Nova Sonic, and Nova Lite across text, voice, and visual understanding.

#AmazonNova