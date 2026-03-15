import socketio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from bedrock import explain_code, text_to_speech
from quiz_generator import generate_quiz, evaluate_answer

from game_state import (
    create_room,
    join_room,
    leave_room,
    update_score,
    get_leaderboard,
    get_room,
    get_player_room
)

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

app = FastAPI(
    title="Codence Backend",
    description="Multiplayer RPG code learning game backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    code: str

class CodeResponse(BaseModel):
    explanation: str
    audio_base64: str


class QuizRequest(BaseModel):
    code_snippet: str


class EvaluateRequest(BaseModel):
    original_code_line: str
    player_answer: str
    blank_word: str

combined_app = socketio.ASGIApp(sio, other_asgi_app=app)


# ══════════════════════════════════════════════
# FASTAPI REST ROUTES
# ══════════════════════════════════════════════

@app.get("/")
async def root():
    return {
        "message": "🎮 Welcome to the Codence Backend!",
        "status": "online"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/rooms")
async def list_rooms():
    from game_state import rooms
    return {"active_rooms": list(rooms.keys()), "count": len(rooms)}

@app.post("/explain-code", response_model=CodeResponse)
def explain_code_endpoint(request: CodeRequest):
    if not request.code or not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="'code' field is required and cannot be empty."
        )

    try:
        print("→ Calling Nova Pro to explain code...")
        explanation = explain_code(request.code)
        print("✓ Explanation received.")
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI explanation failed: {str(e)}")

    try:
        print("→ Calling Nova Sonic...")
        audio_base64 = text_to_speech(explanation)
        print("✓ Audio generated")
    except Exception as e:
        print("Audio error:", e)
        audio_base64 = ""

    return CodeResponse(
        explanation=explanation,
        audio_base64=audio_base64
    )


@app.post("/generate-quiz")
def generate_quiz_endpoint(request: QuizRequest):
    if not request.code_snippet or not request.code_snippet.strip():
        raise HTTPException(
            status_code=400,
            detail="'code_snippet' field is required and cannot be empty."
        )

    result = generate_quiz(request.code_snippet)
    if not result.get("success"):
        raise HTTPException(
            status_code=502,
            detail=result.get("error", "Quiz generation failed.")
        )

    return {
        "success": True,
        "quiz": result.get("data", {})
    }


@app.post("/evaluate-answer")
def evaluate_answer_endpoint(request: EvaluateRequest):
    if not request.player_answer or not request.player_answer.strip():
        raise HTTPException(
            status_code=400,
            detail="'player_answer' field is required and cannot be empty."
        )

    result = evaluate_answer(
        original_code_line=request.original_code_line,
        player_answer=request.player_answer,
        blank_word=request.blank_word
    )
    if not result.get("success"):
        raise HTTPException(
            status_code=502,
            detail=result.get("error", "Answer evaluation failed.")
        )

    return {
        "success": True,
        "evaluation": result.get("data", {})
    }


# ══════════════════════════════════════════════
# SOCKET.IO EVENT HANDLERS
# ══════════════════════════════════════════════

@sio.event
async def connect(sid, environ):
    print(f"✅ Player connected: {sid}")
    await sio.emit("welcome", {
        "message": "Connected to Codence! 🎮",
        "your_id": sid
    }, to=sid)


@sio.event
async def disconnect(sid):
    print(f"❌ Player disconnected: {sid}")
    room_code = get_player_room(sid)
    if room_code:
        room = get_room(room_code)
        if room and sid in room["players"]:
            username = room["players"][sid]["username"]
            leave_room(room_code, sid)
            await sio.leave_room(sid, room_code)
            await sio.emit("player_left", {
                "username": username,
                "message": f"{username} disconnected."
            }, room=room_code)



@sio.event
async def create_room_event(sid, data):
    username = data.get("username", "Unknown Player")
    room_code = create_room(host_sid=sid, host_username=username)
    await sio.enter_room(sid, room_code)
    await sio.emit("room_created", {
        "room_code": room_code,
        "message": f"Room {room_code} created! Share this code with friends."
    }, to=sid)


@sio.event
async def join_room_event(sid, data):
    room_code = data.get("room_code", "").upper().strip()
    username  = data.get("username", "Unknown Player")
    success, message = join_room(room_code, sid, username)
    if not success:
        await sio.emit("error", {"message": message}, to=sid)
        return
    await sio.enter_room(sid, room_code)
    room = get_room(room_code)
    player_list = [p["username"] for p in room["players"].values()]
    await sio.emit("player_joined", {
        "username":  username,
        "players":   player_list,
        "message":   f"{username} joined the room!"
    }, room=room_code)


@sio.event
async def leave_room_event(sid, data):
    room_code = data.get("room_code", "").upper().strip()
    room = get_room(room_code)
    if room and sid in room["players"]:
        username = room["players"][sid]["username"]
        leave_room(room_code, sid)
        await sio.leave_room(sid, room_code)
        await sio.emit("player_left", {
            "username": username,
            "message":  f"{username} left the room."
        }, room=room_code)



@sio.event
async def submit_score(sid, data):
    room_code = data.get("room_code", "").upper().strip()
    points    = data.get("points", 0)
    update_score(room_code, sid, points)
    leaderboard = get_leaderboard(room_code)
    await sio.emit("leaderboard_update", {
        "leaderboard": leaderboard
    }, room=room_code)


@sio.event
async def request_leaderboard(sid, data):
    room_code   = data.get("room_code", "").upper().strip()
    leaderboard = get_leaderboard(room_code)
    await sio.emit("leaderboard_update", {
        "leaderboard": leaderboard
    }, to=sid)


@sio.event
async def ping(sid, data):
    print(f"🏓 Ping from {sid}")
    await sio.emit("pong", {
        "message": "pong! Server received your ping ✅"
    }, to=sid)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:combined_app", host="0.0.0.0", port=8000, reload=True)
