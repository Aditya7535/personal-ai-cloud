from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

import requests
import shutil
import json

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

# REQUEST MODEL
class ChatRequest(BaseModel):
    prompt: str


# HOME ROUTE
@app.get("/")
def home():

    return {
        "message": "Personal AI Cloud Running"
    }


# STREAMING CHAT ROUTE
@app.post("/chat")
def chat(req: ChatRequest):

    # SEARCH DOCUMENTS
    search_result = search_documents(
        req.prompt
    )

    context = search_result["context"]

    sources = search_result["sources"]

    # FINAL PROMPT
    final_prompt = f"""
You are an AI assistant.

Answer ONLY using the provided context below.

If the answer is not found in the context,
say:
"I could not find that information in the uploaded document."

CONTEXT:
{context}

SOURCES:
{sources}

QUESTION:
{req.prompt}

ANSWER:
"""

    # STREAM GENERATOR
    def generate():

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2",
                "prompt": final_prompt,
                "stream": True
            },
            stream=True
        )

        # STREAM TOKENS
        for line in response.iter_lines():

            if line:

                try:

                    decoded_line = line.decode(
                        "utf-8"
                    )

                    json_data = json.loads(
                        decoded_line
                    )

                    token = json_data.get(
                        "response",
                        ""
                    )

                    yield token

                except Exception as e:

                    print(e)

        # APPEND SOURCES
        yield "\n\nSources:\n"

        for source in sources:

            yield f"- {source}\n"

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )


# PDF UPLOAD ROUTE
@app.post("/upload")
def upload_pdf(file: UploadFile = File(...)):

    # SAVE FILE
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # PROCESS PDF
    result = process_pdf(file_path)

    return {
        "message": result,
        "filename": file.filename
    }