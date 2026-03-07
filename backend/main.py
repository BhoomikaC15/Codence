# main.py
# This is the heart of your backend.
# It creates the FastAPI server AND the Socket.IO server,
# then combines them so they run together on one port.

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all our room/player functions from game_state.py
from game_state import (
    create_room,
    join_room,
    leave_room,
    update_score,
    get_leaderboard,
    get_room,
    get_player_room
)

# ──────────────────────────────────────────────
# 1. CREATE THE SOCKET.IO SERVER
# ──────────────────────────────────────────────
# async_mode="asgi"   → makes it compatible with FastAPI
# cors_allowed_origins="*" → allows your React app to connect
#   (In production/deployment, replace "*" with your real frontend URL)
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

# ──────────────────────────────────────────────
# 2. CREATE THE FASTAPI APP
# ──────────────────────────────────────────────
app = FastAPI(
    title="Codence Backend",
    description="Multiplayer RPG code learning game backend",
    version="1.0.0"
)

# CORS middleware — lets your React frontend talk to this server
# Without this, browsers will block the connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# 3. COMBINE FASTAPI + SOCKET.IO INTO ONE APP
# ──────────────────────────────────────────────
# This is the app you run with uvicorn (not "app" — "combined_app")
combined_app = socketio.ASGIApp(sio, other_asgi_app=app)


# ══════════════════════════════════════════════
# FASTAPI REST ROUTES
# These are normal HTTP endpoints you can visit in a browser
# ══════════════════════════════════════════════

@app.get("/")
async def root():
    """Homepage — just confirms the server is running."""
    return {
        "message": "🎮 Welcome to the Codence Backend!",
        "status": "online"
    }

@app.get("/health")
async def health_check():
    """Health check — your frontend or AWS can ping this to confirm server is alive."""
    return {"status": "ok"}

@app.get("/rooms")
async def list_rooms():
    """
    Debug route — shows all active rooms.
    Useful during development. Remove or protect this in production.
    """
    from game_state import rooms
    return {"active_rooms": list(rooms.keys()), "count": len(rooms)}


# ══════════════════════════════════════════════
# SOCKET.IO EVENT HANDLERS
# These fire when players send events from the React frontend
# ══════════════════════════════════════════════

@sio.event
async def connect(sid, environ):
    """
    Fires automatically when a player's browser connects.
    sid = unique ID assigned to this connection (like a player ID)
    """
    print(f"✅ Player connected: {sid}")
    # Send a welcome message to just this player
    await sio.emit("welcome", {
        "message": "Connected to Codence! 🎮",
        "your_id": sid
    }, to=sid)


@sio.event
async def disconnect(sid):
    """
    Fires automatically when a player disconnects
    (closes tab, loses internet, etc.)
    We need to remove them from their room.
    """
    print(f"❌ Player disconnected: {sid}")

    # Find which room this player was in
    room_code = get_player_room(sid)

    if room_code:
        room = get_room(room_code)
        if room and sid in room["players"]:
            username = room["players"][sid]["username"]
            leave_room(room_code, sid)
            await sio.leave_room(sid, room_code)

            # Tell everyone left in the room who left
            await sio.emit("player_left", {
                "username": username,
                "message": f"{username} disconnected."
            }, room=room_code)


# ──────────────────────────────────────────────
# ROOM EVENTS
# ──────────────────────────────────────────────

@sio.event
async def create_room_event(sid, data):
    """
    A player wants to create a new room.

    Frontend sends:  { "username": "Alice" }
    Server responds: { "room_code": "XK92TL" }  (back to this player only)
    """
    username = data.get("username", "Unknown Player")

    # Create the room in our game state
    room_code = create_room(host_sid=sid, host_username=username)

    # Register this socket connection with the SocketIO room
    # (This is what lets us broadcast to everyone in the room later)
    await sio.enter_room(sid, room_code)

    # Send the room code back to the player who created it
    await sio.emit("room_created", {
        "room_code": room_code,
        "message": f"Room {room_code} created! Share this code with friends."
    }, to=sid)


@sio.event
async def join_room_event(sid, data):
    """
    A player wants to join an existing room using a code.

    Frontend sends:  { "room_code": "XK92TL", "username": "Bob" }
    Server responds: broadcasts "player_joined" to everyone in the room
    """
    room_code = data.get("room_code", "").upper().strip()
    username  = data.get("username", "Unknown Player")

    # Try to add them to the room
    success, message = join_room(room_code, sid, username)

    if not success:
        # Something went wrong — tell only this player
        await sio.emit("error", {"message": message}, to=sid)
        return

    # Register their socket with the SocketIO room channel
    await sio.enter_room(sid, room_code)

    # Build the current player list to send to everyone
    room = get_room(room_code)
    player_list = [
        p["username"] for p in room["players"].values()
    ]

    # Broadcast to ALL players in the room (including the new one)
    await sio.emit("player_joined", {
        "username":  username,
        "players":   player_list,
        "message":   f"{username} joined the room!"
    }, room=room_code)


@sio.event
async def leave_room_event(sid, data):
    """
    A player manually clicks 'Leave Room'.

    Frontend sends: { "room_code": "XK92TL" }
    """
    room_code = data.get("room_code", "").upper().strip()
    room = get_room(room_code)

    if room and sid in room["players"]:
        username = room["players"][sid]["username"]
        leave_room(room_code, sid)
        await sio.leave_room(sid, room_code)

        # Notify remaining players
        await sio.emit("player_left", {
            "username": username,
            "message":  f"{username} left the room."
        }, room=room_code)


# ──────────────────────────────────────────────
# SCORE & LEADERBOARD EVENTS
# ──────────────────────────────────────────────

@sio.event
async def submit_score(sid, data):
    """
    A player submits their score for the current round.

    Frontend sends: { "room_code": "XK92TL", "points": 10 }
    Server updates their score and broadcasts the new leaderboard to everyone.
    """
    room_code = data.get("room_code", "").upper().strip()
    points    = data.get("points", 0)

    # Update their score in game state
    update_score(room_code, sid, points)

    # Get the updated leaderboard
    leaderboard = get_leaderboard(room_code)

    # Broadcast new leaderboard to everyone in the room
    await sio.emit("leaderboard_update", {
        "leaderboard": leaderboard
    }, room=room_code)


@sio.event
async def request_leaderboard(sid, data):
    """
    A player requests the current leaderboard.

    Frontend sends: { "room_code": "XK92TL" }
    """
    room_code   = data.get("room_code", "").upper().strip()
    leaderboard = get_leaderboard(room_code)

    await sio.emit("leaderboard_update", {
        "leaderboard": leaderboard
    }, to=sid)


# ──────────────────────────────────────────────
# TEST EVENT
# ──────────────────────────────────────────────

@sio.event
async def ping(sid, data):
    """
    Simple ping/pong test.
    Frontend sends "ping" → server replies "pong".
    Great for confirming the connection works.
    """
    print(f"🏓 Ping from {sid}")
    await sio.emit("pong", {
        "message": "pong! Server received your ping ✅"
    }, to=sid)