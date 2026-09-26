from pinecone import Pinecone
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class PineconeService:
    def __init__(self):
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)

    def query(self, vector, namespace, top_k=5, include_metadata=True):
        try:
            results = self.index.query(
                vector=vector,
                namespace=namespace,
                top_k=top_k,
                include_metadata=include_metadata
            )
            return results
        except Exception as e:
            logger.error(f"Pinecone query error: {e}")
            return None

    def get_stats(self):
        return self.index.describe_index_stats()
