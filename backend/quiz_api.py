# main.py
# The FastAPI server for Codence's quiz feature.
# Run it with: uvicorn main:app --reload

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.quiz_generator import generate_quiz, evaluate_answer

# Create the FastAPI app
app = FastAPI(
    title="Codence Quiz API",
    description="Generates and evaluates coding quizzes using Amazon Nova Lite",
    version="1.0.0"
)


# --- Request Models ---
# These define exactly what JSON shape each endpoint expects

class QuizRequest(BaseModel):
    code_snippet: str       # The code to generate questions from

class EvaluateRequest(BaseModel):
    original_code_line: str # The full original line of code
    player_answer: str      # What the player typed
    blank_word: str         # The word that was hidden (correct answer)


# --- Endpoints ---

@app.get("/")
def root():
    """Health check — confirms the server is running."""
    return {"status": "Codence Quiz API is running ⚔️"}


@app.post("/generate-quiz")
def generate_quiz_endpoint(request: QuizRequest):
    """
    Takes a code snippet and returns 5 multiple choice quiz questions.

    Example request body:
    {
        "code_snippet": "def add(a, b):\\n    return a + b"
    }
    """
    if not request.code_snippet.strip():
        raise HTTPException(status_code=400, detail="code_snippet cannot be empty")

    result = generate_quiz(request.code_snippet)

    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        "success": True,
        "quiz": result["data"]
    }


@app.post("/evaluate-answer")
def evaluate_answer_endpoint(request: EvaluateRequest):
    """
    Evaluates whether a player's fill-in-the-blank answer is correct.

    Example request body:
    {
        "original_code_line": "    return a + b",
        "player_answer": "a + b",
        "blank_word": "a + b"
    }
    """
    if not request.player_answer.strip():
        raise HTTPException(status_code=400, detail="player_answer cannot be empty")

    result = evaluate_answer(
        original_code_line=request.original_code_line,
        player_answer=request.player_answer,
        blank_word=request.blank_word
    )

    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        "success": True,
        "evaluation": result["data"]
    }