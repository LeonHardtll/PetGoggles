import replicate
import os

class AIGenerator:
    def __init__(self):
        # In a real app, ensure REPLICATE_API_TOKEN is set
        pass

    def generate_pet_perspective(self, image_input, mode: str) -> str:
        """
        Generates an image based on the pet mode.
        Returns the URL of the generated image.
        image_input: Can be a file path (str) or a file-like object (bytes).
        """
        
        base_prompt = "A POV shot from a pet's perspective. "
        
        if mode == "dog":
            # Dog Vision: Dichromatic (Yellow/Blue), Blur, Wide Angle
            prompt = (
                base_prompt + 
                "Dog vision simulation: limited color palette (yellow, blue, gray tones), no red or green. "
                "Slightly blurry peripheral vision, strong wide-angle lens distortion (fisheye), low angle view from the ground. "
                "High contrast, dreamy atmosphere. The human looks friendly but color-shifted."
            )
        elif mode == "cat":
            # Cat Vision: Desaturated, Night Vision-ish, Sharp Movement
            prompt = (
                base_prompt + 
                "Cat vision simulation: enhanced night vision style, desaturated cool colors (blues and greens), glowing edges. "
                "Vignette effect around the corners, very sharp focus in the center. "
                "Slightly grainy high-ISO look, mysterious atmosphere. "
                "The world looks brighter than reality."
            )
        else:
            prompt = base_prompt + "Cinematic lighting, realistic texture."

        # Model: black-forest-labs/flux-schnell
        model_id = "black-forest-labs/flux-schnell"
        
        try:
            # Replicate python client handles file-like objects in 'input'
            output = replicate.run(
                model_id,
                input={
                    "prompt": prompt,
                    "image": image_input, # Supports file path or file-like object
                    "num_inference_steps": 4, 
                    "guidance_scale": 3.5,
                    "strength": 0.8
                }
            )
            
            if isinstance(output, list) and len(output) > 0:
                return str(output[0])
            return str(output)
            
        except Exception as e:
            # Fallback for dev/test without API Key
            print(f"AI Generation failed (likely no API key): {e}")
            return "https://via.placeholder.com/512?text=AI+Generated+Result"
