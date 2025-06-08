from embeddings.openai_embedder import embed_text
from vectorstores.chroma_store import query_vector_store
from pymongo import MongoClient
import os
from bson import ObjectId

def build_where_clause(filters):
    def process_filter(values):
        # Accepts either a list or a string
        if isinstance(values, list):
            values = [v.lower() for v in values]
            if len(values) == 1:
                return { "$contains": values[0] }
            elif len(values) > 1:
                return { "$or": [{ "$contains": v } for v in values] }
        elif isinstance(values, str):
            return { "$contains": values.lower() }
        return None

    where_clauses = []
    for key in ["categories", "languages", "location"]:
        if key in filters:
            clause = process_filter(filters[key])
            if clause:
                where_clauses.append(clause)

    if not where_clauses:
        return None
    if len(where_clauses) == 1:
        return where_clauses[0]
    return { "$and": where_clauses }




def handle_discovery(user_query: str, filters: dict):
    where = build_where_clause(filters)
    embedding = embed_text(user_query)
    results = query_vector_store(embedding, top_k=7, where=where)

    # Extract influencer IDs from vector store metadata
    ids = [res['metadata']['influencerId'] for res in results]

    # Query MongoDB for full influencer documents
    client = MongoClient(os.getenv("MONGODB_URI"))
    coll = client["influencer_app"]["influencers"]
    profiles = list(coll.find({"_id": {"$in": ids}}))

    return profiles
