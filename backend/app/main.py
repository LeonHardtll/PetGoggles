from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import images

app = FastAPI(title="PetGoggles API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for MVP stability
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(images.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
