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
#     version="4.5.0",
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
#     from plagiarism_detector import PlagiarismDetector
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
#         "version": "4.5.0",
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
#         "version": "4.5.0",
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

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import os
import time
import random
import logging
import asyncio
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Optional, Dict, Any, List

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
load_dotenv()

app = FastAPI(
    title="AI Text Detector & Humanizer API",
    version="4.5.0",
    description="Advanced AI text processing with intelligent error handling and Claude Sonnet 4.5 API integration",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enhanced CORS setup for v4.5
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://test-finam.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:5173", 
        "http://127.0.0.1:3000",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Enhanced Circuit Breaker with cooldown tracking
class APICircuitBreaker:
    def __init__(self):
        self.failure_count = 0
        self.last_failure_time = None
        self.failure_threshold = 3
        self.recovery_timeout = 300  # 5 minutes
        self.success_count = 0
        
    def is_open(self) -> bool:
        """Check if circuit breaker is open (blocking requests)"""
        if self.failure_count >= self.failure_threshold:
            if self.last_failure_time:
                elapsed = (datetime.now() - self.last_failure_time).seconds
                if elapsed < self.recovery_timeout:
                    return True
                else:
                    # Reset after timeout
                    logger.info("Circuit breaker resetting after timeout")
                    self.failure_count = 0
                    self.last_failure_time = None
        return False
    
    def record_failure(self):
        """Record API failure"""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        self.success_count = 0
        logger.warning(f"Circuit breaker failure recorded: {self.failure_count}/{self.failure_threshold}")
        
    def record_success(self):
        """Record API success"""
        self.success_count += 1
        if self.success_count >= 2:  # Reset after 2 consecutive successes
            self.failure_count = 0
            self.last_failure_time = None
            logger.info("Circuit breaker reset after successful requests")
    
    def get_cooldown_remaining(self) -> int:
        """Get remaining cooldown time in seconds"""
        if not self.last_failure_time:
            return 0
        elapsed = (datetime.now() - self.last_failure_time).seconds
        remaining = max(0, self.recovery_timeout - elapsed)
        return remaining

circuit_breaker = APICircuitBreaker()

# Advanced retry handler with exponential backoff
async def handle_api_retry_advanced(func, max_retries: int = 5, base_wait: float = 2.0):
    """
    Advanced async retry logic optimized for Claude API 529 errors
    Implements exponential backoff with jitter
    """
    if circuit_breaker.is_open():
        cooldown = circuit_breaker.get_cooldown_remaining()
        raise HTTPException(
            status_code=503,
            detail={
                "error": "SERVICE_UNAVAILABLE",
                "message": "Service temporarily unavailable due to repeated API overloads",
                "cooldown_remaining": cooldown,
                "retry_after": f"{cooldown // 60} minutes {cooldown % 60} seconds"
            }
        )
    
    last_exception = None
    
    for attempt in range(max_retries):
        try:
            # Call function (handle both sync and async)
            if asyncio.iscoroutinefunction(func):
                result = await func()
            else:
                result = func()
            
            circuit_breaker.record_success()
            return result
            
        except Exception as e:
            last_exception = e
            error_str = str(e).lower()
            
            # Handle Claude API overload (529 errors)
            if "529" in error_str or "overloaded" in error_str:
                if attempt < max_retries - 1:
                    # Exponential backoff with jitter for 529 errors
                    wait_time = (base_wait ** (attempt + 1)) + random.uniform(0.5, 3.0)
                    logger.warning(
                        f"Claude API overloaded (529) - Attempt {attempt + 1}/{max_retries} "
                        f"- Waiting {wait_time:.1f}s"
                    )
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    circuit_breaker.record_failure()
                    raise HTTPException(
                        status_code=503,
                        detail={
                            "error": "API_OVERLOADED",
                            "message": "Claude API is experiencing high traffic",
                            "retry_after": "2-5 minutes",
                            "suggestion": "Try during off-peak hours for better performance",
                            "attempts": max_retries
                        }
                    )
            
            # Handle rate limiting (429)
            elif "rate limit" in error_str or "429" in error_str:
                if attempt < max_retries - 1:
                    wait_time = min(60, (attempt + 1) * 10)  # Cap at 60 seconds
                    logger.warning(f"Rate limited - Waiting {wait_time}s (attempt {attempt + 1})")
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    raise HTTPException(
                        status_code=429,
                        detail={
                            "error": "RATE_LIMIT_EXCEEDED",
                            "message": "Too many requests",
                            "retry_after": "60 seconds"
                        }
                    )
            
            # Handle authentication errors (401)
            elif "401" in error_str or "unauthorized" in error_str or "authentication" in error_str:
                raise HTTPException(
                    status_code=401,
                    detail={
                        "error": "AUTHENTICATION_FAILED",
                        "message": "API authentication failed",
                        "suggestion": "Check your ANTHROPIC_API_KEY configuration"
                    }
                )
            
            # Handle other API errors (400, 403, 404, 500, 502)
            elif "api" in error_str and any(code in error_str for code in ["400", "403", "404", "500", "502"]):
                status_code = 502
                for code in ["400", "403", "404", "500"]:
                    if code in error_str:
                        status_code = int(code)
                        break
                
                raise HTTPException(
                    status_code=status_code,
                    detail={
                        "error": "API_ERROR",
                        "message": f"Claude API returned an error: {str(e)[:200]}"
                    }
                )
            
            # For non-retryable errors, raise immediately
            else:
                logger.error(f"Non-retryable error: {e}")
                raise HTTPException(
                    status_code=500,
                    detail={
                        "error": "PROCESSING_ERROR",
                        "message": str(e)[:200]
                    }
                )
    
    # Maximum retries exceeded
    raise HTTPException(
        status_code=500,
        detail={
            "error": "MAX_RETRIES_EXCEEDED",
            "message": "Request failed after multiple attempts",
            "last_error": str(last_exception)[:200] if last_exception else "Unknown"
        }
    )

# Module initialization
modules_loaded = False
ai_detector = None
text_humanizer = None
plagiarism_detector = None
tone_manager = None
summarizer = None

try:
    from ai_detector import AITextDetector
    from humanizer import TextHumanizer
    from plagiarism_detector import PlagiarismDetector
    from tone import ToneManager  
    from summarizer import LlamaSummarizer
    
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        ai_detector = AITextDetector()
        text_humanizer = TextHumanizer(api_key, ai_detector)
        plagiarism_detector = PlagiarismDetector(api_key, ai_detector)
        tone_manager = ToneManager(api_key)
        summarizer = LlamaSummarizer(api_key)
        
        modules_loaded = True
        logger.info("✅ All modules loaded successfully with Claude Sonnet 4.5 API")
        logger.info(f"✅ API Key configured: {api_key[:20]}***")
    else:
        logger.warning("⚠️ ANTHROPIC_API_KEY not found in environment")
except ImportError as e:
    logger.error(f"❌ Failed to import modules: {e}")
    logger.error("Ensure all required modules are installed: ai_detector, humanizer, plagiarism_detector, tone, summarizer")
except Exception as e:
    logger.error(f"❌ Module initialization failed: {e}")

# Enhanced Request Models with validation
class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000, description="Text to analyze")

class HumanizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000, description="Text to humanize")

class PlagiarismRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000, description="Text to check for plagiarism")

class ToneChangeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000, description="Text to change tone")
    tone_mode: str = Field(default="professional", description="Target tone mode")

class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=100000, description="Text to summarize")
    summary_type: str = Field(default="abstractive", description="Type of summary")
    summary_length: str = Field(default="medium", description="Length of summary")

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AI Text Detector & Humanizer API v4.5",
        "status": "operational",
        "version": "4.5.0",
        "model": "Claude Sonnet 4.5",
        "modules_loaded": modules_loaded,
        "api_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
        "circuit_breaker": "closed" if not circuit_breaker.is_open() else "open",
        "powered_by": "Claude Sonnet 4.5 with Advanced Error Handling",
        "endpoints": {
            "core": ["/analyze", "/humanize", "/remove-plagiarism"],
            "advanced": ["/change-tone", "/summarize"],
            "info": ["/tone-modes", "/summary-options", "/health", "/api-status"]
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        }
    }

@app.get("/api-status")
async def get_api_status():
    """Get detailed API and circuit breaker status"""
    cooldown = circuit_breaker.get_cooldown_remaining()
    
    return {
        "timestamp": datetime.now().isoformat(),
        "circuit_breaker": {
            "status": "open" if circuit_breaker.is_open() else "closed",
            "failure_count": circuit_breaker.failure_count,
            "success_count": circuit_breaker.success_count,
            "failure_threshold": circuit_breaker.failure_threshold,
            "last_failure": circuit_breaker.last_failure_time.isoformat() if circuit_breaker.last_failure_time else None,
            "cooldown_remaining_seconds": cooldown,
            "cooldown_remaining_formatted": f"{cooldown // 60}m {cooldown % 60}s" if cooldown > 0 else "None"
        },
        "service": {
            "modules_loaded": modules_loaded,
            "api_key_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
            "version": "4.5.0",
            "model": "Claude Sonnet 4.5"
        },
        "recommendations": [
            "Service operating normally" if circuit_breaker.failure_count == 0 else "Experiencing elevated traffic",
            "Off-peak hours: Early morning (6-9 AM) or late evening (10 PM - 12 AM)" if cooldown > 0 else "All hours available"
        ]
    }

