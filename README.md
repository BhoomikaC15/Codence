🎮 What is Codence?

Codence is a multiplayer RPG-styled, pixel-art themed web application that makes learning programming interactive, competitive, and fun.

Many students skim through code and think they understand it, but quickly forget the logic later. Codence solves this problem by turning code learning into an active memory challenge where players must recall, reconstruct, and understand code in real time.

Instead of passively reading code, players engage with it through gameplay, quizzes, and competition.

⚔️ How It Works

🏰 Players create or join a private Guild (room) with friends

📜 A player submits a code file (any programming language)

🧠 AI powered by Amazon Bedrock explains the code step-by-step with text, visuals, and voice narration

⚡ The challenge begins — lines of code disappear and a timer starts

✍️ Players race to reconstruct the missing lines from memory

🧩 AI-generated quiz rounds test deeper understanding of the code

🏆 Points are awarded and a live leaderboard keeps the competition intense within the guild

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, Tailwind CSS, Framer Motion, Monaco Editor
Backend	Python, FastAPI, python-socketio
AI	Amazon Bedrock — Nova Pro, Nova Sonic, Nova Lite
Realtime	Socket.IO
📁 Project Structure
Codence/
├── frontend/        → React application (UI, game screens, animations)
├── backend/         → FastAPI server, Socket.IO, game state & AI integration
└── README.md
🚀 Getting Started
Frontend
cd frontend
npm install
npm start
Backend
cd backend
python -m venv .venv
source .venv/bin/activate     # Mac/Linux
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:combined_app --reload --port 8001
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