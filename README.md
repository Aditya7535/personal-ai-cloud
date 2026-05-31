# Personal AI Cloud

A self-hosted AI cloud platform powered by Llama 3.2, FastAPI, React, and ChromaDB.

## Project Structure

```
personal-ai-cloud/
├── backend/                 # FastAPI backend
│   ├── main.py            # Main application
│   ├── auth.py            # Authentication & JWT
│   ├── database.py        # Database models & setup
│   ├── rag.py             # RAG implementation
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile         # Backend container
│   └── uploads/           # PDF upload directory
│
├── frontend/              # React + Vite frontend
│   ├── src/              # React components & logic
│   ├── public/           # Static assets
│   ├── package.json      # Node dependencies
│   ├── vite.config.js    # Vite configuration
│   ├── Dockerfile        # Frontend container
│   ├── vercel.json       # Vercel deployment config
│   └── .env.example      # Environment template
│
├── docker-compose.yml     # Docker orchestration
├── .gitignore            # Git ignore rules
└── docs/                 # Documentation & archives
    ├── VERCEL_DEPLOYMENT.md
    └── archive_old_frontend/
```

## Features

- Local LLM using Ollama + Llama 3.2
- PDF upload support
- Retrieval-Augmented Generation (RAG)
- Semantic search using ChromaDB
- FastAPI backend
- React + Vite frontend
- Grounded AI responses
- Chat history interface
- User authentication with JWT

## Tech Stack

### Frontend
- React 19
- Vite
- Axios
- React PDF

### Backend
- FastAPI
- Python 3.10+
- Uvicorn
- SQLAlchemy
- ChromaDB

### AI Stack
- Llama 3.2
- Ollama
- PyPDF2

## Quick Start

### Prerequisites
- Docker & Docker Compose (optional, for containerized setup)
- Python 3.10+
- Node.js 18+
- Ollama with Llama 3.2 model

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

### Docker Setup

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## Deployment

See [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) for detailed Vercel deployment instructions.
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


