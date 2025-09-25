# # """
# # Simplified FastAPI Application - Working Version
# # AI Text Detector, Humanizer & Plagiarism Checker API
# # """

# # from fastapi import FastAPI, HTTPException
# # from fastapi.middleware.cors import CORSMiddleware
# # from pydantic import BaseModel
# # import logging
# # import os
# # from typing import Optional

# # # Configure logging
# # logging.basicConfig(level=logging.INFO)
# # logger = logging.getLogger(__name__)

# # # Initialize FastAPI app FIRST
# # app = FastAPI(
# #     title="AI Text Detector & Humanizer API", 
# #     version="2.0.0",
# #     description="Advanced AI text detection, humanization, and plagiarism checking API"
# # )

# # # Add CORS middleware
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],  # Allow all origins for now
# #     allow_credentials=True,
# #     allow_methods=["GET", "POST", "OPTIONS"],
# #     allow_headers=["*"],
# # )

# # # Try to import custom modules, but don't fail if they don't exist
# # try:
# #     from ai_detector import AITextDetector
# #     from humanizer import TextHumanizer
# #     from plagiarism_detector import PlagiarismDetector
    
# #     # Get API key
# #     api_key = os.getenv("ANTHROPIC_API_KEY", "dummy_key")
    
# #     # Initialize modules
# #     ai_detector = AITextDetector()
# #     text_humanizer = TextHumanizer(api_key, ai_detector)
# #     plagiarism_detector = PlagiarismDetector(api_key, ai_detector)
    
# #     modules_loaded = True
# #     logger.info("✅ All modules loaded successfully")
    
# # except ImportError as e:
# #     logger.warning(f"⚠️ Custom modules not found: {e}")
# #     logger.warning("🔄 Running in basic mode without custom modules")
# #     modules_loaded = False

# # # Pydantic models
# # class TextAnalysisRequest(BaseModel):
# #     text: str

# # class HumanizeRequest(BaseModel):
# #     text: str

# # class PlagiarismCheckRequest(BaseModel):
# #     text1: str
# #     text2: str

# # class PlagiarismRemoveRequest(BaseModel):
# #     text: str
# #     rewrite_mode: Optional[str] = "balanced"
# #     reference_text: Optional[str] = ""

# # # Root endpoint
# # @app.get("/")
# # async def root():
# #     """Root endpoint with API information"""
# #     return {
# #         "message": "AI Text Detector & Humanizer API",
# #         "version": "2.0.0",
# #         "status": "running",
# #         "modules_loaded": modules_loaded,
# #         "endpoints": [
# #             "GET /",
# #             "POST /analyze",
# #             "POST /humanize", 
# #             "POST /plagiarism/check",
# #             "POST /plagiarism/remove"
# #         ]
# #     }

# # # Health check endpoint
# # @app.get("/health")
# # async def health():
# #     """Health check endpoint"""
# #     return {
# #         "status": "healthy",
# #         "modules_loaded": modules_loaded
# #     }

# # # Basic text analysis (works without custom modules)
# # @app.post("/analyze")
# # async def analyze_text(request: TextAnalysisRequest):
# #     """Analyze text for AI characteristics"""
# #     if not request.text.strip():
# #         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
# #     if modules_loaded:
# #         try:
# #             report, score, classification = ai_detector.get_detection_report(request.text)
# #             detected_patterns = ai_detector.detect_ai_patterns(request.text)
            
# #             return {
# #                 "ai_score": score,
# #                 "classification": classification,
# #                 "report": report,
# #                 "detected_patterns": detected_patterns
# #             }
# #         except Exception as e:
# #             raise HTTPException(status_code=500, detail=str(e))
# #     else:
# #         # Basic analysis without custom modules
# #         word_count = len(request.text.split())
# #         char_count = len(request.text)
        
# #         # Simple heuristic scoring
# #         ai_indicators = 0
# #         if "furthermore" in request.text.lower():
# #             ai_indicators += 1
# #         if "moreover" in request.text.lower():
# #             ai_indicators += 1
# #         if "it's important to note" in request.text.lower():
# #             ai_indicators += 2
        
