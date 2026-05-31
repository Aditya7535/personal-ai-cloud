from fastapi import FastAPI, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import os
import requests
import shutil
import json

from database import (
    SessionLocal,
    User,
    Chat
)

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token
)

from rag import (
    process_pdf,
    search_documents,
    delete_document
)

app = FastAPI()

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

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

    selected_document: str | None = None


# USER REQUEST MODEL
class UserRequest(BaseModel):

    username: str

    password: str


# HOME ROUTE
@app.get("/")
def home():

    return {
        "message": "Personal AI Cloud Running"
    }


# SIGNUP ROUTE
@app.post("/signup")
def signup(user: UserRequest):

    db = SessionLocal()

    # CHECK EXISTING USER
    existing_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_user:

        return {
            "message":
            "Username already exists"
        }

    # HASH PASSWORD
    hashed_password = hash_password(
        user.password
    )

    # CREATE USER
    new_user = User(

        username=user.username,

        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    # CREATE TOKEN
    token = create_access_token({
        "sub": user.username
    })

    db.close()

    return {
        "access_token": token,

        "token_type": "bearer"
    }


# LOGIN ROUTE
@app.post("/login")
def login(user: UserRequest):

    db = SessionLocal()

    # FIND USER
    existing_user = db.query(User).filter(
        User.username == user.username
    ).first()

    # INVALID USER
    if not existing_user:

        return {
            "message":
            "Invalid username"
        }

    # VERIFY PASSWORD
    valid_password = verify_password(

        user.password,

        existing_user.password
    )

    if not valid_password:

        return {
            "message":
            "Invalid password"
        }

    # CREATE TOKEN
    token = create_access_token({
        "sub": user.username
    })

    db.close()

    return {

        "access_token": token,

        "token_type": "bearer"
    }


# SAVE CHAT ROUTE
@app.post("/save-chat")
def save_chat(

    data: dict,

    authorization: str = Header(...)
):

    token = authorization.split(" ")[1]

    username = verify_token(token)

    db = SessionLocal()

    # DELETE OLD CHAT
    existing_chat = db.query(Chat).filter(

        Chat.id == data["id"]

    ).first()

    if existing_chat:

        existing_chat.title = data["title"]

        existing_chat.messages = json.dumps(
            data["messages"]
        )

    else:

        new_chat = Chat(

            id=data["id"],

            username=username,

            title=data["title"],

            messages=json.dumps(
                data["messages"]
            )
        )

        db.add(new_chat)

    db.commit()

    db.close()

    return {
        "message": "Chat saved"
    }


# LOAD CHATS ROUTE
@app.get("/load-chats")
def load_chats(

    authorization: str = Header(...)
):

    token = authorization.split(" ")[1]

    username = verify_token(token)

    db = SessionLocal()

    chats = db.query(Chat).filter(

        Chat.username == username

    ).all()

    formatted_chats = []

    for chat in chats:

        formatted_chats.append({

            "id": chat.id,

            "title": chat.title,

            "messages": json.loads(
                chat.messages
            )
        })

    db.close()

    return {
        "chats": formatted_chats
    }


# STREAMING CHAT ROUTE
@app.post("/chat")
def chat(

    req: ChatRequest,

    authorization: str = Header(...)
):

    # VERIFY TOKEN
    token = authorization.split(" ")[1]

    username = verify_token(token)

    # SEARCH DOCUMENTS
    search_result = search_documents(
        req.prompt,
        username,
        req.selected_document
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
def upload_pdf(

    authorization: str = Header(...),

    file: UploadFile = File(...)
):

    # VERIFY TOKEN
    token = authorization.split(" ")[1]

    username = verify_token(token)

    # CREATE USER FOLDER
    user_folder = f"uploads/{username}"

    os.makedirs(
        user_folder,
        exist_ok=True
    )

    # SAVE FILE
    file_path = \
        f"{user_folder}/{file.filename}"

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # PROCESS PDF
    result = process_pdf(file_path, username)

    return {
        "message": result,
        "filename": file.filename
    }


# GET DOCUMENTS ROUTE
@app.get("/documents")
def get_documents(

    authorization: str = Header(...)
):

    # VERIFY TOKEN
    token = authorization.split(" ")[1]

    username = verify_token(token)

    # CHECK user folder
    user_folder = \
        f"uploads/{username}"

    if not os.path.exists(user_folder):

        return {
            "documents": []
        }

    files = os.listdir(user_folder)

    pdfs = [
        file for file in files
        if file.endswith(".pdf")
    ]

    return {
        "documents": pdfs
    }


# DELETE DOCUMENT ROUTE
@app.delete("/documents/{filename}")
def remove_document(filename: str):

    # DELETE EMBEDDINGS
    delete_document(filename)

    # DELETE FILE
    file_path = f"uploads/{filename}"

    if os.path.exists(file_path):

        os.remove(file_path)

    return {
        "message": "Document deleted"
    }


# SERVE PDF FILE
@app.get("/uploads/{filename}")
def get_pdf(filename: str):

    file_path = f"uploads/{filename}"

    if os.path.exists(file_path):

        return FileResponse(
            file_path,
            media_type="application/pdf"
        )

    return {
        "error": "File not found"
    }


# SAVE CHAT ROUTE
@app.post("/save-chat")
def save_chat(

    data: dict,

    authorization: str = Header(...)
):

    token = authorization.split(" ")[1]

    username = verify_token(token)

    db = SessionLocal()

    # CREATE CHAT
    new_chat = Chat(

        username=username,

        title=data["title"],

        messages=json.dumps(
            data["messages"]
        )
    )

    db.add(new_chat)

    db.commit()

    db.close()

    return {
        "message": "Chat saved"
    }


# LOAD CHATS ROUTE
@app.get("/load-chats")
def load_chats(

    authorization: str = Header(...)
):

    token = authorization.split(" ")[1]

    username = verify_token(token)

    db = SessionLocal()

    chats = db.query(Chat).filter(
        Chat.username == username
    ).all()

    formatted_chats = []

    for chat in chats:

        formatted_chats.append({

            "id": chat.id,

            "title": chat.title,

            "messages": json.loads(
                chat.messages
            )
        })

    db.close()

    return {
        "chats": formatted_chats
    }