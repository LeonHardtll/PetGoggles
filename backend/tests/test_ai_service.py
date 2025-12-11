from unittest.mock import patch, MagicMock
from app.services.ai_generator import AIGenerator
import os

def test_generate_dog_mode():
    # Create a dummy file
    with open("test_dummy.jpg", "wb") as f:
        f.write(b"fake data")

    try:
        # Mock replicate.run to avoid real API calls
        with patch("app.services.ai_generator.replicate.run") as mock_run:
            # Setup mock return value
            mock_run.return_value = ["https://fake-url.com/result.jpg"]
            
            generator = AIGenerator()
            result_url = generator.generate_pet_perspective("test_dummy.jpg", "dog")
            
            assert result_url == "https://fake-url.com/result.jpg"
            
            # Verify arguments passed to Replicate
            args, kwargs = mock_run.call_args
            input_params = kwargs['input']
            
            # Check if prompt contains key keywords
            assert "dog's perspective" in input_params['prompt'].lower()
            assert "adoration" in input_params['prompt'].lower()
    finally:
        if os.path.exists("test_dummy.jpg"):
            os.remove("test_dummy.jpg")

def test_generate_cat_mode():
    # Create a dummy file
    with open("test_dummy_cat.jpg", "wb") as f:
        f.write(b"fake data")

    try:
        with patch("app.services.ai_generator.replicate.run") as mock_run:
            mock_run.return_value = ["https://fake-url.com/result_cat.jpg"]
            
            generator = AIGenerator()
            result_url = generator.generate_pet_perspective("test_dummy_cat.jpg", "cat")
            
            assert result_url == "https://fake-url.com/result_cat.jpg"
            
            input_params = mock_run.call_args[1]['input']
            assert "cat's perspective" in input_params['prompt'].lower()
            assert "judgmental" in input_params['prompt'].lower()
    finally:
        if os.path.exists("test_dummy_cat.jpg"):
            os.remove("test_dummy_cat.jpg")