# #         score = min(90, 20 + (ai_indicators * 15))
# #         classification = "Likely AI" if score > 60 else "Likely Human"
        
# #         return {
# #             "ai_score": score,
# #             "classification": classification,
# #             "report": {
# #                 "word_count": word_count,
# #                 "char_count": char_count,
# #                 "ai_indicators_found": ai_indicators,
# #                 "note": "Basic analysis mode - install custom modules for advanced detection"
# #             },
# #             "detected_patterns": {}
# #         }

# # @app.post("/humanize")
# # async def humanize_text(request: HumanizeRequest):
# #     """Humanize AI-generated text"""
# #     if not request.text.strip():
# #         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
# #     if modules_loaded:
# #         try:
# #             humanized_text, status, analysis = text_humanizer.humanize(request.text)
# #             return {
# #                 "humanized_text": humanized_text,
# #                 "status": status,
# #                 "analysis": analysis
# #             }
# #         except Exception as e:
# #             raise HTTPException(status_code=500, detail=str(e))
# #     else:
# #         # Basic humanization without custom modules
# #         text = request.text
# #         text = text.replace("furthermore", "also")
# #         text = text.replace("moreover", "plus")
# #         text = text.replace("it's important to note that", "")
# #         text = text.replace("utilize", "use")
        
# #         return {
# #             "humanized_text": text,
# #             "status": "Basic humanization completed (custom modules not loaded)",
# #             "analysis": {
# #                 "note": "Basic mode - install custom modules for advanced humanization"
# #             }
# #         }

# # @app.post("/plagiarism/check")
# # async def plagiarism_check(request: PlagiarismCheckRequest):
# #     """Check plagiarism between two texts"""
# #     if modules_loaded:
# #         try:
# #             score, matches = plagiarism_detector.check(request.text1, request.text2)
# #             return {
# #                 "similarity_score": score,
# #                 "matches": matches
# #             }
# #         except Exception as e:
# #             raise HTTPException(status_code=500, detail=str(e))
# #     else:
# #         # Basic similarity check
# #         from difflib import SequenceMatcher
# #         similarity = SequenceMatcher(None, request.text1.lower(), request.text2.lower()).ratio()
        
# #         return {
# #             "similarity_score": similarity * 100,
# #             "matches": [],
# #             "note": "Basic similarity check - install custom modules for advanced plagiarism detection"
# #         }

# # @app.post("/plagiarism/remove")
# # async def plagiarism_remove(request: PlagiarismRemoveRequest):
# #     """Remove plagiarism from text"""
# #     if modules_loaded:
# #         try:
# #             cleaned_text, report = plagiarism_detector.remove(
# #                 text=request.text,
# #                 rewrite_mode=request.rewrite_mode,
# #                 reference_text=request.reference_text
# #             )
# #             return {
# #                 "cleaned_text": cleaned_text,
# #                 "report": report
# #             }
# #         except Exception as e:
# #             raise HTTPException(status_code=500, detail=str(e))
# #     else:
# #         # Basic text cleaning
# #         text = request.text
# #         text = text.replace("significant", "important")
# #         text = text.replace("demonstrate", "show") 
# #         text = text.replace("utilize", "use")
        
# #         return {
# #             "cleaned_text": text,
# #             "report": {
# #                 "status": "Basic cleaning completed (custom modules not loaded)",
# #                 "note": "Install custom modules for advanced plagiarism removal"
# #             }
# #         }

# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(app, host="0.0.0.0", port=8000)


# # from fastapi import FastAPI, HTTPException
# # from fastapi.middleware.cors import CORSMiddleware
# # from pydantic import BaseModel
# # import os
# # import time
# # import random
# # import logging
# # from typing import Optional

# # # Configure logging
# # logging.basicConfig(level=logging.INFO)
# # logger = logging.getLogger(__name__)

