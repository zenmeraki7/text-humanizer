"""
Main FastAPI Application
AI Text Detector, Humanizer & Plagiarism Checker API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import os
from typing import Optional
from dotenv import load_dotenv

# Import our custom modules
from ai_detector import AITextDetector
from humanizer import TextHumanizer
from plagiarism_detector import PlagiarismDetector

# Configure logging for better debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("ANTHROPIC_API_KEY", "dummy_key")
if api_key == "dummy_key":
    logger.warning("⚠️ ANTHROPIC_API_KEY not found - humanization and plagiarism removal disabled")
else:
    logger.info(f"✅ API Key loaded successfully (length: {len(api_key)})")

# Initialize FastAPI app
app = FastAPI(
    title="AI Text Detector & Humanizer API", 
    version="2.0.0",
    description="Advanced AI text detection, humanization, and plagiarism checking API with modular architecture"
)

# Enhanced CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize modules
logger.info("🚀 Initializing AI Text Detection System with Modular Architecture...")

try:
    # Initialize AI Detector
    ai_detector = AITextDetector()
    logger.info("✅ AI Detector module loaded")
    
    # Initialize Text Humanizer (with reference to AI Detector)
    text_humanizer = TextHumanizer(api_key, ai_detector)
    logger.info("✅ Text Humanizer module loaded")
    
    # Initialize Plagiarism Detector (with reference to AI Detector)
    plagiarism_detector = PlagiarismDetector(api_key, ai_detector)
    logger.info("✅ Plagiarism Detector module loaded")
    
    logger.info("🎉 All modules initialized successfully!")
    
except Exception as e:
    logger.error(f"❌ Error initializing modules: {e}")
    raise

# Pydantic models for API requests
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

# API Routes
@app.get("/")
async def root():
    """Root endpoint with API information"""
    logger.info("✅ Root endpoint accessed")
    
    total_patterns = sum(len(patterns) for patterns in ai_detector.ai_patterns.values()) if ai_detector.ai_patterns else 0
    
    return {
        "message": "AI Text Detector & Humanizer API with Modular Architecture",
        "version": "2.0.0",
        "status": "running",
        "architecture": "modular",
        "modules": [
            "AI Text Detector",
            "Text Humanizer", 
            "Plagiarism Detector"
        ],
        "features": [
            "Advanced AI Text Detection (5000+ patterns)",
            "Excel Pattern Integration with Suggestions",
            "Severity-based Pattern Weighting",
            "Intelligent Text Humanization",
            "Multi-algorithm Plagiarism Detection",
            "Advanced Plagiarism Removal",
            "Comprehensive Pattern Analysis",
            "Modular Architecture"
        ],
        "pattern_stats": {
            "total_patterns": total_patterns,
            "categories": len(ai_detector.ai_patterns) if ai_detector.ai_patterns else 0,
            "dramatic_fragments": "1000+",
            "inspirational_endings": "250+",
            "revelation_phrases": "500+",
            "truth_telling_phrases": "300+",
            "excel_patterns_loaded": bool(ai_detector.excel_patterns),
            "excel_suggestions_available": hasattr(ai_detector, 'pattern_details') and bool(ai_detector.pattern_details)
        },
        "api_status": {
            "ai_detection": "✅ Active",
            "humanization": "✅ Active" if text_humanizer.anthropic_available else "❌ Disabled (No API Key)",
            "plagiarism_detection": "✅ Active",
            "plagiarism_removal": "✅ Active" if plagiarism_detector.anthropic_available else "❌ Disabled (No API Key)"
        }
    }

@app.post("/analyze")
async def analyze_text(request: TextAnalysisRequest):
    """Analyze text for AI characteristics"""
    logger.info(f"🔍 AI analysis request received: {len(request.text)} characters")

    if not request.text.strip():
        logger.warning("❌ Empty text submitted for AI analysis")
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        report, score, classification = ai_detector.get_detection_report(request.text)
        detected_patterns = ai_detector.detect_ai_patterns(request.text)

        logger.info(f"✅ AI analysis successful: {score:.1f}% AI probability")
        return {
            "ai_score": score,
            "classification": classification,
            "report": report,
            "detected_patterns": detected_patterns
        }
    except Exception as e:
        logger.error(f"❌ AI analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/humanize")
async def humanize_text(request: HumanizeRequest):
    """Humanize AI-generated text"""
    logger.info(f"✨ Humanization request received: {len(request.text)} characters")

    if not request.text.strip():
        logger.warning("❌ Empty text submitted for humanization")
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        humanized_text, status, analysis = text_humanizer.humanize(request.text)
        logger.info("✅ Humanization successful")
                return {
            "humanized_text": humanized_text,
            "status": status,
            "analysis": analysis
        }
    except Exception as e:
        logger.error(f"❌ Humanization error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/plagiarism/check")
async def plagiarism_check(request: PlagiarismCheckRequest):
    """Check plagiarism between two texts"""
    logger.info("📚 Plagiarism check request received")

    try:
        score, matches = plagiarism_detector.check(request.text1, request.text2)
        logger.info(f"✅ Plagiarism check complete: {score:.1f}% similarity")
        return {
            "similarity_score": score,
            "matches": matches
        }
    except Exception as e:
        logger.error(f"❌ Plagiarism check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/plagiarism/remove")
async def plagiarism_remove(request: PlagiarismRemoveRequest):
    """Remove plagiarism from text"""
    logger.info("🧹 Plagiarism removal request received")

    try:
        cleaned_text, report = plagiarism_detector.remove(
            text=request.text,
            rewrite_mode=request.rewrite_mode,
            reference_text=request.reference_text
        )
        logger.info("✅ Plagiarism removal successful")
        return {
            "cleaned_text": cleaned_text,
            "report": report
        }
    except Exception as e:
        logger.error(f"❌ Plagiarism removal error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
