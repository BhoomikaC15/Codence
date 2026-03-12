"""
main.py
───────
FastAPI application for Codence.

Endpoint:
  POST /explain-code
    Body  : { "code": "<source code string>" }
    Returns: { "explanation": "...", "audio_base64": "..." }
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import our Bedrock helper functions
from backend.bedrock import explain_code, text_to_speech

# ─────────────────────────────────────────────
# App setup
# ─────────────────────────────────────────────

app = FastAPI(
    title="Codence API",
    description="Gamified code learning – AI explanation + voice narration",
    version="1.0.0",
)

# Allow requests from any origin (needed during hackathon development).
# In production, replace "*" with your actual frontend URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Request / Response models
# ─────────────────────────────────────────────

class CodeRequest(BaseModel):
    """What the frontend sends us."""
    code: str           # The source code to explain


class CodeResponse(BaseModel):
    """What we send back to the frontend."""
    explanation: str    # Plain-English explanation from Nova Pro
    audio_base64: str   # Base64-encoded audio from Nova Sonic


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/")
def root():
    """Health-check endpoint – visit http://localhost:8000/ to verify the server is running."""
    return {"status": "ok", "message": "Codence API is running!"}


@app.post("/explain-code", response_model=CodeResponse)
def explain_code_endpoint(request: CodeRequest):
    """
    Main endpoint.

    Steps:
      1. Validate that code was provided.
      2. Send code → Nova Pro → get explanation text.
      3. Send explanation → Nova Sonic → get audio (Base64).
      4. Return both to the frontend.
    """

    # ── Step 1: Basic validation ──────────────────────────
    if not request.code or not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="'code' field is required and cannot be empty."
        )

    # ── Step 2: Get explanation from Nova Pro ─────────────
    try:
        print("→ Calling Nova Pro to explain code...")
        explanation = explain_code(request.code)
        print("✓ Explanation received.")
    except RuntimeError as e:
        # explain_code() raises RuntimeError with a clear message on AWS errors
        raise HTTPException(status_code=502, detail=str(e))

    # ── Step 3: Get audio from Nova Sonic ─────────────────
    try:
        print("→ Calling Nova Sonic...")
        audio_base64 = text_to_speech(explanation)
        print("✓ Audio generated")
    except Exception as e:
        print("Audio error:", e)
        audio_base64 = ""

    # ── Step 4: Return response ───────────────────────────
    return CodeResponse(
        explanation=explanation,
        audio_base64 = audio_base64
    )


# ─────────────────────────────────────────────
# Run directly with:  python main.py
# (or use:  uvicorn main:app --reload)
# ─────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)