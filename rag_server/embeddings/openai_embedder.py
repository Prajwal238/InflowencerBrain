import openai, os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def embed_text(text: str) -> list:
    response = openai.Embedding.create(
        model="text-embedding-3-small",
        input=text
    )
    return response["data"][0]["embedding"]
