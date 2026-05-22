from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import requests
import shutil

from rag import process_pdf, search_documents

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model
class ChatRequest(BaseModel):
    prompt: str


# Home route
@app.get("/")
def home():

    return {
        "message": "Personal AI Cloud Running"
    }


# CHAT ROUTE (RAG)
@app.post("/chat")
def chat(req: ChatRequest):

    # Retrieve context from PDFs
    context = search_documents(req.prompt)

    # Strong grounded prompt
    final_prompt = f"""
You are an AI assistant.

Answer ONLY using the provided context below.

If the answer is not found in the context,
say:
"I could not find that information in the uploaded document."

CONTEXT:
{context}

QUESTION:
{req.prompt}

ANSWER:
"""

    # Send to Ollama
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2",
            "prompt": final_prompt,
            "stream": False
        }
    )

    return response.json()


# PDF Upload Route
@app.post("/upload")
def upload_pdf(file: UploadFile = File(...)):

    # Save uploaded file
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process PDF
    result = process_pdf(file_path)

    return {
        "message": result,
        "filename": file.filename
    }