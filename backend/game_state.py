# In-memory store for all active rooms, players, and scores.

import random
import string

rooms = {}


def generate_room_code(length=6):
    """Generate a random 6-character alphanumeric room code."""
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


def create_room(host_sid, host_username):
    """Create a new room with the given host and return the room code."""
    room_code = generate_room_code()
    while room_code in rooms:
        room_code = generate_room_code()

    rooms[room_code] = {
        "players": {
            host_sid: {"username": host_username, "score": 0}
        },
        "host":    host_sid,
        "round":   0,
        "started": False
    }

    print(f"🏠 Room created: {room_code} — host: {host_username}")
    return room_code


def join_room(room_code, player_sid, username):
    """Add a player to a room. Returns (True, msg) on success or (False, msg) on failure."""
    if room_code not in rooms:
        return False, "Room not found. Check your code and try again."

    if rooms[room_code]["started"]:
        return False, "Sorry — this game has already started."

    if player_sid in rooms[room_code]["players"]:
        return False, "You are already in this room."

    rooms[room_code]["players"][player_sid] = {"username": username, "score": 0}
    print(f"➕ {username} joined room {room_code}")


def leave_room(room_code, player_sid):
    """Remove a player from a room and delete the room if it becomes empty."""
    if room_code not in rooms:
        return

    players = rooms[room_code]["players"]

    if player_sid in players:
        username = players[player_sid]["username"]
        del players[player_sid]
        print(f"➖ {username} left room {room_code}")

    if not players:
        del rooms[room_code]
        print(f"🗑️  Room {room_code} deleted — empty")


def update_score(room_code, player_sid, points):
    """Add points to a player's score."""
    if room_code in rooms and player_sid in rooms[room_code]["players"]:
        rooms[room_code]["players"][player_sid]["score"] += points
        username = rooms[room_code]["players"][player_sid]["username"]
        print(f"⭐ {username} scored {points} points in room {room_code}")


def get_leaderboard(room_code):
    """Return all players in a room sorted by score descending."""
    if room_code not in rooms:
        return []
    players = rooms[room_code]["players"]
    return sorted(
        [{"username": p["username"], "score": p["score"]} for p in players.values()],
        key=lambda x: x["score"],
        reverse=True,
    )


def get_room(room_code):
    """Return room data dict or None."""
    return rooms.get(room_code)


def get_player_room(player_sid):
    """Return the room code a player is currently in, or None."""
    for room_code, room_data in rooms.items():
        if player_sid in room_data["players"]:
            return room_code
    return None
