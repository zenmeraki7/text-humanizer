
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import os
# import time
# import random
# import logging
# import asyncio
# from datetime import datetime, timedelta
# from dotenv import load_dotenv
# from typing import Optional

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
# load_dotenv()

# app = FastAPI(
#     title="AI Text Detector & Humanizer API",
#     version="4.0.0",
#     description="Advanced AI text processing with intelligent error handling and Claude API integration"
# )

# # CORS setup
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://test-finam.onrender.com",  # your frontend
#         "http://localhost:3000",           # local dev
#         "http://localhost:5173",           # vite dev
#         "http://127.0.0.1:8000",
#         "http://127.0.0.1:5173", 
#         "http://127.0.0.1:3000",
#         "http://localhost:8000"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Circuit breaker for API overload management
# class APICircuitBreaker:
#     def __init__(self):
#         self.failure_count = 0
#         self.last_failure_time = None
#         self.failure_threshold = 3
#         self.recovery_timeout = 300  # 5 minutes
        
#     def is_open(self):
#         if self.failure_count >= self.failure_threshold:
#             if self.last_failure_time and (
#                 datetime.now() - self.last_failure_time
#             ).seconds < self.recovery_timeout:
#                 return True
#             else:
#                 # Reset after timeout
#                 self.failure_count = 0
#                 self.last_failure_time = None
#         return False
    
#     def record_failure(self):
#         self.failure_count += 1
#         self.last_failure_time = datetime.now()
        
#     def record_success(self):
#         self.failure_count = 0
#         self.last_failure_time = None

# circuit_breaker = APICircuitBreaker()

# def handle_api_retry_advanced(func, max_retries=6, base_wait=2):
#     """
#     Advanced retry logic specifically optimized for Claude API 529 errors
#     """
#     if circuit_breaker.is_open():
#         raise HTTPException(
#             status_code=503,
#             detail="Service temporarily unavailable due to repeated API overloads. Please try again in 5 minutes."
#         )
    
#     for attempt in range(max_retries):
#         try:
#             result = func()
#             circuit_breaker.record_success()
#             return result
            
#         except Exception as e:
#             error_str = str(e).lower()
            
#             # Handle Claude API overload (529 errors)
#             if "529" in error_str or "overloaded" in error_str:
#                 if attempt < max_retries - 1:
#                     # Exponential backoff with jitter for 529 errors
#                     wait_time = (base_wait ** (attempt + 1)) + random.uniform(1, 5)
#                     logger.warning(f"Claude API overloaded (529), waiting {wait_time:.1f}s... (attempt {attempt + 1}/{max_retries})")
#                     time.sleep(wait_time)
#                     continue
#                 else:
#                     circuit_breaker.record_failure()
#                     raise HTTPException(
#                         status_code=503,
#                         detail={
#                             "error": "API_OVERLOADED",
#                             "message": "Claude API is experiencing high traffic. This is temporary.",
#                             "retry_after": "2-5 minutes",
#                             "suggestion": "Try again during off-peak hours for better performance."
#                         }
#                     )
            
#             # Handle rate limiting
#             elif "rate limit" in error_str or "429" in error_str:
#                 if attempt < max_retries - 1:
#                     wait_time = (attempt + 1) * 10  # Linear backoff for rate limits
#                     logger.warning(f"Rate limited, waiting {wait_time}s... (attempt {attempt + 1})")
#                     time.sleep(wait_time)
#                     continue
#                 else:
#                     raise HTTPException(
#                         status_code=429,
#                         detail="Rate limit exceeded. Please slow down your requests."
#                     )
            
#             # Handle authentication errors
#             elif "401" in error_str or "unauthorized" in error_str:
#                 raise HTTPException(
#                     status_code=401,
#                     detail="API authentication failed. Check your API key configuration."
#                 )
            
#             # Handle other API errors
#             elif "api" in error_str and any(code in error_str for code in ["400", "403", "404", "500"]):
#                 raise HTTPException(
#                     status_code=502,
#                     detail=f"Claude API error: {str(e)}"
#                 )
            
#             # For non-API errors, don't retry
#             else:
#                 logger.error(f"Non-retryable error: {e}")
#                 raise e
    
#     # This shouldn't be reached, but just in case
#     raise HTTPException(status_code=500, detail="Maximum retries exceeded")