@app.post("/analyze")
async def analyze_text(request: TextAnalysisRequest):
    """Analyze text for AI-generated characteristics"""
    if not request.text.strip():
        raise HTTPException(
            status_code=400, 
            detail={"error": "INVALID_INPUT", "message": "Text cannot be empty"}
        )

    if modules_loaded and ai_detector:
        async def call_analysis():
            report, score, classification = ai_detector.get_detection_report(request.text)
            detected_patterns = ai_detector.detect_ai_patterns(request.text)
            return {
                "success": True,
                "ai_score": score,
                "classification": classification,
                "report": report,
                "detected_patterns": detected_patterns,
                "word_count": len(request.text.split()),
                "powered_by": "Claude Sonnet 4.5 Detection",
                "timestamp": datetime.now().isoformat()
            }
        return await handle_api_retry_advanced(call_analysis)
    else:
        # Enhanced fallback analysis
        word_count = len(request.text.split())
        text_lower = request.text.lower()
        
        ai_indicators = sum([
            "furthermore" in text_lower,
            "moreover" in text_lower,
            "it's important to note" in text_lower,
            "it is important to note" in text_lower,
            "significant" in text_lower,
            "utilize" in text_lower,
            "demonstrate" in text_lower,
            "implement" in text_lower,
            "facilitate" in text_lower,
            "cutting-edge" in text_lower,
            "paradigm shift" in text_lower,
            "comprehensive" in text_lower,
            "leverage" in text_lower
        ])
        
        score = min(95, 15 + (ai_indicators * 8))
        classification = "Likely AI-Generated" if score > 50 else "Likely Human-Written"
        
        return {
            "success": True,
            "ai_score": score,
            "classification": classification,
            "report": f"Basic analysis: {word_count} words analyzed, {ai_indicators} AI indicators detected",
            "detected_patterns": {
                "ai_phrases": ai_indicators,
                "detection_method": "pattern_matching"
            },
            "word_count": word_count,
            "note": "Using fallback analysis - Full Claude Sonnet 4.5 detection requires API key",
            "powered_by": "Basic Pattern Detection",
            "timestamp": datetime.now().isoformat()
        }

