# Generates MCQ quizzes and evaluates fill-in-the-blank answers using Amazon Nova Lite.

import json
from bedrock import create_bedrock_client, get_bedrock_target

MODEL_ID = get_bedrock_target("BEDROCK_EXPLAIN_MODEL_ID", "us.amazon.nova-lite-v1:0")


def generate_quiz(code_snippet: str) -> dict:
    """Ask Nova Lite to generate 5 MCQ questions from a code snippet."""
    client = create_bedrock_client()

    prompt = f"""You are a coding quiz generator for a gamified learning app called Codence.

Given the following code snippet, generate exactly 5 multiple choice questions.
Questions must go from easy (question 1) to hard (question 5).

Rules:
- Each question has exactly 4 options labeled A, B, C, D
- Only one option is correct
- Questions should test understanding of the code, not just syntax
- Keep questions clear and beginner-friendly

Code snippet:


Respond ONLY with a valid JSON object. No explanation, no markdown, no extra text.
Use exactly this structure:

{{
  "questions": [
    {{
      "id": 1,
      "difficulty": "easy",
      "question": "What does this code do?",
      "options": {{
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      }},
      "correct_answer": "A"
    }}
  ]
}}"""

    request_body = {
        "messages": [{"role": "user", "content": [{"text": prompt}]}],
        "inferenceConfig": {"maxTokens": 2000, "temperature": 0.5},
    }

    try:
        response = client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json",
        )
        response_body = json.loads(response["body"].read())
        raw_text = response_body["output"]["message"]["content"][0]["text"]

        cleaned = raw_text.strip()
        if cleaned.startswith("")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
            cleaned = cleaned.strip()

        return {"success": True, "data": json.loads(cleaned)}

    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"Nova Lite returned invalid JSON: {e}",
            "raw_response": raw_text if "raw_text" in locals() else "No response",
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


def evaluate_answer(original_code_line: str, player_answer: str, blank_word: str) -> dict:
    """Ask Nova Lite to evaluate whether a fill-in-the-blank answer is correct."""
    client = create_bedrock_client()

    prompt = f"""You are evaluating a fill-in-the-blank coding answer for a student.

Original code line:  {original_code_line}
The blanked-out word: {blank_word}
Student's answer:    {player_answer}

Decide if the student's answer is correct. Be slightly lenient:
- Accept minor spacing differences
- Accept if the answer is functionally equivalent
- Do NOT accept if it changes the meaning or would cause an error

Respond ONLY with valid JSON. No explanation outside the JSON.

{{
  "is_correct": true,
  "correct_answer": "{blank_word}",
  "player_answer": "{player_answer}",
  "feedback": "Short encouraging message explaining why they got it right or wrong"
}}"""

    request_body = {
        "messages": [{"role": "user", "content": [{"text": prompt}]}],
        "inferenceConfig": {"maxTokens": 300, "temperature": 0.2},
    }

    try:
        response = client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json",
        )
        response_body = json.loads(response["body"].read())
        raw_text = response_body["output"]["message"]["content"][0]["text"]

        cleaned = raw_text.strip()
        if cleaned.startswith("")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
            cleaned = cleaned.strip()

        return {"success": True, "data": json.loads(cleaned)}

    except json.JSONDecodeError as e:
        return {"success": False, "error": f"Invalid JSON from Nova Lite: {e}"}
    except Exception as e:
        return {"success": False, "error": str(e)}
