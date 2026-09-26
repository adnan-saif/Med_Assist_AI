import re

# Simple keyword-based module detection
MODULE_KEYWORDS = {
    "medical": ["symptom", "disease", "condition", "diagnosis", "illness", "treatment"],
    "drug": ["drug", "medicine", "side effect", "dosage", "interaction", "medication"],
    "herbal": ["herb", "herbal", "natural remedy", "alternative medicine", "plant"],
    "diet": ["diet", "nutrition", "food", "calorie", "protein", "vitamin"],
    "fitness": ["exercise", "workout", "fitness", "physical activity", "muscle", "gym"]
}

def intent_agent(query: str, provided_module: str = None) -> str:
    """Detect the module based on query keywords or use provided module."""
    if provided_module and provided_module in MODULE_KEYWORDS:
        return provided_module

    query_lower = query.lower()
    scores = {module: 0 for module in MODULE_KEYWORDS}
    for module, keywords in MODULE_KEYWORDS.items():
        for kw in keywords:
            if kw in query_lower:
                scores[module] += 1
    # Return module with highest score, default to medical
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "medical"
