import requests
import json

BASE_URL = "http://localhost:8000"

def test_chat():
    # First register or get a token
    # For speed, let's assume we can register a fresh user
    import time
    timestamp = int(time.time())
    username = f"testuser_{timestamp}"
    
    reg_url = f"{BASE_URL}/auth/register"
    reg_payload = {
        "username": username,
        "email": f"{username}@example.com",
        "password": "password123",
        "full_name": "Test User"
    }
    
    reg_resp = requests.post(reg_url, json=reg_payload)
    if reg_resp.status_code != 200:
        print(f"Registration failed: {reg_resp.text}")
        return
    
    token = reg_resp.json()["access_token"]
    
    # Now chat
    chat_url = f"{BASE_URL}/chat/"
    chat_payload = {
        "query": "I have a headache. What should I do?",
        "module": "medical"
    }
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Sending chat query...")
    chat_resp = requests.post(chat_url, json=chat_payload, headers=headers)
    print(f"Status: {chat_resp.status_code}")
    print(f"Response: {json.dumps(chat_resp.json(), indent=2)}")

if __name__ == "__main__":
    test_chat()
