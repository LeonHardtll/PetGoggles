import shutil
import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.services.ai_generator import AIGenerator

router = APIRouter(
    prefix="/api/images",
    tags=["images"]
)

UPLOAD_DIR = "/tmp" # Use /tmp for serverless compatibility (Vercel)

# Ensure upload directory exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Instantiate generator (stateless, so single instance is fine)
ai_generator = AIGenerator()

CONTENT_TYPE_TO_EXT = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
}

@router.post("/process")
async def process_image(file: UploadFile = File(...), mode: str = Form(...)):
    """
    Combined endpoint for Serverless (Vercel) deployment.
    Uploads and Generates in a single request to avoid filesystem persistence issues.
    """
    # 1. Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP are allowed.")
    
    # 2. Call AI Service directly with the file object
    try:
        # Note: file.file is a SpooledTemporaryFile. Replicate client handles this.
        # We pass it directly without saving to disk first.
        result_url = ai_generator.generate_pet_perspective(file.file, mode)
        return {"url": result_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # 1. Validate file type
    if file.content_type not in CONTENT_TYPE_TO_EXT:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP are allowed.")
    
    # 2. Generate unique ID
    file_id = str(uuid.uuid4())
    # Use canonical extension based on content type to ensure consistency
    extension = CONTENT_TYPE_TO_EXT[file.content_type]
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
    # Check for possible extensions directly instead of iterating the directory
    found_file = None
    for ext in CONTENT_TYPE_TO_EXT.values():
        possible_path = os.path.join(UPLOAD_DIR, f"{image_id}.{ext}")
        if os.path.exists(possible_path):
            found_file = possible_path
            break
            
    if not found_file:
        raise HTTPException(status_code=404, detail="Image not found")
        
    # 2. Call AI Service
    try:
        result_url = ai_generator.generate_pet_perspective(found_file, mode)
        return {"url": result_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
