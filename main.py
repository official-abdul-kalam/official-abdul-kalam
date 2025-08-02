from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import rembg
from PIL import Image
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Background Remover API",
    description="A simple API to remove backgrounds from images using AI",
    version="1.0.0"
)

# Configure CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize rembg session
try:
    # Create rembg session with the default model (u2net)
    rembg_session = rembg.new_session('u2net')
    logger.info("rembg session initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize rembg session: {e}")
    rembg_session = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Background Remover API is running",
        "status": "healthy",
        "rembg_available": rembg_session is not None
    }

@app.post("/remove-background")
async def remove_background(image: UploadFile = File(...)):
    """
    Remove background from uploaded image
    
    Args:
        image: Uploaded image file (JPEG, PNG, WEBP)
        
    Returns:
        Processed image with transparent background
    """
    
    # Check if rembg is available
    if rembg_session is None:
        raise HTTPException(
            status_code=500, 
            detail="Background removal service is not available"
        )
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Validate file size (max 10MB)
    max_size = 10 * 1024 * 1024  # 10MB
    if image.size > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size too large. Maximum size is 10MB"
        )
    
    try:
        # Read image data
        image_data = await image.read()
        logger.info(f"Processing image: {image.filename}, size: {len(image_data)} bytes")
        
        # Open image with PIL
        input_image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary (for JPEG compatibility)
        if input_image.mode != 'RGB':
            input_image = input_image.convert('RGB')
        
        # Remove background using rembg
        output_image = rembg.remove(input_image, session=rembg_session)
        
        # Save processed image to bytes
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        logger.info("Background removal completed successfully")
        
        # Return processed image
        return StreamingResponse(
            io.BytesIO(img_byte_arr.read()),
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=bg_removed_{image.filename.split('.')[0]}.png"
            }
        )
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process image: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Detailed health check endpoint"""
    try:
        # Test rembg functionality with a small dummy image
        test_image = Image.new('RGB', (10, 10), color='red')
        rembg.remove(test_image, session=rembg_session)
        rembg_status = "operational"
    except Exception as e:
        rembg_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "rembg_status": rembg_status,
        "available_endpoints": [
            "/",
            "/remove-background",
            "/health",
            "/docs"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )