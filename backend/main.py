"""
Simplified FastAPI Application - Working Version
AI Text Detector, Humanizer & Plagiarism Checker API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import os
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app FIRST
app = FastAPI(
    title="AI Text Detector & Humanizer API", 
    version="2.0.0",
    description="Advanced AI text detection, humanization, and plagiarism checking API"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Try to import custom modules, but don't fail if they don't exist
try:
    from ai_detector import AITextDetector
    from humanizer import TextHumanizer
    from plagiarism_detector import PlagiarismDetector
    
    # Get API key
    api_key = os.getenv("ANTHROPIC_API_KEY", "dummy_key")
    
    # Initialize modules
    ai_detector = AITextDetector()
    text_humanizer = TextHumanizer(api_key, ai_detector)
    plagiarism_detector = PlagiarismDetector(api_key, ai_detector)
    
    modules_loaded = True
    logger.info("✅ All modules loaded successfully")
    
except ImportError as e:
    logger.warning(f"⚠️ Custom modules not found: {e}")
    logger.warning("🔄 Running in basic mode without custom modules")
    modules_loaded = False

# Pydantic models
class TextAnalysisRequest(BaseModel):
    text: str

class HumanizeRequest(BaseModel):
    text: str

class PlagiarismCheckRequest(BaseModel):
    text1: str
    text2: str

class PlagiarismRemoveRequest(BaseModel):
    text: str
    rewrite_mode: Optional[str] = "balanced"
    reference_text: Optional[str] = ""

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AI Text Detector & Humanizer API",
        "version": "2.0.0",
        "status": "running",
        "modules_loaded": modules_loaded,
        "endpoints": [
            "GET /",
            "POST /analyze",
            "POST /humanize", 
            "POST /plagiarism/check",
            "POST /plagiarism/remove"
        ]
    }

# Health check endpoint
@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "modules_loaded": modules_loaded
    }

# Basic text analysis (works without custom modules)
@app.post("/analyze")
async def analyze_text(request: TextAnalysisRequest):
    """Analyze text for AI characteristics"""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if modules_loaded:
        try:
            report, score, classification = ai_detector.get_detection_report(request.text)
            detected_patterns = ai_detector.detect_ai_patterns(request.text)
            
            return {
                "ai_score": score,
                "classification": classification,
                "report": report,
                "detected_patterns": detected_patterns
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Basic analysis without custom modules
        word_count = len(request.text.split())
        char_count = len(request.text)
        
        # Simple heuristic scoring
        ai_indicators = 0
        if "furthermore" in request.text.lower():
            ai_indicators += 1
        if "moreover" in request.text.lower():
            ai_indicators += 1
        if "it's important to note" in request.text.lower():
            ai_indicators += 2
        
        score = min(90, 20 + (ai_indicators * 15))
        classification = "Likely AI" if score > 60 else "Likely Human"
        
        return {
            "ai_score": score,
            "classification": classification,
            "report": {
                "word_count": word_count,
                "char_count": char_count,
                "ai_indicators_found": ai_indicators,
                "note": "Basic analysis mode - install custom modules for advanced detection"
            },
            "detected_patterns": {}
        }

@app.post("/humanize")
async def humanize_text(request: HumanizeRequest):
    """Humanize AI-generated text"""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if modules_loaded:
        try:
            humanized_text, status, analysis = text_humanizer.humanize(request.text)
            return {
                "humanized_text": humanized_text,
                "status": status,
                "analysis": analysis
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Basic humanization without custom modules
        text = request.text
        text = text.replace("furthermore", "also")
        text = text.replace("moreover", "plus")
        text = text.replace("it's important to note that", "")
        text = text.replace("utilize", "use")
        
        return {
            "humanized_text": text,
            "status": "Basic humanization completed (custom modules not loaded)",
            "analysis": {
                "note": "Basic mode - install custom modules for advanced humanization"
            }
        }

@app.post("/plagiarism/check")
async def plagiarism_check(request: PlagiarismCheckRequest):
    """Check plagiarism between two texts"""
    if modules_loaded:
        try:
            score, matches = plagiarism_detector.check(request.text1, request.text2)
            return {
                "similarity_score": score,
                "matches": matches
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Basic similarity check
        from difflib import SequenceMatcher
        similarity = SequenceMatcher(None, request.text1.lower(), request.text2.lower()).ratio()
        
        return {
            "similarity_score": similarity * 100,
            "matches": [],
            "note": "Basic similarity check - install custom modules for advanced plagiarism detection"
        }

@app.post("/plagiarism/remove")
async def plagiarism_remove(request: PlagiarismRemoveRequest):
    """Remove plagiarism from text"""
    if modules_loaded:
        try:
            cleaned_text, report = plagiarism_detector.remove(
                text=request.text,
                rewrite_mode=request.rewrite_mode,
                reference_text=request.reference_text
            )
            return {
                "cleaned_text": cleaned_text,
                "report": report
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Basic text cleaning
        text = request.text
        text = text.replace("significant", "important")
        text = text.replace("demonstrate", "show") 
        text = text.replace("utilize", "use")
        
        return {
            "cleaned_text": text,
            "report": {
                "status": "Basic cleaning completed (custom modules not loaded)",
                "note": "Install custom modules for advanced plagiarism removal"
            }
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
