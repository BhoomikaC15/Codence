import json
import base64
import os
from pathlib import Path
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR.parent / ".env")
load_dotenv(BASE_DIR / ".env")


def create_bedrock_client():
    """Bedrock Runtime client using BEDROCK_REGION (default us-east-1)."""
    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=os.getenv("BEDROCK_REGION", "us-east-1"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )
    return client


def get_bedrock_target(env_var: str, default_value: str) -> str:
    """Return a model ID or inference profile ID/ARN from env, with a safe default."""
    return os.getenv(env_var, default_value).strip() or default_value


def explain_code(code: str) -> str:
    """Ask Nova Lite to explain code line-by-line and return numbered plain-English steps."""
    client = create_bedrock_client()

    model_id = get_bedrock_target(
        "BEDROCK_EXPLAIN_MODEL_ID",
        "us.amazon.nova-lite-v1:0",
    )

    prompt = f"""You are a friendly coding tutor.
Explain the following code clearly, statement by statement.
Use simple language suitable for a beginner.
Format your explanation as numbered steps.

CODE:
```
{code}
```

Give ONLY the explanation. Do not repeat the code."""

    request_body = {
        "messages": [{"role": "user", "content": [{"text": prompt}]}],
        "inferenceConfig": {"maxTokens": 2048, "temperature": 0.3},
    }

    try:
        response = client.invoke_model(
            modelId=model_id,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json",
        )
        response_body = json.loads(response["body"].read())
        return response_body["output"]["message"]["content"][0]["text"].strip()

    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        error_msg  = e.response["Error"]["Message"]
        if error_code == "ValidationException" and "inference profile" in error_msg.lower():
            raise RuntimeError(
                "This Nova model requires an inference profile. "
                "Set BEDROCK_EXPLAIN_MODEL_ID to your profile ID or ARN and retry."
            )
        raise RuntimeError(f"Bedrock error [{error_code}]: {error_msg}")
    except NoCredentialsError:
        raise RuntimeError(
            "AWS credentials not found. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION."
        )


def text_to_speech(text: str) -> str:
    """Convert text to MP3 via Amazon Polly and return as base64 string."""
    region = os.getenv("POLLY_REGION") or os.getenv("AWS_REGION") or "ap-south-1"
    voice_id = os.getenv("POLLY_VOICE_ID", "Joanna")

    polly = boto3.client(
        "polly",
        region_name=region,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )

    try:
        response = polly.synthesize_speech(
            Text=text, OutputFormat="mp3", VoiceId=voice_id, Engine="neural"
        )
        return base64.b64encode(response["AudioStream"].read()).decode("utf-8")

    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        error_msg  = e.response["Error"]["Message"]
        raise RuntimeError(f"Polly TTS error [{error_code}]: {error_msg}")
    except NoCredentialsError:
        raise RuntimeError(
            "AWS credentials not found. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION."
        )