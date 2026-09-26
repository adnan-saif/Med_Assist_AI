from app.schemas.chat_schema import ChatResponse

def response_agent(response: str, rag_score: float) -> ChatResponse:
    return ChatResponse(
        response=response,
        rag_score=rag_score
    )
