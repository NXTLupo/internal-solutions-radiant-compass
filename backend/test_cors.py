#!/usr/bin/env python3
"""
Simple test FastAPI app to debug CORS issues
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI(title="CORS Test API")

# Configure CORS - Ultra permissive
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "healthy", "cors": "working"}

@app.post("/test")
async def test():
    return {"message": "POST request successful"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)