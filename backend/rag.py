from pypdf import PdfReader
import chromadb
from sentence_transformers import SentenceTransformer

# Create ChromaDB client
client = chromadb.PersistentClient(path="../chroma_db")

# Create collection
collection = client.get_or_create_collection("documents")

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


# PROCESS PDF
def process_pdf(pdf_path):

    reader = PdfReader(pdf_path)

    text = ""

    # Extract text from all pages
    for page in reader.pages:

        extracted = page.extract_text()

        if extracted:
            text += extracted

    # Better chunking
    chunk_size = 500

    chunks = [
        text[i:i + chunk_size]
        for i in range(0, len(text), chunk_size)
    ]

    # Store embeddings
    for i, chunk in enumerate(chunks):

        if chunk.strip() == "":
            continue

        embedding = model.encode(chunk).tolist()

        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            ids=[str(i)]
        )

    return "PDF processed successfully"


# SEARCH DOCUMENTS
def search_documents(query):

    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5
    )

    documents = results["documents"][0]

    combined_text = "\n".join(documents)

    return combined_text