@app.post("/humanize")
async def humanize_text(request: HumanizeRequest):
    """Transform AI-generated text to appear more human-written"""
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail={"error": "INVALID_INPUT", "message": "Text cannot be empty"}
        )

    if modules_loaded and text_humanizer:
        async def call_humanizer():
            humanized_text, status, analysis = text_humanizer.humanize(request.text)
            return {
                "success": True,
                "humanized_text": humanized_text,
                "status": status,
                "analysis": analysis,
                "original_length": len(request.text.split()),
                "humanized_length": len(humanized_text.split()),
                "powered_by": "Claude Sonnet 4.5 Humanization",
                "timestamp": datetime.now().isoformat()
            }
        return await handle_api_retry_advanced(call_humanizer)
    else:
        # Enhanced fallback humanization
        text = request.text
        replacements = {
            "furthermore": "also",
            "moreover": "plus",
            "in addition": "and",
            "utilize": "use",
            "implement": "put in place",
            "facilitate": "help",
            "demonstrate": "show",
            "it's important to note that": "",
            "it is important to note that": "",
            "significant": "important",
            "optimize": "improve",
            "leverage": "use",
            "cutting-edge": "latest",
            "paradigm shift": "major change",
            "comprehensive": "complete",
            "fundamental": "basic",
            "substantial": "large"
        }
        
        changes_made = 0
        for old, new in replacements.items():
            if old in text.lower():
                text = text.replace(old, new)
                text = text.replace(old.capitalize(), new.capitalize())
                changes_made += 1
            
        return {
            "success": True,
            "humanized_text": text,
            "status": "Basic humanization completed",
            "analysis": f"Applied {changes_made} transformations",
            "original_length": len(request.text.split()),
            "humanized_length": len(text.split()),
            "note": "Using fallback humanization - Full Claude Sonnet 4.5 features require API key",
            "powered_by": "Basic Text Transformation",
            "timestamp": datetime.now().isoformat()
        }

@app.post("/remove-plagiarism")
async def remove_plagiarism(request: PlagiarismRequest):
    """Rewrite text to remove plagiarism and improve originality"""
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail={"error": "INVALID_INPUT", "message": "Text cannot be empty"}
        )

    if modules_loaded and plagiarism_detector:
        async def call_plagiarism_remover():
            cleaned_text, report = plagiarism_detector.remove(request.text)
            
            if isinstance(report, dict):
                return {
                    "success": True,
                    "rewritten_text": cleaned_text,
                    "original_word_count": len(request.text.split()),
                    "new_word_count": len(cleaned_text.split()),
                    "improvement": report.get("improvement", 0),
                    "ai_improvement": report.get("ai_improvement", 0),
                    "original_plagiarism_score": report.get("original_plagiarism_score", 0),
                    "new_plagiarism_score": report.get("new_plagiarism_score", 0),
                    "status": report.get("status", "Success"),
                    "powered_by": "Claude Sonnet 4.5 Rewriting",
                    "timestamp": datetime.now().isoformat()
                }
            else:
                return {
                    "success": True,
                    "rewritten_text": cleaned_text,
                    "original_word_count": len(request.text.split()),
                    "new_word_count": len(cleaned_text.split()),
                    "improvement": 30,
                    "ai_improvement": 25,
                    "status": str(report),
                    "powered_by": "Claude Sonnet 4.5 Rewriting",
                    "timestamp": datetime.now().isoformat()
                }
        return await handle_api_retry_advanced(call_plagiarism_remover)
    else:
        # Enhanced fallback rewriting
        text = request.text
        sentences = text.split('. ')
        rewritten = []
        
        advanced_replacements = {
            "significant": "important",
            "demonstrate": "show",
            "utilize": "use",
            "furthermore": "also",
            "moreover": "additionally",
            "implement": "apply",
            "facilitate": "enable",
            "optimize": "enhance",
            "leverage": "harness",
            "comprehensive": "complete",
            "substantial": "considerable",
            "innovative": "new",
            "cutting-edge": "advanced",
            "state-of-the-art": "latest",
            "paradigm shift": "major change"
        }
        
        for sentence in sentences:
            modified = sentence
            for old, new in advanced_replacements.items():
                modified = modified.replace(old, new)
                modified = modified.replace(old.capitalize(), new.capitalize())
            rewritten.append(modified)
        
        final_text = '. '.join(rewritten)
            
        return {
            "success": True,
            "rewritten_text": final_text,
            "original_word_count": len(request.text.split()),
            "new_word_count": len(final_text.split()),
            "improvement": 25,
            "ai_improvement": 20,
            "status": "Basic rewriting completed",
            "note": "Using fallback rewriting - Full Claude Sonnet 4.5 features require API key",
            "powered_by": "Basic Text Rewriting",
            "timestamp": datetime.now().isoformat()
        }

