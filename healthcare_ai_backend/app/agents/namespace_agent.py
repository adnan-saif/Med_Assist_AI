# Mapping from module to Pinecone namespace(s)
MODULE_TO_NAMESPACE = {
    "medical": ["medical_chat_ns", "drug_identifier_ns"],
    "drug": ["drug_identifier_ns"],
    "herbal": ["herbal_ns"],
    "diet": ["diet_ns"],
    "fitness": ["fitness_ns"]
}

def namespace_agent(module: str) -> list:
    return MODULE_TO_NAMESPACE.get(module, ["medical_chat_ns"])
