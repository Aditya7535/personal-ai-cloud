from pypdf import PdfReader
import chromadb
from sentence_transformers import SentenceTransformer
import uuid

# CREATE CHROMADB CLIENT
client = chromadb.PersistentClient(
    path="../chroma_db"
)

# CREATE COLLECTION
collection = client.get_or_create_collection(
    "documents"
)

# LOAD EMBEDDING MODEL
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# PROCESS PDF
def process_pdf(
    pdf_path,
    username
):

    # READ PDF
    reader = PdfReader(pdf_path)

    text = ""

    # EXTRACT TEXT
    for page in reader.pages:

        extracted = page.extract_text()

        if extracted:
            text += extracted

    # CHUNKING
    chunk_size = 500

    chunks = [
        text[i:i + chunk_size]
        for i in range(
            0,
            len(text),
            chunk_size
        )
    ]

    # STORE EMBEDDINGS
    for chunk in chunks:

        if chunk.strip() == "":
            continue

        # CREATE EMBEDDING
        embedding = model.encode(
            chunk
        ).tolist()

        # SAVE TO CHROMADB
        collection.add(

            documents=[chunk],

            embeddings=[embedding],

            metadatas=[
                {
                    "source": pdf_path,
                    "username": username
                }
            ],

            ids=[
                str(uuid.uuid4())
            ]
        )

    return "PDF processed successfully"


# SEARCH DOCUMENTS
def search_documents(

    query,

    username,

    selected_document=None
):

    # QUERY EMBEDDING
    query_embedding = model.encode(
        query
    ).tolist()

    # SEARCH CHROMADB
    where_filter = {
        "username": username
    }

    # FILTER SPECIFIC DOCUMENT
    if selected_document:

        where_filter["source"] = (
            f"uploads/{username}/"
            f"{selected_document}"
        )

    results = collection.query(

        query_embeddings=[
            query_embedding
        ],

        n_results=10,

        where=where_filter
    )

    # DOCUMENTS
    documents = results["documents"][0]

    # METADATA
    metadatas = results["metadatas"][0]

    # COMBINE CONTEXT
    combined_text = "\n".join(
        documents
    )

    # EXTRACT SOURCES
    sources = []

    for meta in metadatas:

        source = meta.get(
            "source",
            "Unknown"
        )

        # REMOVE PATH
        source_name = source.split("\\")[-1]
        source_name = source_name.split("/")[-1]

        if source_name not in sources:
            sources.append(source_name)

    return {
        "context": combined_text,
        "sources": sources
    }


# DELETE DOCUMENT
def delete_document(filename):

    results = collection.get()

    ids_to_delete = []

    for i, metadata in enumerate(
        results["metadatas"]
    ):

        source = metadata.get(
            "source",
            ""
        )

        if filename in source:

            ids_to_delete.append(
                results["ids"][i]
            )

    # DELETE EMBEDDINGS
    if ids_to_delete:

        collection.delete(
            ids=ids_to_delete
        )

    return "Document deleted"