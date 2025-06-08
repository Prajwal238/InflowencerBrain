import os
import chromadb

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_DB_PATH = os.path.join(BASE_DIR, "..", "chroma_db")
client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
collection = client.get_or_create_collection("influencers")

def add_to_vector_store(embedding, document, metadata):
    collection.add(
        embeddings=[embedding],
        documents=[document],
        metadatas=[metadata],
        ids=[metadata["influencerId"]]
    )

def query_vector_store(query_embedding, top_k=10, where=None):
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where_document=where
    )
    return [
        {
            "document": doc,
            "metadata": meta,
            "distance": dist
        }
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        )
    ]

def count_vector_store():
    return collection.count()