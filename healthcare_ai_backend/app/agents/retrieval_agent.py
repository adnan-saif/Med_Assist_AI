from app.services.pinecone_service import PineconeService
import logging

logger = logging.getLogger(__name__)

async def retrieval_agent(vector: list, namespaces: list, top_k: int, pinecone: PineconeService):
    all_docs = []
    
    for ns in namespaces:
        results = pinecone.query(vector=vector, namespace=ns, top_k=top_k)
        if results and results.matches:
            for match in results.matches:
                all_docs.append({
                    "id": match.id,
                    "score": match.score,
                    "metadata": match.metadata
                })
    
    # Sort merged results by score descending and take top_k
    all_docs.sort(key=lambda x: x["score"], reverse=True)
    return all_docs[:top_k]
