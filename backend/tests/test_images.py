import os
import shutil
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

UPLOAD_DIR = "uploads"

# Helper to clean up uploads after tests
def setup_module(module):
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

def teardown_module(module):
    # In a real app we might not want to delete everything, 
    # but for tests it keeps things clean.
    # For now, let's leave them to debug if needed, or clean specific files in tests.
    pass

def test_upload_image_success():
    # Create a dummy image file in memory
    file_content = b"fake image content"
    files = {"file": ("test.jpg", file_content, "image/jpeg")}
    
    response = client.post("/api/images/upload", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "filename" in data
    
    # Verify file exists on disk
    file_path = os.path.join(UPLOAD_DIR, data["filename"])
    assert os.path.exists(file_path)
    
    # Clean up
    if os.path.exists(file_path):
        os.remove(file_path)

def test_upload_invalid_file_type():
    file_content = b"i am a text file"
    files = {"file": ("test.txt", file_content, "text/plain")}
    
    response = client.post("/api/images/upload", files=files)
    
    # Expect 400 Bad Request
    assert response.status_code == 400

from unittest.mock import patch

def test_generate_image_endpoint():
    # 1. First upload an image to get an ID
    file_content = b"fake image content"
    files = {"file": ("test_gen.jpg", file_content, "image/jpeg")}
    upload_response = client.post("/api/images/upload", files=files)
    image_id = upload_response.json()["id"]
    filename = upload_response.json()["filename"]

    try:
        # 2. Mock the AIGenerator inside the router
        # We need to know where AIGenerator is imported in the router.
        # Assuming we will import it as `from app.services.ai_generator import AIGenerator`
        with patch("app.services.ai_generator.AIGenerator.generate_pet_perspective") as mock_generate:
            mock_generate.return_value = "https://mocked-result.com/img.jpg"
            
            # 3. Call Generate Endpoint
            response = client.post(f"/api/images/generate/{image_id}?mode=dog")
            
            assert response.status_code == 200
            assert response.json()["url"] == "https://mocked-result.com/img.jpg"
            
            # Verify mock was called with correct path and mode
            # The path will be absolute or relative depending on implementation, 
            # but it should end with the filename
            args, _ = mock_generate.call_args
            assert args[0].endswith(filename)
            assert args[1] == "dog"
            
    finally:
        # Cleanup
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
