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

        # Model: stability-ai/sdxl (Official Img2Img support)
        # Version hash for consistency
        model_version = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
        
        try:
            # Replicate python client handles file-like objects in 'image'
            output = replicate.run(
                model_version,
                input={
                    "prompt": prompt,
                    "image": image_input, # SDXL accepts 'image' for img2img
                    "prompt_strength": 0.6, # 0.0 to 1.0. Higher = more respect to prompt, less to original image.
                    "num_inference_steps": 30,
                    "guidance_scale": 7.5
                }
            )
            
            if isinstance(output, list) and len(output) > 0:
                return str(output[0])
            return str(output)
            
        except Exception as e:
            # Propagate error to let the API handle it (and show 500 to user)
            print(f"AI Generation Error: {str(e)}")
            raise e
