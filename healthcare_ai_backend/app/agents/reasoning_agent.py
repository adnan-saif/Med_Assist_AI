from app.services.llm_service import LLMService
from app.models.profile_model import ProfileModel

async def reasoning_agent(query: str, profile: ProfileModel, retrieved_docs: list, llm: LLMService, history: list = None) -> str:
    # Build context from profile
    profile_context = f"User profile: Age {profile.age}, Gender {profile.gender}, Conditions: {', '.join(profile.medical_conditions) if profile.medical_conditions else 'None'}, Medications: {', '.join(profile.medications) if profile.medications else 'None'}"

    # Build context from retrieved docs
    docs_text = "\n\n".join([f"Document {i+1}:\n{doc['metadata'].get('text_preview', 'No preview')}" for i, doc in enumerate(retrieved_docs)])

    # Build history text
    history_text = ""
    if history:
        history_text = "\n".join([f"User: {h['query']}\nAI: {h['response']}" for h in history])
        history_text = f"\nRecent Chat History:\n{history_text}\n"

    prompt = f"""You are a healthcare AI assistant. Answer the user's query accurately and safely.
    
Use the following relevant medical and medication information as your primary source:
{docs_text}

User profile context:
{profile_context}
{history_text}

IMPORTANT INSTRUCTIONS: 
- Use the 'Recent Chat History' to maintain context of the conversation.
- This context includes both general medical knowledge and specific drug/medication data.
- If the user asks about symptoms or conditions, suggest appropriate over-the-counter medications or treatments ONLY if they are found in the 'Relevant information' above or if they are extremely standard (like rest, hydration).
- If the 'Relevant information' provided above does not fully answer the query, use your own broad medical knowledge to provide a complete and helpful answer.
- NEVER mention 'database', 'retrieved documents', 'information source', or that you 'don't have enough information'.
- DO NOT use any markdown formatting like bold (**word**) or italics in your response. Respond in plain text only.
- Just provide a professional, helpful health response.

User query: {query}"""
    response = await llm.generate(prompt)
    return response
