# bedrock_client.py
# This file sets up the connection to AWS Bedrock.
# Think of it as "dialing in" to Amazon's AI service.

import boto3
import json
import os
from dotenv import load_dotenv

# Load your secret keys from the .env file
load_dotenv()

def get_bedrock_client():
    """
    Creates and returns a connection to AWS Bedrock.
    Call this function whenever you need to talk to the AI model.
    """
    client = boto3.client(
        service_name="bedrock-runtime",   # The specific AWS service we want
        region_name=os.getenv("AWS_REGION", "us-east-1"),  # AWS data center location
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
    return client


def test_bedrock_connection():
    """
    Sends a simple 'hello' message to Amazon Nova Lite to verify
    that your credentials and connection are working correctly.
    """
    # The exact model ID for Amazon Nova Lite on Bedrock
    MODEL_ID = "amazon.nova-lite-v1:0"

    try:
        # Step 1: Get the connection
        client = get_bedrock_client()
        print("✅ Bedrock client created successfully.")

        # Step 2: Build a simple test message
        # Bedrock expects the request in this exact format
        request_body = {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "text": "Say hello and confirm you are Amazon Nova Lite. Reply in one sentence."
                        }
                    ]
                }
            ],
            "inferenceConfig": {
                "maxTokens": 100,       # Max length of the response
                "temperature": 0.5      # 0 = focused/predictable, 1 = creative/random
            }
        }

        # Step 3: Send the request to Bedrock
        response = client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body),           # Convert dict → JSON string
            contentType="application/json",
            accept="application/json"
        )

        # Step 4: Read the response
        # response["body"] is a stream, so we read() it, then parse the JSON
        response_body = json.loads(response["body"].read())

        # Step 5: Extract the text from Nova Lite's response structure
        reply = response_body["output"]["message"]["content"][0]["text"]

        print(f"✅ Nova Lite replied: {reply}")
        return True

    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n--- Troubleshooting Tips ---")
        print("1. Check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env")
        print("2. Make sure your IAM user has 'AmazonBedrockFullAccess' permission")
        print("3. Make sure you've ENABLED Amazon Nova Lite in:")
        print("   AWS Console → Bedrock → Model Access → Request Access")
        print("4. Confirm your AWS_REGION matches where you enabled the model")
        return False


# This block only runs if you execute THIS file directly
# e.g. by running: python bedrock_client.py
if __name__ == "__main__":
    print("=== Testing AWS Bedrock Connection ===\n")
    test_bedrock_connection()# bedrock_client.py
# This file sets up the connection to AWS Bedrock.
# Think of it as "dialing in" to Amazon's AI service.

import boto3
import json
import os
from dotenv import load_dotenv

# Load your secret keys from the .env file
load_dotenv()

def get_bedrock_client():
    """
    Creates and returns a connection to AWS Bedrock.
    Call this function whenever you need to talk to the AI model.
    """
    client = boto3.client(
        service_name="bedrock-runtime",   # The specific AWS service we want
        region_name=os.getenv("AWS_REGION", "us-east-1"),  # AWS data center location
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
    return client


def test_bedrock_connection():
    """
    Sends a simple 'hello' message to Amazon Nova Lite to verify
    that your credentials and connection are working correctly.
    """
    # The exact model ID for Amazon Nova Lite on Bedrock
    MODEL_ID = "amazon.nova-lite-v1:0"

    try:
        # Step 1: Get the connection
        client = get_bedrock_client()
        print("✅ Bedrock client created successfully.")

        # Step 2: Build a simple test message
        # Bedrock expects the request in this exact format
        request_body = {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "text": "Say hello and confirm you are Amazon Nova Lite. Reply in one sentence."
                        }
                    ]
                }
            ],
            "inferenceConfig": {
                "maxTokens": 100,       # Max length of the response
                "temperature": 0.5      # 0 = focused/predictable, 1 = creative/random
            }
        }

        # Step 3: Send the request to Bedrock
        response = client.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body),           # Convert dict → JSON string
            contentType="application/json",
            accept="application/json"
        )

        # Step 4: Read the response
        # response["body"] is a stream, so we read() it, then parse the JSON
        response_body = json.loads(response["body"].read())

        # Step 5: Extract the text from Nova Lite's response structure
        reply = response_body["output"]["message"]["content"][0]["text"]

        print(f"✅ Nova Lite replied: {reply}")
        return True

    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n--- Troubleshooting Tips ---")
        print("1. Check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env")
        print("2. Make sure your IAM user has 'AmazonBedrockFullAccess' permission")
        print("3. Make sure you've ENABLED Amazon Nova Lite in:")
        print("   AWS Console → Bedrock → Model Access → Request Access")
        print("4. Confirm your AWS_REGION matches where you enabled the model")
        return False


# This block only runs if you execute THIS file directly
# e.g. by running: python bedrock_client.py
if __name__ == "__main__":
    print("=== Testing AWS Bedrock Connection ===\n")
    test_bedrock_connection()