# # Try to load custom modules
# modules_loaded = False
# ai_detector = None
# text_humanizer = None
# plagiarism_detector = None
# tone_manager = None
# summarizer = None

# try:
#     # Import the improved Claude API modules
#     from ai_detector import AITextDetector
#     from humanizer import TextHumanizer
#     from plagiarism_module import PlagiarismDetector
#     from tone import ToneManager  
#     from summarizer import LlamaSummarizer
    
#     api_key = os.getenv("ANTHROPIC_API_KEY")
#     if api_key:
#         # Initialize with proper API key
#         ai_detector = AITextDetector()
#         text_humanizer = TextHumanizer(api_key, ai_detector)
#         plagiarism_detector = PlagiarismDetector(api_key, ai_detector)
        
#         # Initialize improved Claude-based modules
#         tone_manager = ToneManager(api_key)
#         summarizer = LlamaSummarizer(api_key)
        
#         modules_loaded = True
#         logger.info("✅ All modules loaded successfully with Claude API")
#         logger.info(f"✅ API Key configured: {api_key[:15]}...")
#     else:
#         logger.warning("⚠️ ANTHROPIC_API_KEY not found")
# except Exception as e:
#     logger.error(f"❌ Failed to load modules: {e}")
#     logger.error("Make sure you have: tone.py, summarizer.py, and other required modules")

# # Request models
# class TextAnalysisRequest(BaseModel):
#     text: str

# class HumanizeRequest(BaseModel):
#     text: str

# class PlagiarismRequest(BaseModel):
#     text: str

# class ToneChangeRequest(BaseModel):
#     text: str
#     tone_mode: str = "professional"

# class SummarizeRequest(BaseModel):
#     text: str
#     summary_type: str = "abstractive"
#     summary_length: str = "medium"

# # Root endpoint
# @app.get("/")
# def root():
#     return {
#         "message": "AI Text Detector & Humanizer API",
#         "status": "running",
#         "version": "4.0.0",
#         "modules_loaded": modules_loaded,
#         "api_key_available": bool(os.getenv("ANTHROPIC_API_KEY")),
#         "circuit_breaker_status": "open" if circuit_breaker.is_open() else "closed",
#         "powered_by": "Claude AI with Smart Error Handling",
#         "endpoints": {
#             "core": ["/analyze", "/humanize", "/remove-plagiarism"],
#             "advanced": ["/change-tone", "/summarize"],
#             "info": ["/tone-modes", "/summary-options", "/health", "/api-status"]
#         }
#     }

# @app.get("/api-status")
# def get_api_status():
#     """Get current API and circuit breaker status"""
#     return {
#         "circuit_breaker": {
#             "status": "open" if circuit_breaker.is_open() else "closed",
#             "failure_count": circuit_breaker.failure_count,
#             "last_failure": circuit_breaker.last_failure_time.isoformat() if circuit_breaker.last_failure_time else None
#         },
#         "modules_loaded": modules_loaded,
#         "api_key_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
#         "recommendation": "off-peak hours: early morning, late evening" if circuit_breaker.failure_count > 0 else "service operating normally"
#     }

# @app.post("/analyze")
# def analyze_text(request: TextAnalysisRequest):
#     """Analyze text for AI characteristics"""
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")

#     if modules_loaded and ai_detector:
#         def call_analysis():
#             report, score, classification = ai_detector.get_detection_report(request.text)
#             detected_patterns = ai_detector.detect_ai_patterns(request.text)
#             return {
#                 "ai_score": score,
#                 "classification": classification,
#                 "report": report,
#                 "detected_patterns": detected_patterns,
#                 "powered_by": "Claude AI Detection"
#             }
#         return handle_api_retry_advanced(call_analysis)
#     else:
#         # Enhanced fallback analysis
#         word_count = len(request.text.split())
#         text_lower = request.text.lower()
        
#         ai_indicators = sum([
#             "furthermore" in text_lower,
#             "moreover" in text_lower,
#             "it's important to note" in text_lower,
#             "significant" in text_lower,
#             "utilize" in text_lower,
#             "demonstrate" in text_lower,
#             "implement" in text_lower,
#             "facilitate" in text_lower,
#             "cutting-edge" in text_lower,
#             "paradigm shift" in text_lower
#         ])
        
#         score = min(95, 10 + (ai_indicators * 10))
#         classification = "Likely AI" if score > 55 else "Likely Human"
        
