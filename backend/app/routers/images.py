import shutil
import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ai_generator import AIGenerator

router = APIRouter(
    prefix="/api/images",
    tags=["images"]
)

UPLOAD_DIR = "uploads"

# Ensure upload directory exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Instantiate generator (stateless, so single instance is fine)
ai_generator = AIGenerator()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # 1. Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP are allowed.")
    
    # 2. Generate unique ID
    file_id = str(uuid.uuid4())
    extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{file_id}.{extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # 3. Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
        
    return {"id": file_id, "filename": filename}

@router.post("/generate/{image_id}")
async def generate_image(image_id: str, mode: str):
    # 1. Find the file
    # We need to find the extension. Since we didn't store metadata in DB (MVP shortcut),
    # we have to check for possible extensions or store extension in ID?
    # Better MVP hack: The client knows the filename from upload response, 
    # but the API spec says `image_id`. 
    # Let's search the directory for `image_id.*`
    
    found_file = None
    for file in os.listdir(UPLOAD_DIR):
        if file.startswith(image_id):
            found_file = os.path.join(UPLOAD_DIR, file)
            break
            
    if not found_file:
        raise HTTPException(status_code=404, detail="Image not found")
        
    # 2. Call AI Service
    try:
        result_url = ai_generator.generate_pet_perspective(found_file, mode)
        return {"url": result_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
