# Personal AI Cloud

A self-hosted AI cloud platform powered by Llama 3.2, FastAPI, React, and ChromaDB.

## Features

- Local LLM using Ollama + Llama 3.2
- PDF upload support
- Retrieval-Augmented Generation (RAG)
- Semantic search using ChromaDB
- FastAPI backend
- React + Vite frontend
- Grounded AI responses
- Chat history interface

## Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- FastAPI
- Python
- Uvicorn

### AI Stack
- Llama 3.2
- Ollama
- Sentence Transformers
- ChromaDB

## Architecture

User → React Frontend → FastAPI → ChromaDB → Llama 3.2

## Future Roadmap

- Authentication (JWT)
- Multi-user support
- AWS deployment
- HTTPS + Nginx
- Voice assistant
- AI memory system

## Run Backend

```bash
uvicorn main:app --reload
```

## Run Frontend

```bash
npm run dev
```

## Author

Aditya Wagh"# personal-ai-cloud" 


