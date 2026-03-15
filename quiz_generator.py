# quiz_generator.py
# This file handles:
# 1. Generating 5 quiz questions from a code snippet using Amazon Nova Lite
# 2. Evaluating a player's fill-in-the-blank answer

import json
from bedrock_client import get_bedrock_client

# The Amazon Nova Lite model ID
MODEL_ID = "amazon.nova-lite-v1:0"


def generate_quiz(code_snippet: str) -> dict:
    """
    Takes a code snippet and returns 5 multiple choice questions
    of increasing difficulty as structured JSON.
    """
    client = get_bedrock_client()

    # We tell the AI exactly what format we want back
    prompt = f"""
You are a coding quiz generator for a gamified learning app called Codence.

Given the following code snippet, generate exactly 5 multiple choice questions.
Questions must go from easy (question 1) to hard (question 5).

Rules:
- Each question has exactly 4 options labeled A, B, C, D
- Only one option is correct
- Questions should test understanding of the code, not just syntax
- Keep questions clear and beginner-friendly

Code snippet:
```
{code_snippet}
```

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
}}
"""

    request_body = {
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}]
            }
        ],
        "inferenceConfig": {
            "maxTokens": 2000,
            "temperature": 0.5
        }
    }

    try:
        # Send request to Nova Lite
        response = client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json"
        )

        # Read and parse the response
        response_body = json.loads(response["body"].read())
        raw_text = response_body["output"]["message"]["content"][0]["text"]

        # Clean up the text in case Nova Lite wraps it in markdown code fences
        cleaned = raw_text.strip()
        if cleaned.startswith("```"):
            # Remove ```json ... ``` wrappers if present
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
            cleaned = cleaned.strip()

        # Parse the JSON string into a Python dictionary
        quiz_data = json.loads(cleaned)

        return {
            "success": True,
            "data": quiz_data
        }

    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"Nova Lite returned invalid JSON: {e}",
            "raw_response": raw_text if 'raw_text' in locals() else "No response"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def evaluate_answer(
    original_code_line: str,
    player_answer: str,
    blank_word: str
) -> dict:
    """
    Evaluates whether a player's fill-in-the-blank answer is correct.

    Args:
        original_code_line: The full original line of code
        player_answer:       What the player typed in the blank
        blank_word:          The word that was blanked out (the correct answer)

    Returns a JSON dict with the result and explanation.
    """
    client = get_bedrock_client()

    prompt = f"""
You are evaluating a fill-in-the-blank coding answer for a student.

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
}}
"""

    request_body = {
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}]
            }
        ],
        "inferenceConfig": {
            "maxTokens": 300,
            "temperature": 0.2   # Low temperature = more consistent/reliable judgment
        }
    }

    try:
        response = client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json"
        )

        response_body = json.loads(response["body"].read())
        raw_text = response_body["output"]["message"]["content"][0]["text"]

        # Clean up markdown fences if present
        cleaned = raw_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
            cleaned = cleaned.strip()

        result = json.loads(cleaned)
        return {"success": True, "data": result}

    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"Invalid JSON from Nova Lite: {e}"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


# Quick test — only runs if you execute this file directly
if __name__ == "__main__":

    # --- Test 1: Quiz Generation ---
    print("=== Test 1: Generating Quiz ===\n")

    sample_code = """
def calculate_average(numbers):
    total = sum(numbers)
    count = len(numbers)
    return total / count

scores = [85, 92, 78, 95, 88]
print(calculate_average(scores))
"""

    result = generate_quiz(sample_code)

    if result["success"]:
        questions = result["data"]["questions"]
        print(f"✅ Generated {len(questions)} questions:\n")
        for q in questions:
            print(f"Q{q['id']} [{q['difficulty']}]: {q['question']}")
            for key, val in q["options"].items():
                marker = "✓" if key == q["correct_answer"] else " "
                print(f"  {marker} {key}: {val}")
            print()
    else:
        print(f"❌ Failed: {result['error']}")

    # --- Test 2: Answer Evaluation ---
    print("\n=== Test 2: Evaluating Answer ===\n")

    eval_result = evaluate_answer(
        original_code_line="    total = sum(numbers)",
        player_answer="sum(numbers)",
        blank_word="sum(numbers)"
    )

    if eval_result["success"]:
        data = eval_result["data"]
        status = "✅ Correct!" if data["is_correct"] else "❌ Incorrect"
        print(f"{status}")
        print(f"Feedback: {data['feedback']}")
    else:
        print(f"❌ Evaluation failed: {eval_result['error']}")