"""
bedrock.py
──────────
All AWS Bedrock logic lives here.
  - create_bedrock_client()   → returns a boto3 Bedrock Runtime client
  - explain_code()            → calls Amazon Nova Pro to explain code
  - text_to_speech()          → calls Amazon Nova Sonic to generate audio
"""

import json
import base64
import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()


# ─────────────────────────────────────────────
# 1.  Create the Bedrock client
# ─────────────────────────────────────────────

def create_bedrock_client():
    """
    Returns a boto3 client that talks to AWS Bedrock Runtime.

    boto3 reads credentials from environment variables automatically:
      AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
    """
    client = boto3.client(
        service_name="bedrock-runtime",           # Always this value for inference calls
        region_name=os.getenv("AWS_REGION", "us-east-1"),

        # boto3 will pick these up from the environment automatically,
        # but passing them explicitly makes the code easier to follow.
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )
    return client


# ─────────────────────────────────────────────
# 2.  Call Amazon Nova Pro – explain the code
# ─────────────────────────────────────────────

def explain_code(code: str) -> str:
    """
    Sends `code` to Amazon Nova Pro and returns a plain-English,
    statement-by-statement explanation suitable for a learner.

    Parameters
    ----------
    code : str
        The raw source code the user pasted.

    Returns
    -------
    str
        The explanation text from Nova Pro.
    """
    client = create_bedrock_client()

    # The model ID for Amazon Nova Pro on Bedrock
    model_id = "amazon.nova-lite-v1:0"

    # Build the prompt.  Nova Pro uses the "messages" API (same shape as Claude).
    prompt = f"""You are a friendly coding tutor.
Explain the following code clearly, statement by statement.
Use simple language suitable for a beginner.
Format your explanation as numbered steps.

CODE:
```
{code}
```

Give ONLY the explanation. Do not repeat the code."""

    # The request body Bedrock expects for Nova Pro
    request_body = {
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}]
            }
        ],
        "inferenceConfig": {
            "maxTokens": 2048,       # Maximum words in the reply
            "temperature": 0.3,      # Lower = more focused / deterministic
        }
    }

    try:
        response = client.invoke_model(
            modelId=model_id,
            body=json.dumps(request_body),          # Must be a JSON string
            contentType="application/json",
            accept="application/json",
        )

        # Parse the response body
        response_body = json.loads(response["body"].read())

        # Nova Pro returns text inside output → message → content[0] → text
        explanation = response_body["output"]["message"]["content"][0]["text"]
        return explanation.strip()

    except ClientError as e:
        # Surface AWS errors clearly
        error_code = e.response["Error"]["Code"]
        error_msg  = e.response["Error"]["Message"]
        raise RuntimeError(f"Bedrock Nova Pro error [{error_code}]: {error_msg}")


# ─────────────────────────────────────────────
# 3.  Call Amazon Nova Sonic – text → audio
# ─────────────────────────────────────────────

def text_to_speech(text: str) -> str:
    client = create_bedrock_client()

    model_id = "amazon.nova-sonic-v1:0"

    body = {
        "input": text,
        "voice": "Matthew"
    }

    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(body),
        contentType="application/json",
        accept="audio/mpeg"
    )

    audio_bytes = response["body"].read()
    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

    return audio_base64

    # The model ID for Amazon Nova Sonic on Bedrock
    model_id="amazon.nova-sonic-v1:0"

    # Nova Sonic uses a different request shape than Nova Pro.
    # It follows the Bedrock "speech synthesis" API.
    request_body = {
        "text": text,
        "voiceConfig": {
            "presetVoice": "Matthew"   # Available voices: Matthew, Tiffany, Amy, etc.
        }
    }

    try:
        response = client.invoke_model(
            modelId=model_id,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="audio/lpcm",    # Request raw audio bytes
        )

        # The response body IS the audio bytes (not JSON)
        audio_bytes = response["body"].read()

        # Encode to Base64 so it can be sent safely over HTTP as a string
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
        return audio_base64

    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        error_msg  = e.response["Error"]["Message"]
        raise RuntimeError(f"Bedrock Nova Sonic error [{error_code}]: {error_msg}")