#         return {
#             "ai_score": score,
#             "classification": classification,
#             "report": f"Fallback analysis: {word_count} words, {ai_indicators} AI patterns detected",
#             "detected_patterns": {"ai_phrases": ai_indicators},
#             "note": "Limited analysis - full Claude AI detection requires API key"
#         }

# @app.post("/humanize")
# def humanize_text(request: HumanizeRequest):
#     """Humanize AI-generated text using Claude AI"""
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")

#     if modules_loaded and text_humanizer:
#         def call_humanizer():
#             humanized_text, status, analysis = text_humanizer.humanize(request.text)
#             return {
#                 "humanized_text": humanized_text,
#                 "status": status,
#                 "analysis": analysis,
#                 "powered_by": "Claude AI Humanization"
#             }
#         return handle_api_retry_advanced(call_humanizer)
#     else:
#         # Enhanced fallback humanization
#         text = request.text
#         replacements = {
#             "furthermore": "also",
#             "moreover": "plus", 
#             "utilize": "use",
#             "implement": "put in place",
#             "facilitate": "help",
#             "demonstrate": "show",
#             "it's important to note that": "",
#             "significant": "important",
#             "optimize": "improve",
#             "leverage": "use",
#             "cutting-edge": "latest",
#             "paradigm shift": "major change"
#         }
        
#         for old, new in replacements.items():
#             text = text.replace(old, new)
            
#         return {
#             "humanized_text": text,
#             "status": "Basic humanization completed",
#             "analysis": f"Applied {len(replacements)} text transformations",
#             "note": "Limited features - full Claude AI humanization requires API key"
#         }

# @app.post("/remove-plagiarism")
# def remove_plagiarism(request: PlagiarismRequest):
#     """Remove plagiarism and rewrite text"""
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")

#     if modules_loaded and plagiarism_detector:
#         def call_plagiarism_remover():
#             cleaned_text, report = plagiarism_detector.remove(request.text)
            
#             # Handle both dict and string reports
#             if isinstance(report, dict):
#                 return {
#                     "rewritten_text": cleaned_text,
#                     "original_word_count": len(request.text.split()),
#                     "new_word_count": len(cleaned_text.split()),
#                     "improvement": report.get("improvement", 0),
#                     "ai_improvement": report.get("ai_improvement", 0),
#                     "original_plagiarism_score": report.get("original_plagiarism_score", 0),
#                     "new_plagiarism_score": report.get("new_plagiarism_score", 0),
#                     "status": report.get("status", "Success"),
#                     "powered_by": "Claude AI Rewriting"
#                 }
#             else:
#                 return {
#                     "rewritten_text": cleaned_text,
#                     "original_word_count": len(request.text.split()),
#                     "new_word_count": len(cleaned_text.split()),
#                     "improvement": 25,
#                     "ai_improvement": 20,
#                     "status": str(report),
#                     "powered_by": "Claude AI Rewriting"
#                 }
#         return handle_api_retry_advanced(call_plagiarism_remover)
#     else:
#         # Enhanced fallback rewriting
#         text = request.text
#         advanced_replacements = {
#             "significant": "important",
#             "demonstrate": "show",
#             "utilize": "use",
#             "furthermore": "also",
#             "moreover": "additionally",
#             "implement": "apply",
#             "facilitate": "enable",
#             "optimize": "enhance",
#             "leverage": "harness",
#             "comprehensive": "complete",
#             "substantial": "considerable",
#             "innovative": "new",
#             "cutting-edge": "advanced",
#             "state-of-the-art": "latest",
#             "paradigm shift": "major change"
#         }
        
#         for old, new in advanced_replacements.items():
#             text = text.replace(old, new)
            
#         return {
#             "rewritten_text": text,
#             "original_word_count": len(request.text.split()),
#             "new_word_count": len(text.split()),
#             "improvement": 20,
#             "ai_improvement": 15,
#             "status": "Basic rewriting completed",
#             "note": "Limited features - full Claude AI rewriting requires API key"
#         }

# @app.post("/change-tone")
# def change_tone(request: ToneChangeRequest):
#     """Change text tone using Claude AI"""
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
#     if not modules_loaded or not tone_manager:
#         raise HTTPException(
#             status_code=503, 
#             detail="Tone manager not available. Check API key and module installation."
#         )
    