# # app = FastAPI(title="AI Text Detector & Humanizer API")

# # # app.add_middleware(
# # #     CORSMiddleware,
# # #     allow_origins=["https://your-frontend-domain.com"],
# # #     allow_credentials=True,
# # #     allow_methods=["*"],
# # #     allow_headers=["*"],
# # # )
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=[
# #         "https://test-finam.onrender.com",  # your frontend
# #         "http://localhost:3000",            # local dev
# #          "http://localhost:5173",
# #          "http://127.0.0.1:5173",
##           "http://127.0.0.1:8000" 
# #     ],
# #     allow_credentials=True,
# #     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
# #     allow_headers=["*"],
# # )


# # def handle_api_retry(func, max_retries=3):
# #     """
# #     Wrapper function to handle API calls with retry logic for overload errors
# #     """
# #     for attempt in range(max_retries):
# #         try:
# #             return func()
# #         except Exception as e:
# #             error_str = str(e).lower()
            
# #             # Check if it's an overload error
# #             if "overloaded" in error_str or "529" in error_str:
# #                 if attempt < max_retries - 1:
# #                     # Wait with exponential backoff + random jitter
# #                     wait_time = (2 ** attempt) + random.uniform(0, 1)
# #                     logger.info(f"API overloaded, retrying in {wait_time:.1f} seconds... (attempt {attempt + 1})")
# #                     time.sleep(wait_time)
# #                     continue
# #                 else:
# #                     # All retries exhausted
# #                     raise HTTPException(
# #                         status_code=503, 
# #                         detail="Service temporarily overloaded. Please try again in a few minutes."
# #                     )
# #             else:
# #                 # Non-overload error, don't retry
# #                 raise e
    
# #     # This shouldn't be reached, but just in case
# #     raise HTTPException(status_code=500, detail="Unexpected error")

# # # Try to load custom modules
# # modules_loaded = False
# # ai_detector = None
# # text_humanizer = None
# # plagiarism_detector = None

# # try:
# #     from ai_detector import AITextDetector
# #     from humanizer import TextHumanizer
# #     from plagiarism_detector import PlagiarismDetector
    
# #     api_key = os.getenv("ANTHROPIC_API_KEY")
# #     if api_key:
# #         ai_detector = AITextDetector()
# #         text_humanizer = TextHumanizer(api_key, ai_detector)
# #         plagiarism_detector = PlagiarismDetector(api_key, ai_detector)
# #         modules_loaded = True
# #         logger.info("✅ All modules loaded successfully")
# #     else:
# #         logger.warning("⚠️ ANTHROPIC_API_KEY not found")
# # except Exception as e:
# #     logger.error(f"❌ Failed to load modules: {e}")
# #     pass

# # class TextAnalysisRequest(BaseModel):
# #     text: str

# # class HumanizeRequest(BaseModel):
# #     text: str

# # class PlagiarismRemoveRequest(BaseModel):
# #     text: str
# #     rewrite_mode: Optional[str] = "balanced"
# #     reference_text: Optional[str] = ""

# # @app.get("/")
# # def root():
# #     return {
# #         "message": "AI Text Detector & Humanizer API",
# #         "status": "running", 
# #         "modules_loaded": modules_loaded,
# #         "api_key_available": bool(os.getenv("ANTHROPIC_API_KEY"))
# #     }

# # @app.post("/analyze")
# # def analyze_text(request: TextAnalysisRequest):
# #     if not request.text.strip():
# #         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
# #     if modules_loaded and ai_detector:
# #         def call_analysis():
# #             report, score, classification = ai_detector.get_detection_report(request.text)
# #             detected_patterns = ai_detector.detect_ai_patterns(request.text)
# #             return {
# #                 "ai_score": score,
# #                 "classification": classification,
# #                 "report": report,
# #                 "detected_patterns": detected_patterns
# #             }
        
# #         try:
# #             return handle_api_retry(call_analysis)
# #         except HTTPException:
# #             raise
# #         except Exception as e:
# #             logger.error(f"Analysis error: {e}")
# #             raise HTTPException(status_code=500, detail=str(e))
# #     else:
# #         # Basic analysis fallback
# #         word_count = len(request.text.split())
# #         ai_indicators = 0
        
# #         text_lower = request.text.lower()
# #         if "furthermore" in text_lower:
# #             ai_indicators += 1
# #         if "moreover" in text_lower:
# #             ai_indicators += 1
# #         if "it's important to note" in text_lower:
# #             ai_indicators += 2
# #         if "significant" in text_lower:
# #             ai_indicators += 1
# #         if "utilize" in text_lower:
# #             ai_indicators += 1
            
# #         score = min(90, 20 + (ai_indicators * 15))
# #         classification = "Likely AI" if score > 60 else "Likely Human"
        
# #         return {
# #             "ai_score": score,
# #             "classification": classification,
# #             "report": f"Word count: {word_count}, AI indicators: {ai_indicators}. Note: Basic analysis mode",
# #             "detected_patterns": {}
# #         }

# # @app.post("/humanize")
# # def humanize_text(request: HumanizeRequest):
# #     if not request.text.strip():
# #         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
# #     if modules_loaded and text_humanizer:
# #         def call_humanizer():
# #             humanized_text, status, analysis = text_humanizer.humanize(request.text)
# #             return {
# #                 "humanized_text": humanized_text,
# #                 "status": status,
# #                 "analysis": analysis
# #             }
        
# #         try:
# #             return handle_api_retry(call_humanizer)
# #         except HTTPException:
# #             raise
# #         except Exception as e:
# #             logger.error(f"Humanization error: {e}")
# #             raise HTTPException(status_code=500, detail=str(e))
# #     else:
# #         # Basic fallback
# #         text = request.text
# #         text = text.replace("furthermore", "also")
# #         text = text.replace("moreover", "plus")
# #         text = text.replace("utilize", "use")
# #         text = text.replace("it's important to note that", "")
# #         text = text.replace("significant", "important")
# #         return {
# #             "humanized_text": text,
# #             "status": "Basic mode - modules not loaded",
# #             "analysis": "Using basic text replacement"
# #         }

# # @app.post("/remove-plagiarism")
# # def remove_plagiarism(request: PlagiarismRemoveRequest):
# #     if not request.text.strip():
# #         raise HTTPException(status_code=400, detail="Text cannot be empty")
        
# #     if modules_loaded and plagiarism_detector:
# #         def call_plagiarism_remover():
# #             cleaned_text, report = plagiarism_detector.remove(
# #                 text=request.text,
# #                 rewrite_mode=request.rewrite_mode,
# #                 reference_text=request.reference_text
# #             )
            
# #             # Extract data from report if it's a dict
# #             if isinstance(report, dict):
# #                 return {
# #                     "rewritten_text": cleaned_text,  # ✅ Fixed: Frontend expects 'rewritten_text'
# #                     "original_word_count": len(request.text.split()),
# #                     "new_word_count": len(cleaned_text.split()),
# #                     "improvement": report.get("improvement", 0),
# #                     "ai_improvement": report.get("ai_improvement", 0),
# #                     "original_plagiarism_score": report.get("original_plagiarism_score", 0),
# #                     "new_plagiarism_score": report.get("new_plagiarism_score", 0),
# #                     "rewrite_mode": request.rewrite_mode,
# #                     "status": report.get("status", "Success")
# #                 }
# #             else:
# #                 return {
# #                     "rewritten_text": cleaned_text,  # ✅ Fixed: Frontend expects 'rewritten_text'
# #                     "original_word_count": len(request.text.split()),
# #                     "new_word_count": len(cleaned_text.split()),
# #                     "improvement": 25,  # Default improvement
# #                     "ai_improvement": 20,
# #                     "rewrite_mode": request.rewrite_mode,
# #                     "status": str(report)
# #                 }
        
# #         try:
# #             return handle_api_retry(call_plagiarism_remover)
# #         except HTTPException:
# #             raise
# #         except Exception as e:
# #             logger.error(f"Plagiarism removal error: {e}")
# #             raise HTTPException(status_code=500, detail=str(e))
# #     else:
# #         # Basic fallback with correct response structure
# #         text = request.text
# #         text = text.replace("significant", "important")
# #         text = text.replace("demonstrate", "show")
# #         text = text.replace("utilize", "use")
# #         text = text.replace("furthermore", "also")
# #         text = text.replace("moreover", "plus")
# #         text = text.replace("implement", "use")
# #         text = text.replace("facilitate", "help")
# #         text = text.replace("optimize", "improve")
# #         text = text.replace("leverage", "use")
        
# #         return {
# #             "rewritten_text": text,  # ✅ Fixed: Frontend expects 'rewritten_text'
# #             "original_word_count": len(request.text.split()),
# #             "new_word_count": len(text.split()),
# #             "improvement": 15,  # Estimated improvement
# #             "ai_improvement": 10,
# #             "rewrite_mode": request.rewrite_mode,
# #             "status": "Basic mode - modules not loaded"
# #         }

# # @app.get("/health")
# # def health_check():
# #     return {
# #         "status": "healthy",
# #         "modules_loaded": modules_loaded,
# #         "api_key_available": bool(os.getenv("ANTHROPIC_API_KEY")),
# #         "endpoints": ["/analyze", "/humanize", "/remove-plagiarism"]
# #     }

# # # CORS preflight handlers
# # @app.options("/analyze")
# # async def options_analyze():
# #     return {"message": "OK"}

# # @app.options("/humanize")
# # async def options_humanize():
# #     return {"message": "OK"}

# # @app.options("/remove-plagiarism")
# # async def options_remove_plagiarism():
# #     return {"message": "OK"}

# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(app, host="0.0.0.0", port=8000)



# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import os
# import time
# import random
# import logging
# from typing import Optional

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(title="AI Text Detector & Humanizer API")

# # CORS setup
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://test-finam.onrender.com",  # frontend
#         "http://localhost:3000",           # local dev
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# def handle_api_retry(func, max_retries=3):
#     """
#     Wrapper to retry API calls with exponential backoff when overloaded
#     """
#     for attempt in range(max_retries):
#         try:
#             return func()
#         except Exception as e:
#             error_str = str(e).lower()
#             if "overloaded" in error_str or "529" in error_str:
#                 if attempt < max_retries - 1:
#                     wait_time = (2 ** attempt) + random.uniform(0, 1)
#                     logger.info(f"API overloaded, retrying in {wait_time:.1f}s... (attempt {attempt+1})")
#                     time.sleep(wait_time)
#                     continue
#                 raise HTTPException(status_code=503, detail="Service overloaded. Try again later.")
#             raise e
#     raise HTTPException(status_code=500, detail="Unexpected error")

# # Try to load custom modules
# modules_loaded = False
# ai_detector = None
# text_humanizer = None
# plagiarism_detector = None
# tone_manager = None
# summarizer = None

# try:
#     from ai_detector import AITextDetector
#     from humanizer import TextHumanizer
#     from plagiarism_detector import PlagiarismDetector
#     from tone import ToneManager  # Updated tone module with Llama
#     from summarizer import LlamaSummarizer  # Updated summarizer with Llama
    
#     api_key = os.getenv("ANTHROPIC_API_KEY", "dummy_key")  # Use dummy for free models
    
#     # Initialize modules
#     ai_detector = AITextDetector()
#     text_humanizer = TextHumanizer(api_key, ai_detector)
#     plagiarism_detector = PlagiarismDetector(api_key, ai_detector)
    
#     # Initialize Llama-based modules (free)
#     tone_manager = ToneManager()  # Uses Llama locally
#     summarizer = LlamaSummarizer("llama2")  # Uses Llama locally
    
#     modules_loaded = True
#     logger.info("✅ All modules loaded successfully")
#     logger.info(f"✅ Tone Manager: {tone_manager.ollama_available}")
#     logger.info(f"✅ Summarizer: {summarizer.ollama_available}")
    
# except Exception as e:
#     logger.error(f"❌ Failed to load modules: {e}")

# # Request models
# class TextAnalysisRequest(BaseModel):
#     text: str

# class HumanizeRequest(BaseModel):
#     text: str

# class PlagiarismRequest(BaseModel):
#     text: str

# class ToneChangeRequest(BaseModel):
#     text: str
#     tone_mode: str = "standard"
#     pattern_info: Optional[str] = ""

# class SummarizeRequest(BaseModel):
#     text: str
#     mode: str = "quick"
#     length: Optional[str] = None

# @app.get("/")
# def root():
#     return {
#         "message": "AI Text Detector & Humanizer API",
#         "status": "running",
#         "modules_loaded": modules_loaded,
#         "api_key_available": bool(os.getenv("ANTHROPIC_API_KEY")),
#         "llama_available": {
#             "tone_manager": tone_manager.ollama_available if tone_manager else False,
#             "summarizer": summarizer.ollama_available if summarizer else False
#         }
#     }

# @app.post("/analyze")
# def analyze_text(request: TextAnalysisRequest):
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
#                 "detected_patterns": detected_patterns
#             }
#         return handle_api_retry(call_analysis)
#     else:
#         # Basic fallback
#         word_count = len(request.text.split())
#         ai_indicators = sum(
#             phrase in request.text.lower()
#             for phrase in ["furthermore", "moreover", "it's important to note", "significant", "utilize"]
#         )
#         score = min(90, 20 + (ai_indicators * 15))
#         classification = "Likely AI" if score > 60 else "Likely Human"
#         return {
#             "ai_score": score,
#             "classification": classification,
#             "report": f"Word count: {word_count}, AI indicators: {ai_indicators}. Basic mode",
#             "detected_patterns": {}
#         }

# @app.post("/humanize")
# def humanize_text(request: HumanizeRequest):
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")

#     if modules_loaded and text_humanizer:
#         def call_humanizer():
#             humanized_text, status, analysis = text_humanizer.humanize(request.text)
#             return {
#                 "humanized_text": humanized_text,
#                 "status": status,
#                 "analysis": analysis
#             }
#         return handle_api_retry(call_humanizer)
#     else:
#         # Basic fallback
#         text = request.text
#         replacements = {
#             "furthermore": "also",
#             "moreover": "plus",
#             "utilize": "use",
#             "it's important to note that": "",
#             "significant": "important"
#         }
#         for k, v in replacements.items():
#             text = text.replace(k, v)
#         return {
#             "humanized_text": text,
#             "status": "Basic mode - modules not loaded",
#             "analysis": "Simple word replacements applied"
#         }

# @app.post("/remove-plagiarism")
# def remove_plagiarism(request: PlagiarismRequest):
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")

#     if modules_loaded and plagiarism_detector:
#         def call_plagiarism_remover():
#             cleaned_text, report = plagiarism_detector.remove(request.text)
#             if isinstance(report, dict):
#                 return {
#                     "rewritten_text": cleaned_text,
#                     "original_word_count": len(request.text.split()),
#                     "new_word_count": len(cleaned_text.split()),
#                     "improvement": report.get("improvement", 0),
#                     "ai_improvement": report.get("ai_improvement", 0),
#                     "original_plagiarism_score": report.get("original_plagiarism_score", 0),
#                     "new_plagiarism_score": report.get("new_plagiarism_score", 0),
#                     "status": report.get("status", "Success")
#                 }
#             return {
#                 "rewritten_text": cleaned_text,
#                 "original_word_count": len(request.text.split()),
#                 "new_word_count": len(cleaned_text.split()),
#                 "improvement": 25,
#                 "ai_improvement": 20,
#                 "status": str(report)
#             }
#         return handle_api_retry(call_plagiarism_remover)
#     else:
#         # Basic fallback
#         text = request.text
#         replacements = {
#             "significant": "important",
#             "demonstrate": "show",
#             "utilize": "use",
#             "furthermore": "also",
#             "moreover": "plus",
#             "implement": "use",
#             "facilitate": "help",
#             "optimize": "improve",
#             "leverage": "use"
#         }
#         for k, v in replacements.items():
#             text = text.replace(k, v)
#         return {
#             "rewritten_text": text,
#             "original_word_count": len(request.text.split()),
#             "new_word_count": len(text.split()),
#             "improvement": 15,
#             "ai_improvement": 10,
#             "status": "Basic mode - modules not loaded"
#         }

# # NEW ENDPOINT: Tone Change
# @app.post("/change-tone")
# def change_tone(request: ToneChangeRequest):
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
#     if not modules_loaded or not tone_manager:
#         raise HTTPException(status_code=503, detail="Tone manager not available")
    
#     def call_tone_changer():
#         changed_text, status, analysis = tone_manager.change_tone(
#             request.text, 
#             request.tone_mode, 
#             request.pattern_info or ""
#         )
#         return {
#             "changed_text": changed_text,
#             "status": status,
#             "analysis": analysis,
#             "tone_mode": request.tone_mode
#         }
    
#     return handle_api_retry(call_tone_changer)

# # NEW ENDPOINT: Get Available Tone Modes
# @app.get("/tone-modes")
# def get_tone_modes():
#     if not modules_loaded or not tone_manager:
#         raise HTTPException(status_code=503, detail="Tone manager not available")
    
#     return {
#         "available_modes": tone_manager.get_available_modes(),
#         "modes_by_category": tone_manager.get_modes_by_category(),
#         "ollama_available": tone_manager.ollama_available
#     }

# # NEW ENDPOINT: Summarize Text
# @app.post("/summarize")
# def summarize_text(request: SummarizeRequest):
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
#     if not modules_loaded or not summarizer:
#         raise HTTPException(status_code=503, detail="Summarizer not available")
    
#     def call_summarizer():
#         summary, status, analysis = summarizer.summarize(
#             request.text,
#             request.mode,
#             request.length
#         )
#         return {
#             "summary": summary,
#             "status": status,
#             "analysis": analysis,
#             "mode": request.mode,
#             "length": request.length or "default"
#         }
    
#     return handle_api_retry(call_summarizer)

# # NEW ENDPOINT: Get Available Summary Options
# @app.get("/summary-options")
# def get_summary_options():
#     if not modules_loaded or not summarizer:
#         raise HTTPException(status_code=503, detail="Summarizer not available")
    
#     return {
#         "available_modes": summarizer.get_available_modes(),
#         "available_lengths": summarizer.get_available_lengths(),
#         "ollama_available": summarizer.ollama_available
#     }

# @app.get("/health")
# def health_check():
#     return {
#         "status": "healthy",
#         "modules_loaded": modules_loaded,
#         "api_key_available": bool(os.getenv("ANTHROPIC_API_KEY")),
#         "llama_services": {
#             "tone_manager_available": tone_manager.ollama_available if tone_manager else False,
#             "summarizer_available": summarizer.ollama_available if summarizer else False
#         },
#         "endpoints": [
#             "/analyze", 
#             "/humanize", 
#             "/remove-plagiarism",
#             "/change-tone",           # NEW
#             "/tone-modes",            # NEW
#             "/summarize",             # NEW
#             "/summary-options"        # NEW
#         ]
#     }

# # Preflight handlers
# @app.options("/{path:path}")
# async def options_handler(path: str):
#     return {"message": "OK"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, time, random, logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Text Detector & Humanizer API (Lightweight)")

# Fixed CORS setup - include both localhost and 127.0.0.1
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
    allow_methods=["*"],
    allow_headers=["*"],
)

