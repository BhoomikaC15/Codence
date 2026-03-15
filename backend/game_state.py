# game_state.py
# This file manages all rooms, players, and scores in memory.
# Think of it as the "database" for your game — while the server is running,
# all room data lives here.

import random
import string

# ──────────────────────────────────────────────
# THE MAIN DATA STORE
# ──────────────────────────────────────────────
# This dictionary holds every active room.
#
# Example of what it looks like at runtime:
# rooms = {
#     "XK92TL": {
#         "players": {
#             "socket_abc": { "username": "Alice", "score": 0 },
#             "socket_xyz": { "username": "Bob",   "score": 10 }
#         },
#         "host":    "socket_abc",
#         "round":   1,
#         "started": False
#     }
# }
rooms = {}


# ──────────────────────────────────────────────
# HELPER FUNCTIONS
# ──────────────────────────────────────────────

def generate_room_code(length=6):
    """Generate a random 6-character room code like 'XK92TL'."""
    characters = string.ascii_uppercase + string.digits
    return "".join(random.choices(characters, k=length))


def create_room(host_sid, host_username):
    """
    Create a brand new room.
    - host_sid      : the socket ID of the player creating the room
    - host_username : what name they chose
    Returns the room code so we can send it back to the player.
    """
    # Keep generating until we get a code that isn't already taken
    room_code = generate_room_code()
    while room_code in rooms:
        room_code = generate_room_code()

    # Build the room structure
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
    """
    Add a player to an existing room.
    Returns (True, "success message") or (False, "error message").
    """
    if room_code not in rooms:
        return False, "Room not found. Check your code and try again."

    if rooms[room_code]["started"]:
        return False, "Sorry — this game has already started."

    if player_sid in rooms[room_code]["players"]:
        return False, "You are already in this room."

    # Add the new player with a starting score of 0
    rooms[room_code]["players"][player_sid] = {
        "username": username,
        "score": 0
    }

    print(f"➕ {username} joined room {room_code}")
    return True, "Joined successfully!"


def leave_room(room_code, player_sid):
    """
    Remove a player from a room.
    If the room becomes empty after they leave, delete the room entirely.
    """
    if room_code not in rooms:
        return  # Room doesn't exist, nothing to do

    players = rooms[room_code]["players"]

    if player_sid in players:
        username = players[player_sid]["username"]
        del players[player_sid]
        print(f"➖ {username} left room {room_code}")

    # Clean up empty rooms to save memory
    if len(players) == 0:
        del rooms[room_code]
        print(f"🗑️  Room {room_code} deleted — it's empty now")


def update_score(room_code, player_sid, points):
    """Add points to a player's score."""
    if room_code in rooms:
        if player_sid in rooms[room_code]["players"]:
            rooms[room_code]["players"][player_sid]["score"] += points
            username = rooms[room_code]["players"][player_sid]["username"]
            print(f"⭐ {username} scored {points} points in room {room_code}")


def get_leaderboard(room_code):
    """
    Return all players sorted by score, highest first.
    Example return value:
    [
        { "username": "Alice", "score": 30 },
        { "username": "Bob",   "score": 10 }
    ]
    """
    if room_code not in rooms:
        return []

    players = rooms[room_code]["players"]

    leaderboard = [
        {"username": p["username"], "score": p["score"]}
        for p in players.values()
    ]

    # Sort by score, highest first
    leaderboard.sort(key=lambda x: x["score"], reverse=True)
    return leaderboard


def get_room(room_code):
    """Return the full room data dict, or None if it doesn't exist."""
    return rooms.get(room_code, None)


def get_player_room(player_sid):
    """
    Find which room a player is currently in.
    Useful when a player disconnects and we need to clean them up.
    Returns the room_code string, or None if not found.
    """
    for room_code, room_data in rooms.items():
        if player_sid in room_data["players"]:
            return room_code
    return None