#     def call_tone_changer():
#         # Use the correct method from our improved tone manager
#         changed_text, status, analysis = tone_manager.change_tone(
#             text=request.text,
#             tone_mode=request.tone_mode
#         )
#         return {
#             "changed_text": changed_text,
#             "status": status,
#             "analysis": analysis,
#             "tone_mode": request.tone_mode,
#             "powered_by": "Claude AI Tone Transformation"
#         }
    
#     return handle_api_retry_advanced(call_tone_changer)

# @app.get("/tone-modes")
# def get_tone_modes():
#     """Get available tone modes"""
#     if not modules_loaded or not tone_manager:
#         return {
#             "available_modes": {
#                 "professional": {"name": "💼 Professional", "description": "Business communication"},
#                 "casual": {"name": "😊 Casual", "description": "Friendly conversation"},
#                 "formal": {"name": "👔 Formal", "description": "Official documents"}
#             },
#             "note": "Limited modes - full features require API key",
#             "api_required": True
#         }
    
#     return {
#         "available_modes": tone_manager.get_available_modes(),
#         "powered_by": "Claude AI",
#         "api_required": False
#     }

# @app.post("/summarize")
# def summarize_text_endpoint(request: SummarizeRequest):
#     """Summarize text using Claude AI"""
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
#     if not modules_loaded or not summarizer:
#         raise HTTPException(
#             status_code=503, 
#             detail="Summarizer not available. Check API key and module installation."
#         )
    
#     def call_summarizer():
#         # Use the correct method from our improved summarizer
#         summary, status, analysis = summarizer.summarize(
#             text=request.text,
#             summary_type=request.summary_type,
#             summary_length=request.summary_length
#         )
#         return {
#             "summary": summary,
#             "status": status,
#             "analysis": analysis,
#             "summary_type": request.summary_type,
#             "summary_length": request.summary_length,
#             "powered_by": "Claude AI Summarization"
#         }
    
#     return handle_api_retry_advanced(call_summarizer)

# @app.get("/summary-options")
# def get_summary_options():
#     """Get available summary options"""
#     if not modules_loaded or not summarizer:
#         return {
#             "available_types": ["abstractive", "bullet_points", "paragraph"],
#             "available_lengths": ["short", "medium", "long"],
#             "note": "Limited options - full features require API key",
#             "api_required": True
#         }
    
#     return {
#         "available_types": summarizer.get_available_types(),
#         "available_lengths": summarizer.get_available_lengths(),
#         "powered_by": "Claude AI",
#         "api_required": False
#     }

# @app.get("/health")
# def health_check():
#     """Health check endpoint"""
#     return {
#         "status": "healthy",
#         "version": "4.0.0",
#         "modules_loaded": modules_loaded,
#         "api_key_available": bool(os.getenv("ANTHROPIC_API_KEY")),
#         "circuit_breaker_status": "open" if circuit_breaker.is_open() else "closed",
#         "endpoints": {
#             "core": ["/analyze", "/humanize", "/remove-plagiarism"],
#             "advanced": ["/change-tone", "/summarize"],
#             "info": ["/tone-modes", "/summary-options", "/health", "/api-status"]
#         },
#         "error_handling": "Advanced 529 retry logic with circuit breaker",
#         "powered_by": "Claude AI" if modules_loaded else "Basic fallback"
#     }

# # Enhanced preflight handlers
# @app.options("/analyze")
# @app.options("/humanize") 
# @app.options("/remove-plagiarism")
# @app.options("/change-tone")
# @app.options("/summarize")
# @app.options("/tone-modes")
# @app.options("/summary-options")
# @app.options("/health")
# @app.options("/api-status")
# async def options_handler():
#     return {"message": "OK"}

# @app.options("/{path:path}")
# async def catch_all_options(path: str):
#     return {"message": "OK"}

# # Enhanced error handlers
# @app.exception_handler(HTTPException)
# async def http_exception_handler(request, exc):
#     logger.error(f"HTTP {exc.status_code}: {exc.detail} for {request.url}")
    
#     # Provide helpful error responses
#     if exc.status_code == 503:
#         return {
#             "error": True,
#             "status_code": exc.status_code,
#             "detail": exc.detail,
#             "suggestions": [
#                 "Try again in 2-5 minutes",
#                 "Use off-peak hours for better reliability",
#                 "Check /api-status for current service status"
#             ],
#             "path": str(request.url)
#         }
    