def handle_api_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if "overloaded" in str(e).lower() or "529" in str(e):
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + random.uniform(0, 1)
                    logger.info(f"API overloaded, retrying in {wait_time:.1f}s... (attempt {attempt+1})")
                    time.sleep(wait_time)
                    continue
                raise HTTPException(status_code=503, detail="Service overloaded. Try again later.")
            raise e
    raise HTTPException(status_code=500, detail="Unexpected error")

# Lazy module placeholders
ai_detector = None
text_humanizer = None
plagiarism_detector = None
tone_manager = None
summarizer = None

def load_tone_manager():
    global tone_manager
    if not tone_manager:
        try:
            from tone import ToneManager
            tone_manager = ToneManager()
        except ImportError as e:
            logger.error(f"Failed to import ToneManager: {e}")
            raise HTTPException(status_code=500, detail="ToneManager not available")
    return tone_manager

def load_summarizer():
    global summarizer
    if not summarizer:
        try:
            from summarizer import LlamaSummarizer
            summarizer = LlamaSummarizer()  # Fixed: removed parameter
        except ImportError as e:
            logger.error(f"Failed to import LlamaSummarizer: {e}")
            raise HTTPException(status_code=500, detail="Summarizer not available")
    return summarizer

# Request models
class TextAnalysisRequest(BaseModel): 
    text: str

