from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
import docx
import os
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_file(file_path, filename):
    ext = filename.split(".")[-1]
    content = ""
    if ext == "txt":
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    elif ext == "pdf":
        reader = PdfReader(file_path)
        for page in reader.pages:
            content += page.extract_text() or ""
    elif ext == "docx":
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            content += para.text + "\n"
    return content

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    content = extract_text_from_file(tmp_path, file.filename)
    os.unlink(tmp_path)
    return {"filename": file.filename, "content": content}

@app.post("/search/")
async def search_in_text(query: str = Form(...), content: str = Form(...)):
    lines = content.split("\n")
    matched_lines = [line for line in lines if query.lower() in line.lower()]
    return JSONResponse(content={"results": matched_lines})