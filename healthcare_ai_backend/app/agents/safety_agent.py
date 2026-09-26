import re

# List of dangerous keywords that should trigger a warning
DANGER_KEYWORDS = [
    "emergency", "suicide", "kill", "overdose", "poison", "severe bleeding",
    "unconscious", "difficulty breathing", "chest pain", "stroke", "heart attack"
]

def safety_agent(response: str) -> tuple[str, bool]:
    """Check response for dangerous content, add warning if needed."""
    lower_resp = response.lower()
    for kw in DANGER_KEYWORDS:
        if kw in lower_resp:
            warning = "\n\n⚠️ **IMPORTANT**: If you are experiencing a medical emergency, please call your local emergency services immediately."
            return response + warning, True
    return response, False
