import os
import chromadb
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH") or os.path.join(BASE_DIR, "..", "chroma_db")
print("CHROMA_DB_PATH: ", CHROMA_DB_PATH)
client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
print("Client: ", client)
collection = client.get_or_create_collection("influencers")

def add_to_vector_store(embedding, document, metadata):
    print("CHROMA_DB_PATH While adding to vector store: ", CHROMA_DB_PATH)
    collection.add(
        embeddings=[embedding],
        documents=[document],
        metadatas=[metadata],
        ids=[metadata["influencerId"]]
    )

def query_vector_store(query_embedding, top_k=10, where=None):
    print("CHROMA_DB_PATH While querying vector store: ", CHROMA_DB_PATH)
    print("Collection: ", collection.get())
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
    print("Collection after adding to vector store: ", collection.get())
    return collection.count()