@app.post("/change-tone")
async def change_tone(request: ToneChangeRequest):
    """Transform text tone using Claude Sonnet 4.5"""
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail={"error": "INVALID_INPUT", "message": "Text cannot be empty"}
        )
    
    if not modules_loaded or not tone_manager:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "SERVICE_UNAVAILABLE",
                "message": "Tone manager not available",
                "suggestion": "Check API key configuration and module installation"
            }
        )
    
    async def call_tone_changer():
        changed_text, status, analysis = tone_manager.change_tone(
            text=request.text,
            tone_mode=request.tone_mode
        )
        return {
            "success": True,
            "changed_text": changed_text,
            "status": status,
            "analysis": analysis,
            "tone_mode": request.tone_mode,
            "original_length": len(request.text.split()),
            "changed_length": len(changed_text.split()),
            "powered_by": "Claude Sonnet 4.5 Tone Transformation",
            "timestamp": datetime.now().isoformat()
        }
    
    return await handle_api_retry_advanced(call_tone_changer)

@app.get("/tone-modes")
async def get_tone_modes():
    """Get available tone transformation modes"""
    if not modules_loaded or not tone_manager:
        return {
            "success": True,
            "available_modes": {
                "professional": {
                    "name": "💼 Professional",
                    "description": "Business and corporate communication"
                },
                "casual": {
                    "name": "😊 Casual",
                    "description": "Friendly and conversational"
                },
                "formal": {
                    "name": "👔 Formal",
                    "description": "Official and academic documents"
                },
                "persuasive": {
                    "name": "🎯 Persuasive",
                    "description": "Convincing and compelling"
                }
            },
            "note": "Limited modes available - Full features require API key",
            "api_required": True,
            "timestamp": datetime.now().isoformat()
        }
    
    return {
        "success": True,
        "available_modes": tone_manager.get_available_modes(),
        "powered_by": "Claude Sonnet 4.5",
        "api_required": False,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/summarize")
async def summarize_text_endpoint(request: SummarizeRequest):
    """Generate intelligent summaries using Claude Sonnet 4.5"""
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail={"error": "INVALID_INPUT", "message": "Text cannot be empty"}
        )
    
    if not modules_loaded or not summarizer:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "SERVICE_UNAVAILABLE",
                "message": "Summarizer not available",
                "suggestion": "Check API key configuration and module installation"
            }
        )
    
    async def call_summarizer():
        summary, status, analysis = summarizer.summarize(
            text=request.text,
            summary_type=request.summary_type,
            summary_length=request.summary_length
        )
        return {
            "success": True,
            "summary": summary,
            "status": status,
            "analysis": analysis,
            "summary_type": request.summary_type,
            "summary_length": request.summary_length,
            "original_length": len(request.text.split()),
            "summary_word_count": len(summary.split()),
            "compression_ratio": f"{(len(summary.split()) / len(request.text.split()) * 100):.1f}%",
            "powered_by": "Claude Sonnet 4.5 Summarization",
            "timestamp": datetime.now().isoformat()
        }
    
    return await handle_api_retry_advanced(call_summarizer)

