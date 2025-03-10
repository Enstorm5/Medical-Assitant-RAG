# Medical Assistant RAG API

## Description

The **Medical Assistant RAG** (Retrieval-Augmented Generation) API is a medical question-answering system that utilizes advanced language models for answering medical queries. This system combines **FAISS** for efficient similarity search and **Mistral** (via **Ollama**) for generating context-aware responses. Built with **FastAPI**, this API is designed to help medical professionals or patients query a knowledge base and receive context-driven, reliable medical answers.

## Tech Stack
- **Backend Framework**: FastAPI (For building a fast and asynchronous API)
- **Embeddings Model**: Sentence Transformers (`all-MiniLM-L6-v2`) for text embedding and vector representation
- **Search Engine**: FAISS (For similarity search and indexing embeddings)
- **Generative Model**: Mistral via Ollama API (For generating natural language responses based on retrieved context)
- **Database**: NoSQL (Using a JSON file as a data store)

## Workflow
1. **Data Preprocessing**:
   - Medical data is loaded from a JSON file (`med.json`) and converted into vector embeddings using **SentenceTransformer**.
   - These embeddings are indexed using **FAISS** for efficient similarity search.

2. **Query Handling**:
   - When the user makes a query, the system first converts the query into embeddings and retrieves relevant medical context using the **FAISS** index.
   
3. **Response Generation**:
   - The system sends the user’s query and relevant context to **Mistral** (via **Ollama**), which generates a response based on the given context.

4. **FastAPI Endpoints**:
   - `/retrieve`: Retrieves relevant context from the dataset based on a user query.
   - `/chat`: Interacts with the user, providing medical information and generating answers via Mistral.

## How It Works

1. The user sends a query via the `/retrieve` endpoint.
2. The system retrieves the most relevant context from the medical dataset using **FAISS**.
3. The query and context are sent to **Mistral** via **Ollama**, which generates a response based on the retrieved context.
4. The generated response is returned to the user.

## Dependencies

fastapi
uvicorn
faiss-cpu
numpy
sentence-transformers
pydantic
ollama

## User Interfaces
![Screenshot 2025-03-10 211514](https://github.com/user-attachments/assets/ea4d416c-ec92-4c59-ba6e-ef63c59349d5)
