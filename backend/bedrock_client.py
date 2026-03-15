# Standalone Bedrock connection tester. Run directly: python bedrock_client.py

import boto3
import json
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR.parent / ".env")
load_dotenv(BASE_DIR / ".env")


def get_bedrock_client():
    """Return a Bedrock Runtime client using env credentials."""
    return boto3.client(
        service_name="bedrock-runtime",
        region_name=os.getenv("BEDROCK_REGION", os.getenv("AWS_REGION", "us-east-1")),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )


def test_bedrock_connection():
    """Send a test prompt to Nova Lite and print the reply."""
    MODEL_ID = "us.amazon.nova-lite-v1:0"
    try:
        client = get_bedrock_client()
        response = client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps({
                "messages": [{"role": "user", "content": [{"text": "Say hello in one sentence."}]}],
                "inferenceConfig": {"maxTokens": 100, "temperature": 0.5},
            }),
            contentType="application/json",
            accept="application/json",
        )
        reply = json.loads(response["body"].read())["output"]["message"]["content"][0]["text"]
        print(f"Nova Lite replied: {reply}")
        return True
    except Exception as e:
        print(f"Connection failed: {e}")
        return False


if __name__ == "__main__":
    test_bedrock_connection()