@app.get("/summary-options")
async def get_summary_options():
    """Get available summary types and length options"""
    if not modules_loaded or not summarizer:
        return {
            "success": True,
            "available_types": {
                "abstractive": "Natural language summary",
                "bullet_points": "Key points in bullet format",
                "paragraph": "Condensed paragraph format"
            },
            "available_lengths": {
                "short": "Brief overview (20-30% of original)",
                "medium": "Balanced summary (40-50% of original)",
                "long": "Detailed summary (60-70% of original)"
            },
            "note": "Limited options - Full features require API key",
            "api_required": True,
            "timestamp": datetime.now().isoformat()
        }
    
    return {
        "success": True,
        "available_types": summarizer.get_available_types(),
        "available_lengths": summarizer.get_available_lengths(),
        "powered_by": "Claude Sonnet 4.5",
        "api_required": False,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Comprehensive health check endpoint"""
    cooldown = circuit_breaker.get_cooldown_remaining()
    
    return {
        "status": "healthy" if not circuit_breaker.is_open() else "degraded",
        "version": "4.5.0",
        "model": "Claude Sonnet 4.5",
        "timestamp": datetime.now().isoformat(),
        "service": {
            "modules_loaded": modules_loaded,
            "api_key_available": bool(os.getenv("ANTHROPIC_API_KEY")),
            "circuit_breaker_status": "open" if circuit_breaker.is_open() else "closed",
            "cooldown_remaining": f"{cooldown // 60}m {cooldown % 60}s" if cooldown > 0 else "None"
        },
        "endpoints": {
            "core": ["/analyze", "/humanize", "/remove-plagiarism"],
            "advanced": ["/change-tone", "/summarize"],
            "info": ["/tone-modes", "/summary-options", "/health", "/api-status"]
        },
        "features": {
            "error_handling": "Advanced 529 retry with exponential backoff",
            "circuit_breaker": "Automatic service protection",
            "async_support": "Full async/await implementation"
        },
        "powered_by": "Claude Sonnet 4.5" if modules_loaded else "Basic fallback mode"
    }

# Enhanced OPTIONS handlers for CORS preflight
@app.options("/{path:path}")
async def options_handler(path: str):
    """Handle CORS preflight requests"""
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

# Enhanced error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with detailed error responses"""
    logger.error(f"HTTP {exc.status_code}: {exc.detail} for {request.url}")
    
    error_response = {
        "success": False,
        "error": True,
        "status_code": exc.status_code,
        "path": str(request.url.path),
        "timestamp": datetime.now().isoformat()
    }
    
    # Add detailed information based on error type
    if isinstance(exc.detail, dict):
        error_response.update(exc.detail)
    else:
        error_response["detail"] = exc.detail
    
    # Add helpful suggestions for common errors
    if exc.status_code == 503:
        error_response["suggestions"] = [
            "Wait for the specified cooldown period",
            "Try during off-peak hours (early morning or late evening)",
            "Check /api-status for current service status"
        ]
    elif exc.status_code == 429:
        error_response["suggestions"] = [
            "Reduce request frequency",
            "Wait 60 seconds before retrying",
            "Consider batching requests"
        ]
    
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.error(f"Unhandled exception: {exc} for {request.url}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": True,
            "status_code": 500,
            "error_type": "INTERNAL_SERVER_ERROR",
            "detail": "An unexpected error occurred",
            "message": str(exc)[:200],
            "path": str(request.url.path),
            "timestamp": datetime.now().isoformat(),
            "suggestion": "Please try again or check /api-status for service health"
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info("=" * 60)
    logger.info("🚀 AI Text Detector & Humanizer API v4.5 Starting...")
    logger.info(f"🤖 Model: Claude Sonnet 4.5")
    logger.info(f"📦 Modules loaded: {modules_loaded}")
    logger.info(f"🔑 API Key configured: {bool(os.getenv('ANTHROPIC_API_KEY'))}")
    logger.info(f"🌐 CORS enabled for configured origins")
    logger.info(f"⚡ Circuit breaker: Active with {circuit_breaker.failure_threshold} failure threshold")
    logger.info(f"📚 Documentation available at /docs and /redoc")
    logger.info("=" * 60)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