class HumanizeRequest(BaseModel): 
    text: str

class PlagiarismRequest(BaseModel): 
    text: str

class ToneChangeRequest(BaseModel): 
    text: str
    tone_mode: str = "standard"
    pattern_info: Optional[str] = ""

class SummarizeRequest(BaseModel): 
    text: str
    mode: str = "abstractive"  # Changed default to match your summarizer
    length: str = "medium"     # Made required with default

@app.get("/")
def root():
    return {"message": "AI Text Detector & Humanizer API (Lightweight)", "status": "running"}

@app.post("/change-tone")
def change_tone(request: ToneChangeRequest):
    if not request.text.strip(): 
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        tm = load_tone_manager()
        changed_text, status, analysis = tm.change_tone(request.text, request.tone_mode)
        return {"changed_text": changed_text, "status": status, "analysis": analysis, "tone_mode": request.tone_mode}
    except Exception as e:
        logger.error(f"Tone change error: {e}")
        raise HTTPException(status_code=500, detail=f"Tone change failed: {str(e)}")

@app.get("/tone-modes")
def get_tone_modes():
    try:
        tm = load_tone_manager()
        return {"available_modes": tm.get_available_modes(), "modes_by_category": tm.get_modes_by_category()}
    except Exception as e:
        logger.error(f"Get tone modes error: {e}")
        # Fallback response
        return {"available_modes": ["standard", "formal", "casual"], "modes_by_category": {"Basic": ["standard", "formal", "casual"]}}

@app.post("/summarize")
def summarize_text(request: SummarizeRequest):
    if not request.text.strip(): 
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        sm = load_summarizer()
        summary, status, analysis = sm.summarize(request.text, request.mode, request.length)
        return {"summary": summary, "status": status, "analysis": analysis, "mode": request.mode}
    except Exception as e:
        logger.error(f"Summarize error: {e}")
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@app.get("/summary-options")
def get_summary_options():
    try:
        sm = load_summarizer()
        return {
            "available_modes": sm.get_available_types(), 
            "available_lengths": sm.get_available_lengths()
        }
    except Exception as e:
        logger.error(f"Get summary options error: {e}")
        # Fallback response that matches your frontend expectations
        return {
            "available_modes": [
                "abstractive", "extractive", "bullet_points", "executive", 
                "academic", "social", "technical", "outline", "paragraph", "narrative"
            ],
            "available_lengths": [
                "ultra_short", "short", "medium", "long", "detailed"
            ]
        }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "llama_services": {
            "tone_manager_available": bool(tone_manager),
            "summarizer_available": bool(summarizer)
        },
        "endpoints": ["/change-tone", "/tone-modes", "/summarize", "/summary-options"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))