from fastapi import FastAPI, Request
from rag_services.discovery import handle_discovery

app = FastAPI()

@app.post("/rag/discovery")
async def discovery(request: Request):
    body = await request.json()
    user_query = body.get("userPrompt", "")
    filters = body.get("filters", {})
    print(user_query, filters)
    return handle_discovery(user_query, filters)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5001, reload=True)