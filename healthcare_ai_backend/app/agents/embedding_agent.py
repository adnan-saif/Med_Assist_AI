from app.services.embedding_service import EmbeddingService

async def embedding_agent(query: str, emb_service: EmbeddingService) -> list:
    return emb_service.embed_text(query)
