from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import json
import os
from typing import List, Dict, Any, Optional

app = FastAPI(title="Medical Assistant API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedder = SentenceTransformer('all-MiniLM-L6-v2')


try:
    with open("med.json", "r") as f:
        medical_data = json.load(f)
except FileNotFoundError:
    print("Warning: med.json not found. Using empty dataset.")
    medical_data = []


try:
    index = faiss.read_index("med_ivf_faiss.index")
except:
    print("Warning: FAISS index not found.")


class QueryInput(BaseModel):
    query: str
    num_results: Optional[int] = 1

class MessageRequest(BaseModel):
    messages: List[Dict[str, str]]
    
class MessageResponse(BaseModel):
    response: str
    context: Optional[str] = None
    
@app.get("/")
def read_root():
    return {"status": "online", "message": "Medical Assistant API is running"}

@app.post("/retrieve", response_model=Dict[str, Any])
def retrieve_context(query_input: QueryInput):

    query = query_input.query
    k = query_input.num_results
    
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    query_embedding = embedder.encode([query])

    D, I = index.search(np.array(query_embedding), k=k)
    
    retrieved_texts = []
    if I[0][0] != -1:  # If results found
        retrieved_texts = [medical_data[idx]['text'] for idx in I[0]]
    
    return {
        "query": query,
        "retrieved_context": "\n\n".join(retrieved_texts) if retrieved_texts else "",
        "num_results": len(retrieved_texts)
    }

@app.post("/chat", response_model=MessageResponse)
def generate_answer(message_request: MessageRequest):

    messages = message_request.messages
    
    if not messages:
        raise HTTPException(status_code=400, detail="Messages cannot be empty")
    

    latest_query = next((msg["content"] for msg in reversed(messages) 
                        if msg["role"] == "user"), "")
    

    relevant_context = retrieve_context(QueryInput(query=latest_query, num_results=2))
    context = relevant_context["retrieved_context"]

    system_prompt = ("You are a medical assistant. Based ONLY on the following medical information, "
                    "answer the question. DO NOT add any information beyond what is provided in the context. "
                    "If the information is insufficient, say so.")
    

    model_messages = [{"role": "system", "content": system_prompt}]
    

    if context:
        model_messages.append({"role": "assistant", "content": f"Here's the relevant medical information I found:\n\n{context}"})
    
    # Add the user messages
    model_messages.extend(messages)
    
    try:
        
        response = ollama.chat(model="mistral", messages=model_messages)
        answer = response["message"]["content"].strip()
        
        return {
            "response": answer,
            "context": context
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)