import os
from dotenv import load_dotenv
from pymongo import MongoClient
from embeddings.openai_embedder import embed_text
from vectorstores.chroma_store import add_to_vector_store, count_vector_store
from loaders.generate_rag_doc import generate_rag_doc

load_dotenv()

def load_influencers_to_vector_db():
    client = MongoClient(os.getenv("MONGODB_URI"))
    collection = client["influencer_app"]["influencers"]

    for doc in collection.find():
        text, metadata = generate_rag_doc(doc)
        embedding = embed_text(text)
        add_to_vector_store(embedding, text, metadata)
        print(f"Added influencer {metadata['influencerId']} to ChromaDB")

    print(f"Total records in ChromaDB: {count_vector_store()}")

if __name__ == "__main__":
    load_influencers_to_vector_db()