#     return {
#         "error": True,
#         "status_code": exc.status_code,
#         "detail": exc.detail,
#         "path": str(request.url)
#     }

# @app.exception_handler(Exception)
# async def general_exception_handler(request, exc):
#     logger.error(f"Unhandled exception: {exc} for {request.url}")
#     return {
#         "error": True,
#         "status_code": 500,
#         "detail": "Internal server error",
#         "message": "Please try again or check /api-status for service health",
#         "path": str(request.url)
#     }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)




from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import time
import random
import logging
from datetime import datetime
from dotenv import load_dotenv
from typing import Optional, Dict, Any, List

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()

app = FastAPI(
    title="AI Text Detector & Humanizer API",
    version="5.0.0",
    description="Advanced AI text processing with intelligent error handling, plagiarism detection, and Claude API integration"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. Circuit Breaker & Retry Logic
# ==========================================

class APICircuitBreaker:
    def __init__(self):
        self.failure_count = 0
        self.last_failure_time = None
        self.failure_threshold = 3
        self.recovery_timeout = 300  # 5 minutes
        
    def is_open(self):
        if self.failure_count >= self.failure_threshold:
            if self.last_failure_time and (
                datetime.now() - self.last_failure_time
            ).seconds < self.recovery_timeout:
                return True
            else:
                self.failure_count = 0
                self.last_failure_time = None
        return False
        
    def record_failure(self):
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
    def record_success(self):
        self.failure_count = 0
        self.last_failure_time = None

circuit_breaker = APICircuitBreaker()

def handle_api_retry_advanced(func, max_retries=3, base_wait=2):
    """
    Advanced retry logic specifically optimized for Claude API 529 errors
    """
    if circuit_breaker.is_open():
        raise HTTPException(
            status_code=503,
            detail="Service temporarily unavailable due to repeated API overloads. Please try again in 5 minutes."
        )
    
    for attempt in range(max_retries):
        try:
            result = func()
            circuit_breaker.record_success()
            return result
            
        except Exception as e:
            error_str = str(e).lower()
            
            # Handle Claude API overload (529 errors)
            if "529" in error_str or "overloaded" in error_str:
                if attempt < max_retries - 1:
                    wait_time = (base_wait ** (attempt + 1)) + random.uniform(1, 3)
                    logger.warning(f"Claude API overloaded (529), waiting {wait_time:.1f}s... (attempt {attempt + 1}/{max_retries})")
                    time.sleep(wait_time)
                    continue
                else:
                    circuit_breaker.record_failure()
                    raise HTTPException(
                        status_code=503,
                        detail="Claude API is experiencing high traffic. Please try again later."
                    )
            
            # Handle Rate Limits
            elif "429" in error_str:
                raise HTTPException(status_code=429, detail="Rate limit exceeded.")
                
            # Other errors: re-raise immediately
            else:
                logger.error(f"Non-retryable error: {e}")
                raise e

# ==========================================
# 2. Module Loading
# ==========================================

modules_loaded = False
ai_detector = None
text_humanizer = None
plagiarism_detector = None
tone_manager = None
summarizer = None

try:
    # Import modules (Assuming they are in the same directory or python path)
    from ai_detector import AITextDetector
    from humanizer import TextHumanizer
    from plagiarism_module import PlagiarismDetector # Fixed import
    from tone import ToneManager  
    from summarizer import LlamaSummarizer
    
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        # Initialize modules
        ai_detector = AITextDetector()
        text_humanizer = TextHumanizer(api_key, ai_detector)
        
        # Initialize Plagiarism Detector (Safe initialization)
        plagiarism_detector = PlagiarismDetector(
            anthropic_api_key=api_key, 
            ai_detector=ai_detector
        )
        
        tone_manager = ToneManager(api_key)
        summarizer = LlamaSummarizer(api_key)
        
        modules_loaded = True
        logger.info("✅ All modules loaded successfully")
    else:
        logger.warning("⚠️ ANTHROPIC_API_KEY not found. Running in limited mode.")
        # Attempt to load plagiarism detector in offline mode
        from plagiarism_module import PlagiarismDetector
        plagiarism_detector = PlagiarismDetector(anthropic_api_key=None)

except Exception as e:
    logger.error(f"❌ Failed to load modules: {e}")
    # Initialize basic plagiarism detector even if others fail
    try:
        from plagiarism_module import PlagiarismDetector
        plagiarism_detector = PlagiarismDetector()
    except:
        pass

# ==========================================
# 3. Request Models
# ==========================================

class TextAnalysisRequest(BaseModel):
    text: str

class HumanizeRequest(BaseModel):
    text: str

class SingleTextRequest(BaseModel):
    text: str

class TwoTextRequest(BaseModel):
    text1: str
    text2: str

class PlagiarismRemovalRequest(BaseModel):
    text: str
    rewrite_mode: str = "balanced" # conservative, balanced, aggressive
    reference_text: str = ""

class ToneChangeRequest(BaseModel):
    text: str
    tone_mode: str = "professional"

class SummarizeRequest(BaseModel):
    text: str
    summary_type: str = "abstractive"
    summary_length: str = "medium"

# ==========================================
# 4. Endpoints
# ==========================================

@app.get("/")
def root():
    return {
        "message": "AI Text Detector & Humanizer API",
        "status": "running",
        "version": "5.0.0",
        "modules_loaded": modules_loaded,
        "features": [
            "AI Detection", 
            "Humanization", 
            "Plagiarism Detection", 
            "Plagiarism Removal",
            "Tone Change",
            "Summarization"
        ]
    }

# --- Core AI Detection & Humanization ---

@app.post("/analyze")
def analyze_text(request: TextAnalysisRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    if modules_loaded and ai_detector:
        def call_analysis():
            report, score, classification = ai_detector.get_detection_report(request.text)
            detected_patterns = ai_detector.detect_ai_patterns(request.text)
            return {
                "ai_score": score,
                "classification": classification,
                "report": report,
                "detected_patterns": detected_patterns
            }
        return handle_api_retry_advanced(call_analysis)
    else:
        return {"ai_score": 0, "classification": "Unknown (Modules not loaded)", "report": "System unavailable"}

@app.post("/humanize")
def humanize_text(request: HumanizeRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    if modules_loaded and text_humanizer:
        def call_humanizer():
            humanized_text, status, analysis = text_humanizer.humanize(request.text)
            return {
                "humanized_text": humanized_text,
                "status": status,
                "analysis": analysis
            }
        return handle_api_retry_advanced(call_humanizer)
    else:
        # Basic Fallback
        return {
            "humanized_text": request.text,
            "status": "Modules not loaded", 
            "analysis": "No changes made"
        }

# --- Plagiarism Detection Endpoints ---

@app.post("/detect-plagiarism-patterns")
async def detect_plagiarism_patterns(request: SingleTextRequest):
    if not plagiarism_detector:
        raise HTTPException(status_code=503, detail="Plagiarism module not loaded")
    
    try:
        patterns = plagiarism_detector.detect_plagiarism_patterns(request.text)
        # Handle if returns dict or list, ensure we don't crash on count
        pattern_count = 0
        if isinstance(patterns, dict):
             pattern_count = sum(len(matches) for matches in patterns.values())
        
        return {
            "patterns_detected": patterns,
            "total_patterns": pattern_count,
            "has_plagiarism_indicators": pattern_count > 0
        }
    except Exception as e:
        logger.error(f"Error in detect patterns: {e}")
        return {"patterns_detected": {}, "total_patterns": 0, "error": str(e)}

@app.post("/calculate-plagiarism-risk")
async def calculate_plagiarism_risk(request: TwoTextRequest):
    if not plagiarism_detector:
        raise HTTPException(status_code=503, detail="Plagiarism module not loaded")
        
    try:
        risk_score, details = plagiarism_detector.calculate_plagiarism_risk(request.text1, request.text2)
        return {
            "risk_score": risk_score,
            "risk_level": details.get("risk_level", "Unknown"),
            "details": details
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/plagiarism-detection-report")
async def get_plagiarism_detection_report(request: TwoTextRequest):
    if not plagiarism_detector:
        raise HTTPException(status_code=503, detail="Plagiarism module not loaded")

    try:
        report, risk_score, details = plagiarism_detector.get_detection_report(request.text1, request.text2)
        return {
            "report": report,
            "risk_score": risk_score,
            "details": details
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Plagiarism Comparison Endpoints ---

@app.post("/check-plagiarism")
async def check_plagiarism(request: TwoTextRequest):
    """Compare two texts for similarity"""
    if not plagiarism_detector:
        raise HTTPException(status_code=503, detail="Plagiarism module not loaded")

    try:
        report, score, status = plagiarism_detector.get_plagiarism_report(request.text1, request.text2)
        return {
            "report": report,
            "similarity_score": score,
            "status": status,
            "classification": "High Similarity" if score > 50 else "Low Similarity"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/plagiarism-statistics")
async def get_plagiarism_statistics(request: TwoTextRequest):
    if not plagiarism_detector:
        raise HTTPException(status_code=503, detail="Plagiarism module not loaded")
    return plagiarism_detector.get_plagiarism_statistics(request.text1, request.text2)

@app.post("/find-similar-sentences")
async def find_similar_sentences(request: TwoTextRequest):
    if not plagiarism_detector:
        raise HTTPException(status_code=503, detail="Plagiarism module not loaded")
    
    similar = plagiarism_detector.find_similar_sentences(request.text1, request.text2)
    return {
        "similar_sentences": similar,
        "count": len(similar)
    }

# --- Plagiarism Removal Endpoints ---

@app.post("/remove-plagiarism")
def remove_plagiarism(request: PlagiarismRemovalRequest):
    """Remove plagiarism with rewriting modes"""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    if plagiarism_detector:
        def call_remover():
            rewritten, report = plagiarism_detector.remove(
                text=request.text,
                rewrite_mode=request.rewrite_mode,
                reference_text=request.reference_text
            )
            return {
                "rewritten_text": rewritten,
                "report": report,
                "rewrite_mode": request.rewrite_mode
            }
        return handle_api_retry_advanced(call_remover)
    else:
        # Fallback if module failed to load entirely
        return {
            "rewritten_text": request.text, 
            "status": "error", 
            "message": "Plagiarism module unavailable"
        }

@app.get("/plagiarism-modes")
def get_plagiarism_modes():
    return {
        "modes": [
            {"name": "conservative", "description": "Light changes"},
            {"name": "balanced", "description": "Moderate restructuring"},
            {"name": "aggressive", "description": "Complete rewrite"}
        ]
    }

@app.get("/plagiarism-risk-levels")
def get_risk_levels():
    return {
         "levels": [
            {"level": "MINIMAL", "range": "0-20%", "color": "green"},
            {"level": "LOW", "range": "20-40%", "color": "yellow"},
            {"level": "MEDIUM", "range": "40-60%", "color": "orange"},
            {"level": "HIGH", "range": "60-80%", "color": "red"},
            {"level": "CRITICAL", "range": "80-100%", "color": "darkred"}
        ]
    }

# --- Advanced Features (Tone & Summary) ---

@app.post("/change-tone")
def change_tone(request: ToneChangeRequest):
    if not modules_loaded or not tone_manager:
        raise HTTPException(status_code=503, detail="Tone module not loaded")
    
    def call_tone():
        changed, status, analysis = tone_manager.change_tone(request.text, request.tone_mode)
        return {"changed_text": changed, "status": status, "analysis": analysis}
    return handle_api_retry_advanced(call_tone)

@app.get("/tone-modes")
def get_tone_modes():
    if tone_manager:
        return {"available_modes": tone_manager.get_available_modes()}
    return {"available_modes": {}}

@app.post("/summarize")
def summarize_text(request: SummarizeRequest):
    if not modules_loaded or not summarizer:
        raise HTTPException(status_code=503, detail="Summarizer module not loaded")
        
    def call_sum():
        summary, status, analysis = summarizer.summarize(
            request.text, request.summary_type, request.summary_length
        )
        return {"summary": summary, "status": status, "analysis": analysis}
    return handle_api_retry_advanced(call_sum)

@app.get("/summary-options")
def get_summary_options():
    if summarizer:
        return {
            "types": summarizer.get_available_types(),
            "lengths": summarizer.get_available_lengths()
        }
    return {}

# --- System ---

@app.get("/health")
def health_check():
    return {"status": "healthy", "modules": modules_loaded}

@app.get("/api-status")
def get_api_status():
    return {
        "circuit_breaker_open": circuit_breaker.is_open(),
        "api_key_set": bool(os.getenv("ANTHROPIC_API_KEY"))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
