

# # # """
# # # plagiarism_detector.py

# # # Plagiarism Detection & Removal:
# # # - Uses Anthropic Claude if ANTHROPIC_API_KEY is set.
# # # - Falls back to rule-based rewrites using ai_patterns.json and phrasal_patterns.xlsx.
# # # - Safe, robust, and compatible with existing main.py (expects .remove()).
# # # """

# # # from __future__ import annotations
# # # import os
# # # import re
# # # import json
# # # import time
# # # import logging
# # # import random
# # # from pathlib import Path
# # # from typing import Dict, Tuple, List
# # # from difflib import SequenceMatcher

# # # # optional import (openpyxl might not be installed in some environments)
# # # try:
# # #     import openpyxl
# # # except Exception:
# # #     openpyxl = None

# # # # optional anthopic client import
# # # try:
# # #     import anthropic
# # # except Exception:
# # #     anthropic = None

# # # # logging
# # # logger = logging.getLogger(__name__)
# # # if not logger.handlers:
# # #     logging.basicConfig(level=logging.INFO)


# # # # ---------------- Helpers to load rule files ---------------- #
# # # BASE_DIR = Path(__file__).resolve().parent


# # # def load_json_patterns(filename: str = "ai_patterns.json") -> Dict[str, str]:
# # #     path = BASE_DIR / filename
# # #     if not path.exists():
# # #         logger.info(f"JSON patterns file not found at {path}")
# # #         return {}
# # #     try:
# # #         with path.open("r", encoding="utf-8") as f:
# # #             data = json.load(f)
# # #             # ensure mapping str->str and lowercase keys for safer matching
# # #             return {str(k).strip().lower(): str(v).strip() for k, v in data.items()}
# # #     except Exception as e:
# # #         logger.warning(f"Failed to load JSON patterns ({path}): {e}")
# # #         return {}


# # # def load_xlsx_patterns(filename: str = "phrasal_patterns.xlsx") -> Dict[str, str]:
# # #     path = BASE_DIR / filename
# # #     if not path.exists():
# # #         logger.info(f"XLSX patterns file not found at {path}")
# # #         return {}
# # #     if openpyxl is None:
# # #         logger.warning("openpyxl not installed; skipping XLSX patterns")
# # #         return {}
# # #     patterns = {}
# # #     try:
# # #         wb = openpyxl.load_workbook(path, read_only=True)
# # #         sheet = wb.active
# # #         # Expect two columns: original -> replacement. Skip header row if present.
# # #         for i, row in enumerate(sheet.iter_rows(values_only=True), start=1):
# # #             if i == 1:
# # #                 # skip header if header looks like strings "original" / "replacement"
# # #                 header = [str(c).lower() if c else "" for c in row]
# # #                 if "original" in header or "replacement" in header:
# # #                     continue
# # #             if not row:
# # #                 continue
# # #             orig = row[0]
# # #             repl = row[1] if len(row) > 1 else None
# # #             if orig and repl:
# # #                 patterns[str(orig).strip().lower()] = str(repl).strip()
# # #         logger.info(f"Loaded {len(patterns)} XLSX patterns from {path}")
# # #     except Exception as e:
# # #         logger.warning(f"Failed to load XLSX patterns ({path}): {e}")
# # #     return patterns


# # # # ---------------- PlagiarismDetector class ---------------- #
# # # class PlagiarismDetector:
# # #     def __init__(self, anthropic_api_key: str | None = None, ai_detector=None):
# # #         """
# # #         anthropic_api_key: pass in or it will read from ANTHROPIC_API_KEY env var.
# # #         ai_detector: optional object used for AI pattern detection / scoring (safe if None).
# # #         """
# # #         self.ai_detector = ai_detector

# # #         # Load key from env if not passed
# # #         self.api_key = anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")
# # #         self.anthropic_available = bool(self.api_key) and (anthropic is not None)

# # #         # Load rule-based patterns (fallback)
# # #         self.json_patterns = load_json_patterns("ai_patterns.json")
# # #         self.xlsx_patterns = load_xlsx_patterns("phrasal_patterns.xlsx")

# # #         # Initialize Anthropic client if available
# # #         self.client = None
# # #         if self.anthropic_available:
# # #             try:
# # #                 self.client = anthropic.Anthropic(api_key=self.api_key)
# # #                 logger.info("✅ Anthropic client initialized for plagiarism removal")
# # #             except Exception as e:
# # #                 logger.warning(f"⚠️ Could not initialize Anthropic client: {e}")
# # #                 self.client = None
# # #                 self.anthropic_available = False
# # #         else:
# # #             if not self.api_key:
# # #                 logger.info("Anthropic API key not provided; using fallback rewrite patterns")
# # #             else:
# # #                 logger.info("Anthropic client library not installed; using fallback rewrite patterns")

# # #         logger.info("PlagiarismDetector initialized")

# # #     # ---------------- Local similarity checks ---------------- #
# # #     def check_plagiarism_local(self, text1: str, text2: str) -> Tuple[float, dict]:
# # #         """Return score (0-100) and details dict"""
# # #         if not text1 or not text2:
# # #             return 0.0, {"error": "Both texts must be provided"}

# # #         # normalize
# # #         t1 = re.sub(r"[^\w\s]", "", text1.lower())
# # #         t2 = re.sub(r"[^\w\s]", "", text2.lower())

# # #         overall_similarity = SequenceMatcher(None, t1, t2).ratio()

# # #         sentences1 = [s.strip() for s in re.split(r"[.!?]+", text1) if s.strip()]
# # #         sentences2 = [s.strip() for s in re.split(r"[.!?]+", text2) if s.strip()]

# # #         sentence_similarities = []
# # #         for s1 in sentences1:
# # #             max_sim = 0.0
# # #             for s2 in sentences2:
# # #                 sim = SequenceMatcher(None, s1.lower(), s2.lower()).ratio()
# # #                 if sim > max_sim:
# # #                     max_sim = sim
# # #             sentence_similarities.append(max_sim)
# # #         avg_sentence_similarity = sum(sentence_similarities) / len(sentence_similarities) if sentence_similarities else 0.0

# # #         words1 = set(t1.split())
# # #         words2 = set(t2.split())
# # #         word_overlap = len(words1.intersection(words2)) / len(words1.union(words2)) if words1 and words2 else 0.0

# # #         def ngrams(text: str, n: int = 3):
# # #             words = text.split()
# # #             return set(zip(*[words[i:] for i in range(n)])) if len(words) >= n else set()

# # #         ngrams1 = ngrams(t1)
# # #         ngrams2 = ngrams(t2)
# # #         ngram_overlap = len(ngrams1.intersection(ngrams2)) / len(ngrams1.union(ngrams2)) if ngrams1 and ngrams2 else 0.0

# # #         score = (overall_similarity * 0.4 + avg_sentence_similarity * 0.3 + word_overlap * 0.2 + ngram_overlap * 0.1) * 100

# # #         details = {
# # #             "overall_similarity": overall_similarity * 100,
# # #             "sentence_similarity": avg_sentence_similarity * 100,
# # #             "word_overlap": word_overlap * 100,
# # #             "ngram_overlap": ngram_overlap * 100,
# # #             "word_count_1": len(text1.split()),
# # #             "word_count_2": len(text2.split()),
# # #         }
# # #         return score, details

# # #     def get_plagiarism_report(self, text1: str, text2: str) -> Tuple[str, float, str]:
# # #         report, score, status = "", 0.0, "Unknown"
# # #         try:
# # #             score, details = self.check_plagiarism_local(text1, text2)
# # #             # classification
# # #             if score >= 80:
# # #                 classification = "🚨 HIGHLY LIKELY PLAGIARIZED"
# # #                 conf = "Very High"
# # #             elif score >= 60:
# # #                 classification = "⚠️ POSSIBLY PLAGIARIZED"
# # #                 conf = "High"
# # #             elif score >= 40:
# # #                 classification = "🤔 SOME SIMILARITIES DETECTED"
# # #                 conf = "Medium"
# # #             elif score >= 20:
# # #                 classification = "📝 MINOR SIMILARITIES"
# # #                 conf = "Low"
# # #             else:
# # #                 classification = "✅ LIKELY ORIGINAL"
# # #                 conf = "Very Low"

# # #             report = f"{classification}\n\nPlagiarism Score: {score:.1f}% (Confidence: {conf})\n\n"
# # #             report += "**SIMILARITY ANALYSIS**\n"
# # #             report += f"Overall: {details['overall_similarity']:.1f}%\n"
# # #             report += f"Sentence-level: {details['sentence_similarity']:.1f}%\n"
# # #             report += f"Word overlap: {details['word_overlap']:.1f}%\n"
# # #             report += f"Phrase overlap: {details['ngram_overlap']:.1f}%\n"
# # #             status = f"Analysis complete: {classification}"
# # #             return report, score, status
# # #         except Exception as e:
# # #             logger.error(f"Error building plagiarism report: {e}")
# # #             return "Error generating report", 0.0, "Error"

# # #     # ---------------- Anthropic helper (retry) ---------------- #
# # #     def _call_anthropic_with_retry(self, prompt: str, model: str = "claude-3-5-sonnet-latest", max_retries: int = 3) -> str:
# # #         if not self.client:
# # #             raise RuntimeError("Anthropic client not initialized")
# # #         last_exc = None
# # #         for attempt in range(1, max_retries + 1):
# # #             try:
# # #                 resp = self.client.messages.create(
# # #                     model=model,
# # #                     max_tokens=1200,
# # #                     messages=[{"role": "user", "content": prompt}]
# # #                 )
# # #                 # response content access is client dependent; handle safely
# # #                 if hasattr(resp, "content") and resp.content:
# # #                     # many Anthropic clients return list-like content
# # #                     candidate = resp.content[0].text if hasattr(resp.content[0], "text") else str(resp.content[0])
# # #                     return candidate.strip()
# # #                 # fallback to str(resp)
# # #                 return str(resp).strip()
# # #             except Exception as e:
# # #                 last_exc = e
# # #                 s = str(e).lower()
# # #                 if "overloaded" in s or "529" in s:
# # #                     if attempt < max_retries:
# # #                         wait = (2 ** (attempt - 1)) + random.uniform(0, 1)
# # #                         logger.info(f"Anthropic overloaded; retrying in {wait:.1f}s (attempt {attempt})")
# # #                         time.sleep(wait)
# # #                         continue
# # #                     logger.error("Anthropic overloaded and retries exhausted")
# # #                     raise
# # #                 # non-retryable: re-raise
# # #                 logger.warning(f"Anthropic call failed (attempt {attempt}): {e}")
# # #                 raise
# # #         # if loop finishes unexpectedly
# # #         raise last_exc or RuntimeError("Anthropic call failed")

# # #     # ---------------- Rule-based fallback rewrite ---------------- #
# # #     def _apply_rules(self, text: str) -> str:
# # #         new_text = text

# # #         # Apply JSON patterns (word/phrase -> replacement)
# # #         for k, v in self.json_patterns.items():
# # #             # word boundary replace ignoring case
# # #             try:
# # #                 new_text = re.sub(rf"\b{re.escape(k)}\b", v, new_text, flags=re.IGNORECASE)
# # #             except re.error:
# # #                 # skip malformed regex keys
# # #                 new_text = new_text.replace(k, v)

# # #         # Apply XLSX patterns
# # #         for k, v in self.xlsx_patterns.items():
# # #             try:
# # #                 new_text = re.sub(rf"\b{re.escape(k)}\b", v, new_text, flags=re.IGNORECASE)
# # #             except re.error:
# # #                 new_text = new_text.replace(k, v)

# # #         return new_text

# # #     # ---------------- Public remove() ---------------- #
# # #     def remove(self, text: str, rewrite_mode: str = "balanced", reference_text: str = "") -> Tuple[str, Dict]:
# # #         """
# # #         Main entry used by main.py:
# # #         returns (rewritten_text, report_dict)
# # #         report_dict contains metadata: status, counts, scores (if computed), fallback_used bool.
# # #         """
# # #         if not text or not text.strip():
# # #             return text, {"status": "empty_text", "rewritten_text": "", "fallback_used": False}

# # #         report = {
# # #             "status": "unknown",
# # #             "fallback_used": False,
# # #             "original_word_count": len(text.split()),
# # #             "new_word_count": None,
# # #             "original_plagiarism_score": None,
# # #             "new_plagiarism_score": None,
# # #         }

# # #         # Attempt Anthropic first if available
# # #         if self.client:
# # #             try:
# # #                 # build a clear prompt using rewrite_mode and optional reference_text guidance
# # #                 prompt = f"Rewrite the following text to remove plagiarism while preserving the meaning.\nRewrite mode: {rewrite_mode}\n\nText:\n{text}\n\nReturn only the rewritten text, no explanations."
# # #                 if reference_text:
# # #                     prompt += f"\n\nReference (ensure dissimilar to this):\n{reference_text[:1000]}"

# # #                 rewritten = self._call_anthropic_with_retry(prompt)
# # #                 report.update({
# # #                     "status": "anthropic_success",
# # #                     "fallback_used": False,
# # #                     "new_word_count": len(rewritten.split())
# # #                 })

# # #                 # if reference provided, compute simple local plagiarism improvement
# # #                 if reference_text:
# # #                     orig_score, _ = self.check_plagiarism_local(text, reference_text)
# # #                     new_score, _ = self.check_plagiarism_local(rewritten, reference_text)
# # #                     report["original_plagiarism_score"] = orig_score
# # #                     report["new_plagiarism_score"] = new_score

# # #                 return rewritten, report

# # #             except Exception as e:
# # #                 logger.warning(f"Anthropic rewrite failed, falling back to rule-based: {e}")

# # #         # Fallback rewrite (rules)
# # #         try:
# # #             rewritten = self._apply_rules(text)
# # #             report.update({
# # #                 "status": "fallback_success",
# # #                 "fallback_used": True,
# # #                 "new_word_count": len(rewritten.split())
# # #             })

# # #             if reference_text:
# # #                 orig_score, _ = self.check_plagiarism_local(text, reference_text)
# # #                 new_score, _ = self.check_plagiarism_local(rewritten, reference_text)
# # #                 report["original_plagiarism_score"] = orig_score
# # #                 report["new_plagiarism_score"] = new_score

# # #             return rewritten, report

# # #         except Exception as e:
# # #             logger.error(f"Fallback rewrite failed: {e}")
# # #             # As a last resort, return original text with error report
# # #             return text, {"status": "error", "message": str(e), "fallback_used": True}

# # #     # alias for compatibility with older code
# # #     def remove_plagiarism(self, *args, **kwargs):
# # #         return self.remove(*args, **kwargs)

# # #     # ---------------- Helpful utilities ---------------- #
# # #     def find_similar_sentences(self, text1: str, text2: str, threshold: float = 0.7) -> List[dict]:
# # #         sentences1 = [s.strip() for s in re.split(r"[.!?]+", text1) if s.strip()]
# # #         sentences2 = [s.strip() for s in re.split(r"[.!?]+", text2) if s.strip()]
# # #         pairs = []
# # #         for i, s1 in enumerate(sentences1):
# # #             for j, s2 in enumerate(sentences2):
# # #                 sim = SequenceMatcher(None, s1.lower(), s2.lower()).ratio()
# # #                 if sim >= threshold:
# # #                     pairs.append({
# # #                         "text1_sentence": s1,
# # #                         "text2_sentence": s2,
# # #                         "similarity": sim * 100,
# # #                         "text1_position": i,
# # #                         "text2_position": j
# # #                     })
# # #         pairs.sort(key=lambda x: x["similarity"], reverse=True)
# # #         return pairs

# # #     def get_plagiarism_statistics(self, text1: str, text2: str) -> Dict:
# # #         score, details = self.check_plagiarism_local(text1, text2)
# # #         pairs = self.find_similar_sentences(text1, text2)
# # #         return {
# # #             "overall_score": score,
# # #             "details": details,
# # #             "similar_sentences_count": len(pairs),
# # #             "similar_sentences": pairs[:5],
# # #             "total_sentences_text1": len([s for s in re.split(r"[.!?]+", text1) if s.strip()]),
# # #             "total_sentences_text2": len([s for s in re.split(r"[.!?]+", text2) if s.strip()])
# # #         }








# # """
# # Add these endpoints to your main.py FastAPI application
# # Complete plagiarism detection and removal endpoints
# # """

# # from fastapi import FastAPI, HTTPException
# # from pydantic import BaseModel
# # from plagiarism_detector import PlagiarismDetector
# # import os

# # # Initialize plagiarism detector
# # plagiarism_detector = PlagiarismDetector(
# #     anthropic_api_key=os.getenv('ANTHROPIC_API_KEY'),
# #     ai_detector=ai_detector  # Your existing AI detector instance
# # )

# # # ============ REQUEST MODELS ============

# # class SingleTextRequest(BaseModel):
# #     text: str

# # class TwoTextRequest(BaseModel):
# #     text1: str
# #     text2: str

# # class PlagiarismRemovalRequest(BaseModel):
# #     text: str
# #     rewrite_mode: str = "balanced"  # conservative, balanced, aggressive
# #     reference_text: str = ""


# # # ============ DETECTION ENDPOINTS ============

# # @app.post("/detect-plagiarism-patterns")
# # async def detect_plagiarism_patterns(request: SingleTextRequest):
# #     """
# #     Detect plagiarism indicators and patterns in text
    
# #     Returns patterns like:
# #     - Missing citations
# #     - Unmarked quotes
# #     - Copy-paste indicators
# #     - Style inconsistencies
# #     """
# #     try:
# #         if not request.text.strip():
# #             raise HTTPException(status_code=400, detail="Text cannot be empty")
        
# #         patterns = plagiarism_detector.detect_plagiarism_patterns(request.text)
# #         pattern_count = sum(len(matches) for matches in patterns.values())
        
# #         return {
# #             "patterns_detected": patterns,
# #             "total_patterns": pattern_count,
# #             "categories": list(patterns.keys()),
# #             "has_plagiarism_indicators": pattern_count > 0
# #         }
        
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))


# # @app.post("/calculate-plagiarism-risk")
# # async def calculate_plagiarism_risk(request: TwoTextRequest):
# #     """
# #     Calculate plagiarism risk score (0-100) with detailed analysis
    
# #     Analyzes:
# #     - Pattern indicators
# #     - Common phrase overuse
# #     - Similarity to reference text
# #     - Writing style consistency
# #     """
# #     try:
# #         text = request.text1
# #         reference = request.text2 if request.text2.strip() else ""
        
# #         if not text.strip():
# #             raise HTTPException(status_code=400, detail="Text cannot be empty")
        
# #         risk_score, details = plagiarism_detector.calculate_plagiarism_risk(text, reference)
        
# #         return {
# #             "risk_score": risk_score,
# #             "risk_level": details["risk_level"],
# #             "risk_factors": details["risk_factors"],
# #             "detected_patterns": details["detected_patterns"],
# #             "recommendation": _get_recommendation(risk_score)
# #         }
        
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))


# # @app.post("/plagiarism-detection-report")
# # async def get_plagiarism_detection_report(request: TwoTextRequest):
# #     """
# #     Generate comprehensive plagiarism detection report
    
# #     Provides:
# #     - Risk assessment
# #     - Pattern detection
# #     - Recommendations
# #     """
# #     try:
# #         text = request.text1
# #         reference = request.text2 if request.text2.strip() else ""
        
# #         if not text.strip():
# #             raise HTTPException(status_code=400, detail="Text cannot be empty")
        
# #         report, risk_score, details = plagiarism_detector.get_detection_report(text, reference)
        
# #         return {
# #             "report": report,
# #             "risk_score": risk_score,
# #             "risk_level": details["risk_level"],
# #             "detected_patterns": details["detected_patterns"],
# #             "risk_factors": details["risk_factors"]
# #         }
        
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))


# # # ============ COMPARISON ENDPOINTS ============

# # @app.post("/check-plagiarism")
# # async def check_plagiarism(request: TwoTextRequest):
# #     """
# #     Compare two texts for similarity (0-100%)
    
# #     Returns:
# #     - Similarity score
# #     - Detailed metrics
# #     - Classification
# #     """
# #     try:
# #         if not request.text1.strip() or not request.text2.strip():
# #             raise HTTPException(status_code=400, detail="Both texts are required")
        
# #         report, score, status = plagiarism_detector.get_plagiarism_report(
# #             request.text1,
# #             request.text2
# #         )
        
# #         return {
# #             "report": report,
# #             "similarity_score": score,
# #             "status": status,
# #             "classification": _get_classification(score)
# #         }
        
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))


# # @app.post("/plagiarism-statistics")
# # async def get_plagiarism_statistics(request: TwoTextRequest):
# #     """
# #     Get detailed plagiarism statistics between two texts
    
# #     Includes:
# #     - Overall similarity
# #     - Sentence-by-sentence analysis
# #     - Similar sentence pairs
# #     """
# #     try:
# #         if not request.text1.strip() or not request.text2.strip():
# #             raise HTTPException(status_code=400, detail="Both texts are required")
        
# #         stats = plagiarism_detector.get_plagiarism_statistics(
# #             request.text1,
# #             request.text2
# #         )
        
# #         return stats
        
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))


# # @app.post("/find-similar-sentences")
# # async def find_similar_sentences(request: TwoTextRequest):
# #     """
# #     Find sentences with high similarity between two texts
    
# #     Returns matching sentence pairs with similarity scores
# #     """
# #     try:
# #         if not request.text1.strip() or not request.text2.strip():
# #             raise HTTPException(status_code=400, detail="Both texts are required")
        
# #         similar = plagiarism_detector.find_similar_sentences(
# #             request.text1,
# #             request.text2,
# #             threshold=0.7
# #         )
        
# #         return {
# #             "similar_sentences": similar,
# #             "count": len(similar),
# #             "has_matches": len(similar) > 0
# #         }
        
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))


# # # ============ REMOVAL ENDPOINTS ============

# # @app.post("/remove-plagiarism")
# # async def remove_plagiarism(request: PlagiarismRemovalRequest):
# #     """
# #     Remove plagiarism by rewriting text
    
# #     Modes:
# #     - conservative: Light paraphrasing
# #     - balanced: Moderate restructuring (default)
# #     - aggressive: Complete rewrite
# #     """
# #     try:
# #         if not request.text.strip():
# #             raise HTTPException(status_code=400, detail="Text cannot be empty")
        
# #         if request.rewrite_mode not in ["conservative", "balanced", "aggressive"]:
# #             raise HTTPException(
# #                 status_code=400, 
# #                 detail="Invalid mode. Use: conservative, balanced, or aggressive"
# #             )
        
# #         rewritten, report = plagiarism_detector.remove(
# #             text=request.text,
# #             rewrite_mode=request.rewrite_mode,
# #             reference_text=request.reference_text
# #         )
        
# #         return {
# #             "success": True,
# #             "rewritten_text": rewritten,
# #             "status": report.get("status"),
# #             "fallback_used": report.get("fallback_used", False),
# #             "metrics": {
# #                 "original_word_count": report.get("original_word_count"),
# #                 "new_word_count": report.get("new_word_count"),
# #                 "original_plagiarism_score": report.get("original_plagiarism_score"),
# #                 "new_plagiarism_score": report.get("new_plagiarism_score"),
# #                 "improvement": (
# #                     report.get("original_plagiarism_score", 0) - 
# #                     report.get("new_plagiarism_score", 0)
# #                 ) if report.get("original_plagiarism_score") else 0
# #             },
# #             "rewrite_mode": request.rewrite_mode
# #         }
        
# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))


# # # ============ INFO ENDPOINTS ============

# # @app.get("/plagiarism-modes")
# # async def get_plagiarism_modes():
# #     """Get available rewrite modes for plagiarism removal"""
# #     return {
# #         "modes": [
# #             {
# #                 "name": "conservative",
# #                 "description": "Light paraphrasing while maintaining original structure",
# #                 "use_case": "Minimal changes, preserves original style",
# #                 "change_level": "Low"
# #             },
# #             {
# #                 "name": "balanced",
# #                 "description": "Moderate restructuring with synonym replacement",
# #                 "use_case": "Best for most situations - balanced approach",
# #                 "change_level": "Medium"
# #             },
# #             {
# #                 "name": "aggressive",
# #                 "description": "Complete restructuring with new writing style",
# #                 "use_case": "Maximum difference from original",
# #                 "change_level": "High"
# #             }
# #         ]
# #     }


# # @app.get("/plagiarism-risk-levels")
# # async def get_risk_levels():
# #     """Get plagiarism risk level thresholds"""
# #     return {
# #         "levels": [
# #             {"level": "MINIMAL", "range": "0-20%", "color": "green"},
# #             {"level": "LOW", "range": "20-40%", "color": "yellow"},
# #             {"level": "MEDIUM", "range": "40-60%", "color": "orange"},
# #             {"level": "HIGH", "range": "60-80%", "color": "red"},
# #             {"level": "CRITICAL", "range": "80-100%", "color": "darkred"}
# #         ]
# #     }


# # # ============ HELPER FUNCTIONS ============

# # def _get_classification(score: float) -> str:
# #     """Get classification from similarity score"""
# #     if score >= 80:
# #         return "highly_similar"
# #     elif score >= 60:
# #         return "possibly_plagiarized"
# #     elif score >= 40:
# #         return "some_similarities"
# #     elif score >= 20:
# #         return "minor_similarities"
# #     else:
# #         return "likely_original"


# # def _get_recommendation(risk_score: float) -> str:
# #     """Get recommendation based on risk score"""
# #     if risk_score >= 80:
# #         return "CRITICAL: Immediate review required. Add citations and rewrite similar sections."
# #     elif risk_score >= 60:
# #         return "HIGH: Review all sources and verify proper attribution."
# #     elif risk_score >= 40:
# #         return "MEDIUM: Check detected patterns and ensure proper citations."
# #     elif risk_score >= 20:
# #         return "LOW: Minor concerns. Review citation practices."
# #     else:
# #         return "MINIMAL: Content appears original. Maintain good practices."


# # # ============ UPDATE ROOT ENDPOINT ============

# # @app.get("/")
# # async def root():
# #     """Root endpoint showing API status"""
# #     return {
# #         "message": "AI Text Detector & Humanizer API",
# #         "status": "running",
# #         "version": "5.0.0",
# #         "modules_loaded": True,
# #         "api_key_available": bool(os.getenv('ANTHROPIC_API_KEY')),
# #         "powered_by": "Claude AI with Smart Error Handling",
# #         "endpoints": {
# #             "core": [
# #                 "/analyze",
# #                 "/humanize"
# #             ],
# #             "plagiarism_detection": [
# #                 "/detect-plagiarism-patterns",
# #                 "/calculate-plagiarism-risk",
# #                 "/plagiarism-detection-report"
# #             ],
# #             "plagiarism_comparison": [
# #                 "/check-plagiarism",
# #                 "/plagiarism-statistics",
# #                 "/find-similar-sentences"
# #             ],
# #             "plagiarism_removal": [
# #                 "/remove-plagiarism",
# #                 "/plagiarism-modes"
# #             ],
# #             "advanced": [
# #                 "/change-tone",
# #                 "/summarize"
# #             ],
# #             "info": [
# #                 "/tone-modes",
# #                 "/summary-options",
# #                 "/plagiarism-risk-levels",
# #                 "/health",
# #                 "/api-status"
# #             ]
# #         }
# #     }

# import os
# import logging
# from typing import Dict, Any, List, Tuple
# import difflib
# import re

# # Configure logging
# logger = logging.getLogger(__name__)

# class PlagiarismDetector:
#     def __init__(self, anthropic_api_key: str = None, ai_detector=None):
#         self.api_key = anthropic_api_key
#         self.ai_detector = ai_detector
#         self.client = None
        
#         if self.api_key:
#             try:
#                 import anthropic
#                 # Clean init without proxies
#                 self.client = anthropic.Anthropic(api_key=self.api_key)
#             except ImportError:
#                 logger.warning("Anthropic library not installed. AI features disabled.")

#     def detect_plagiarism_patterns(self, text: str) -> Dict[str, Any]:
#         """Detect patterns often associated with plagiarism (citations, mixed styles)"""
#         if not text:
#             return {}

#         # Basic pattern matching (simulated logic for speed/fallback)
#         patterns = {
#             "missing_citations": [],
#             "style_inconsistencies": [],
#             "academic_phrases": []
#         }
        
#         # Regex to find quotes without citations
#         uncited_quotes = re.findall(r'"([^"]*)"(?!\s*[\(\[])', text)
#         if uncited_quotes:
#             patterns["missing_citations"] = uncited_quotes[:5] # Limit to 5

#         return patterns

#     def calculate_plagiarism_risk(self, text: str, reference_text: str = "") -> Tuple[float, Dict[str, Any]]:
#         """Calculate risk score based on text analysis"""
#         risk_score = 0.0
#         risk_factors = []
        
#         # 1. Check similarity to reference if provided
#         if reference_text:
#             similarity = difflib.SequenceMatcher(None, text, reference_text).ratio() * 100
#             if similarity > 20:
#                 risk_score += similarity
#                 risk_factors.append(f"High similarity to reference text ({similarity:.1f}%)")
        
#         # 2. Check for AI patterns if detector is available
#         if self.ai_detector:
#             try:
#                 _, ai_score, _ = self.ai_detector.get_detection_report(text)
#                 if ai_score > 70:
#                     risk_score += 20
#                     risk_factors.append("High AI-generation probability often flags as plagiarism")
#             except Exception:
#                 pass

#         # Cap score at 100
#         risk_score = min(100.0, risk_score)
        
#         level = "MINIMAL"
#         if risk_score > 80: level = "CRITICAL"
#         elif risk_score > 60: level = "HIGH"
#         elif risk_score > 40: level = "MEDIUM"
#         elif risk_score > 20: level = "LOW"

#         return risk_score, {
#             "risk_level": level,
#             "risk_factors": risk_factors,
#             "detected_patterns": self.detect_plagiarism_patterns(text)
#         }

#     def get_detection_report(self, text: str, reference: str = ""):
#         score, details = self.calculate_plagiarism_risk(text, reference)
#         report = f"Plagiarism Risk Level: {details['risk_level']}. "
#         if details['risk_factors']:
#             report += "Factors: " + ", ".join(details['risk_factors'])
#         return report, score, details

#     def get_plagiarism_report(self, text1: str, text2: str):
#         """Compare two texts and return a full report"""
#         score = difflib.SequenceMatcher(None, text1, text2).ratio() * 100
        
#         status = "Completed"
#         if score > 80: classification = "Highly Similar"
#         elif score > 50: classification = "Moderately Similar"
#         else: classification = "Original / Different"
        
#         report = f"Comparison complete. Similarity Score: {score:.2f}%. Classification: {classification}"
        
#         return report, score, classification

#     def get_plagiarism_statistics(self, text1: str, text2: str):
#         matcher = difflib.SequenceMatcher(None, text1, text2)
#         return {
#             "similarity_ratio": matcher.ratio(),
#             "matching_blocks": len(matcher.get_matching_blocks()),
#             "text1_length": len(text1),
#             "text2_length": len(text2)
#         }

#     def find_similar_sentences(self, text1: str, text2: str, threshold: float = 0.7):
#         """Find similar sentences between two texts"""
#         sentences1 = [s.strip() for s in text1.split('.') if s.strip()]
#         sentences2 = [s.strip() for s in text2.split('.') if s.strip()]
        
#         matches = []
#         for s1 in sentences1:
#             for s2 in sentences2:
#                 sim = difflib.SequenceMatcher(None, s1, s2).ratio()
#                 if sim >= threshold:
#                     matches.append({
#                         "source": s1,
#                         "match": s2,
#                         "similarity": sim
#                     })
#         return matches

#     def remove(self, text: str, rewrite_mode: str = "balanced", reference_text: str = ""):
#         """
#         Rewrites text to remove plagiarism. 
#         Uses Claude API if available, otherwise simple synonym replacement.
#         """
#         if self.client:
#             try:
#                 prompt = f"Rewrite the following text to remove plagiarism. Mode: {rewrite_mode}. Maintain original meaning but change structure and vocabulary.\n\nText: {text}"
                
#                 message = self.client.messages.create(
#                     # UPDATED: Using the newer Claude 3.5 Sonnet model
#                     model="claude-3-5-sonnet-20241022",
#                     max_tokens=1024,
#                     messages=[{"role": "user", "content": prompt}]
#                 )
#                 rewritten = message.content[0].text
                
#                 return rewritten, {
#                     "status": "Rewritten by Claude API",
#                     "original_plagiarism_score": 80, # Mock pre-score
#                     "new_plagiarism_score": 10,      # Mock post-score
#                     "improvement": 70
#                 }
#             except Exception as e:
#                 logger.error(f"Claude API failed: {e}")
        
#         # Fallback if API fails or not present
#         return text, {"status": "API Unavailable - Text Unchanged", "fallback_used": True}







import os
import logging
from typing import Dict, Any, List, Tuple, Optional
import difflib
import re
from collections import Counter
import math

# Configure logging
logger = logging.getLogger(__name__)

class PlagiarismDetector:
    def __init__(self, anthropic_api_key: str = None, ai_detector=None):
        self.api_key = anthropic_api_key
        self.ai_detector = ai_detector
        self.client = None
        
        if self.api_key:
            try:
                import anthropic
                self.client = anthropic.Anthropic(api_key=self.api_key)
            except ImportError:
                logger.warning("Anthropic library not installed. AI features disabled.")

    def preprocess_text(self, text: str) -> str:
        """Clean and normalize text for better comparison"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s.,!?;:\'"()-]', '', text)
        return text.strip()

    def extract_sentences(self, text: str) -> List[str]:
        """Extract sentences using improved regex"""
        # Split on sentence boundaries
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if len(s.strip()) > 10]

    def extract_ngrams(self, text: str, n: int = 3) -> List[str]:
        """Extract n-grams for more granular comparison"""
        words = text.lower().split()
        ngrams = []
        for i in range(len(words) - n + 1):
            ngrams.append(' '.join(words[i:i+n]))
        return ngrams

    def calculate_cosine_similarity(self, text1: str, text2: str) -> float:
        """Calculate cosine similarity between two texts"""
        words1 = text1.lower().split()
        words2 = text2.lower().split()
        
        # Create word frequency vectors
        counter1 = Counter(words1)
        counter2 = Counter(words2)
        
        # Get all unique words
        all_words = set(counter1.keys()) | set(counter2.keys())
        
        # Calculate dot product and magnitudes
        dot_product = sum(counter1[word] * counter2[word] for word in all_words)
        magnitude1 = math.sqrt(sum(count ** 2 for count in counter1.values()))
        magnitude2 = math.sqrt(sum(count ** 2 for count in counter2.values()))
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)

    def detect_plagiarism_patterns(self, text: str) -> Dict[str, Any]:
        """Enhanced pattern detection for plagiarism indicators"""
        if not text:
            return {}

        patterns = {
            "missing_citations": [],
            "style_inconsistencies": [],
            "academic_phrases": [],
            "suspicious_patterns": [],
            "quoted_text_without_attribution": []
        }
        
        # 1. Find quotes without citations
        quote_pattern = r'"([^"]{20,})"(?!\s*[\(\[\d])'
        uncited_quotes = re.findall(quote_pattern, text)
        patterns["missing_citations"] = uncited_quotes[:10]
        
        # 2. Detect academic/formal phrases that might indicate copied text
        academic_phrases = [
            r'\baccording to\b',
            r'\bit has been shown that\b',
            r'\bstudies have shown\b',
            r'\bresearch indicates\b',
            r'\bin conclusion\b',
            r'\bfurthermore\b',
            r'\bnevertheless\b'
        ]
        
        for phrase_pattern in academic_phrases:
            matches = re.findall(phrase_pattern, text, re.IGNORECASE)
            if matches:
                patterns["academic_phrases"].extend(matches)
        
        # 3. Detect style inconsistencies (mixing formal/informal language)
        sentences = self.extract_sentences(text)
        if len(sentences) > 3:
            formal_indicators = sum(1 for s in sentences if any(
                word in s.lower() for word in ['furthermore', 'moreover', 'thus', 'hence', 'whereby']
            ))
            informal_indicators = sum(1 for s in sentences if any(
                word in s.lower() for word in ['gonna', 'wanna', 'yeah', 'ok', 'cool']
            ))
            
            if formal_indicators > 0 and informal_indicators > 0:
                patterns["style_inconsistencies"].append("Mixed formal and informal language detected")
        
        # 4. Detect unusual citation patterns
        citation_pattern = r'\([A-Z][a-z]+,?\s+\d{4}\)'
        citations = re.findall(citation_pattern, text)
        if len(citations) > 0:
            patterns["suspicious_patterns"].append(f"Found {len(citations)} citations - verify authenticity")
        
        # 5. Detect paraphrasing markers (might indicate attempt to hide plagiarism)
        paraphrase_markers = re.findall(r'\b(in other words|that is to say|i\.e\.|to put it differently)\b', text, re.IGNORECASE)
        if len(paraphrase_markers) > 3:
            patterns["suspicious_patterns"].append("Excessive paraphrasing markers detected")
        
        return patterns

    def calculate_sequence_similarity(self, text1: str, text2: str) -> Dict[str, float]:
        """Calculate multiple similarity metrics"""
        # Clean texts
        clean_text1 = self.preprocess_text(text1)
        clean_text2 = self.preprocess_text(text2)
        
        # 1. Basic sequence matching
        sequence_ratio = difflib.SequenceMatcher(None, clean_text1, clean_text2).ratio()
        
        # 2. Cosine similarity
        cosine_sim = self.calculate_cosine_similarity(clean_text1, clean_text2)
        
        # 3. N-gram overlap
        ngrams1 = set(self.extract_ngrams(clean_text1, 3))
        ngrams2 = set(self.extract_ngrams(clean_text2, 3))
        
        if len(ngrams1) == 0 or len(ngrams2) == 0:
            ngram_overlap = 0.0
        else:
            intersection = len(ngrams1 & ngrams2)
            union = len(ngrams1 | ngrams2)
            ngram_overlap = intersection / union if union > 0 else 0.0
        
        # 4. Sentence-level similarity
        sentences1 = self.extract_sentences(clean_text1)
        sentences2 = self.extract_sentences(clean_text2)
        
        sentence_similarities = []
        for s1 in sentences1:
            max_sim = 0
            for s2 in sentences2:
                sim = difflib.SequenceMatcher(None, s1, s2).ratio()
                max_sim = max(max_sim, sim)
            if max_sim > 0.5:  # Only count significant matches
                sentence_similarities.append(max_sim)
        
        avg_sentence_sim = sum(sentence_similarities) / len(sentences1) if sentences1 else 0.0
        
        return {
            "sequence_ratio": sequence_ratio,
            "cosine_similarity": cosine_sim,
            "ngram_overlap": ngram_overlap,
            "sentence_similarity": avg_sentence_sim,
            "overall_similarity": (sequence_ratio * 0.3 + cosine_sim * 0.3 + 
                                 ngram_overlap * 0.2 + avg_sentence_sim * 0.2)
        }

    
    # def calculate_plagiarism_risk(self, text: str, reference_text: str = "") -> Tuple[float, Dict[str, Any]]:
    #     """Enhanced risk calculation with multiple factors"""
    #     risk_score = 0.0
    #     risk_factors = []
    #     weights = {}
        
    #     # 1. Check similarity to reference if provided
    #     if reference_text and len(reference_text) > 50:
    #         similarity_metrics = self.calculate_sequence_similarity(text, reference_text)
            
    #         overall_sim = similarity_metrics["overall_similarity"] * 100
            
    #         if overall_sim > 80:
    #             risk_score += 50
    #             risk_factors.append(f"Very high similarity to reference ({overall_sim:.1f}%)")
    #             weights["reference_similarity"] = 50
    #         elif overall_sim > 60:
    #             risk_score += 35
    #             risk_factors.append(f"High similarity to reference ({overall_sim:.1f}%)")
    #             weights["reference_similarity"] = 35
    #         elif overall_sim > 40:
    #             risk_score += 20
    #             risk_factors.append(f"Moderate similarity to reference ({overall_sim:.1f}%)")
    #             weights["reference_similarity"] = 20
    #         elif overall_sim > 20:
    #             risk_score += 10
    #             risk_factors.append(f"Low similarity to reference ({overall_sim:.1f}%)")
    #             weights["reference_similarity"] = 10
            
    #         # Additional detail on specific metrics
    #         if similarity_metrics["ngram_overlap"] > 0.5:
    #             risk_score += 15
    #             risk_factors.append(f"High phrase overlap detected ({similarity_metrics['ngram_overlap']:.2f})")
    #             weights["ngram_overlap"] = 15
        
    #     # 2. Check for AI patterns if detector is available
    #     if self.ai_detector:
    #         try:
    #             _, ai_score, _ = self.ai_detector.get_detection_report(text)
    #             if ai_score > 80:
    #                 risk_score += 25
    #                 risk_factors.append(f"Very high AI-generation probability ({ai_score:.1f}%)")
    #                 weights["ai_detection"] = 25
    #             elif ai_score > 60:
    #                 risk_score += 15
    #                 risk_factors.append(f"High AI-generation probability ({ai_score:.1f}%)")
    #                 weights["ai_detection"] = 15
    #         except Exception as e:
    #             logger.debug(f"AI detection failed: {e}")
        
    #     # 3. Pattern-based risk factors
    #     patterns = self.detect_plagiarism_patterns(text)
        
    #     if len(patterns.get("missing_citations", [])) > 0:
    #         citation_risk = min(15, len(patterns["missing_citations"]) * 3)
    #         risk_score += citation_risk
    #         risk_factors.append(f"{len(patterns['missing_citations'])} uncited quotes found")
    #         weights["missing_citations"] = citation_risk
        
    #     if len(patterns.get("style_inconsistencies", [])) > 0:
    #         risk_score += 10
    #         risk_factors.append("Style inconsistencies detected")
    #         weights["style_inconsistencies"] = 10
        
    #     if len(patterns.get("academic_phrases", [])) > 5:
    #         risk_score += 8
    #         risk_factors.append(f"Heavy use of academic phrases ({len(patterns['academic_phrases'])})")
    #         weights["academic_phrases"] = 8
        
    #     # 4. Structural analysis
    #     sentences = self.extract_sentences(text)
    #     if len(sentences) > 5:
    #         # Check for unusual sentence length variance
    #         lengths = [len(s.split()) for s in sentences]
    #         avg_length = sum(lengths) / len(lengths)
    #         variance = sum((l - avg_length) ** 2 for l in lengths) / len(lengths)
            
    #         if variance > 200:  # High variance might indicate patchwork plagiarism
    #             risk_score += 5
    #             risk_factors.append("Unusual sentence length variation detected")
    #             weights["sentence_variance"] = 5
        
    #     # Cap score at 100
    #     risk_score = min(100.0, risk_score)
        
    #     # Determine risk level
    #     if risk_score > 80: 
    #         level = "CRITICAL"
    #         recommendation = "Significant plagiarism detected. Extensive rewriting required."
    #     elif risk_score > 60: 
    #         level = "HIGH"
    #         recommendation = "High plagiarism risk. Major revisions needed."
    #     elif risk_score > 40: 
    #         level = "MEDIUM"
    #         recommendation = "Moderate plagiarism concerns. Review and revise flagged sections."
    #     elif risk_score > 20: 
    #         level = "LOW"
    #         recommendation = "Minor similarity detected. Consider adding citations."
    #     else: 
    #         level = "MINIMAL"
    #         recommendation = "Text appears original."

    #     return risk_score, {
    #         "risk_level": level,
    #         "risk_factors": risk_factors,
    #         "detected_patterns": patterns,
    #         "recommendation": recommendation,
    #         "weight_breakdown": weights,
    #         "similarity_metrics": self.calculate_sequence_similarity(text, reference_text) if reference_text else {}
    #     }
    def calculate_plagiarism_risk(self, text: str, reference_text: str = "") -> Tuple[float, Dict[str, Any]]:
    """
    Fixed plagiarism risk calculation
    - Removes bucket locking (75% bug)
    - Uses continuous similarity scoring
    - Separates AI probability from plagiarism
    """

    risk_score = 0.0
    risk_factors = []
    weights = {}

    # --------------------------------------------------
    # 1. CONTINUOUS REFERENCE SIMILARITY (MAX 60)
    # --------------------------------------------------
    similarity_metrics = {}

    if reference_text and len(reference_text) > 50:
        similarity_metrics = self.calculate_sequence_similarity(text, reference_text)
        overall_sim = similarity_metrics["overall_similarity"] * 100

        similarity_risk = overall_sim * 0.6   # max 60
        risk_score += similarity_risk

        risk_factors.append(f"Similarity to reference text: {overall_sim:.1f}%")
        weights["reference_similarity"] = round(similarity_risk, 2)

        # Phrase overlap penalty (only if very high)
        if similarity_metrics["ngram_overlap"] > 0.6:
            risk_score += 8
            weights["ngram_overlap"] = 8
            risk_factors.append(
                f"High phrase overlap detected ({similarity_metrics['ngram_overlap']:.2f})"
            )

    # --------------------------------------------------
    # 2. AI PROBABILITY (INFO ONLY — NOT PLAGIARISM)
    # --------------------------------------------------
    ai_probability = None
    if self.ai_detector:
        try:
            _, ai_score, _ = self.ai_detector.get_detection_report(text)
            ai_probability = round(ai_score, 2)
        except Exception:
            pass

    # --------------------------------------------------
    # 3. PATTERN-BASED RISK (MAX ~25)
    # --------------------------------------------------
    patterns = self.detect_plagiarism_patterns(text)

    if patterns.get("missing_citations"):
        citation_risk = min(10, len(patterns["missing_citations"]) * 2)
        risk_score += citation_risk
        weights["missing_citations"] = citation_risk
        risk_factors.append(
            f"{len(patterns['missing_citations'])} uncited quotes found"
        )

    if patterns.get("style_inconsistencies"):
        risk_score += 5
        weights["style_inconsistencies"] = 5
        risk_factors.append("Style inconsistencies detected")

    if len(patterns.get("academic_phrases", [])) > 6:
        risk_score += 4
        weights["academic_phrases"] = 4
        risk_factors.append(
            f"Heavy use of academic phrases ({len(patterns['academic_phrases'])})"
        )

    # --------------------------------------------------
    # 4. STRUCTURAL ANALYSIS (MAX 5)
    # --------------------------------------------------
    sentences = self.extract_sentences(text)
    if len(sentences) > 5:
        lengths = [len(s.split()) for s in sentences]
        avg_len = sum(lengths) / len(lengths)
        variance = sum((l - avg_len) ** 2 for l in lengths) / len(lengths)

        if variance > 200:
            risk_score += 5
            weights["sentence_variance"] = 5
            risk_factors.append("Unusual sentence length variation detected")

    # --------------------------------------------------
    # 5. FINALIZE SCORE
    # --------------------------------------------------
    risk_score = min(100.0, round(risk_score, 2))

    if risk_score > 80:
        level = "CRITICAL"
        recommendation = "Significant plagiarism detected. Extensive rewriting required."
    elif risk_score > 60:
        level = "HIGH"
        recommendation = "High plagiarism risk. Major revisions needed."
    elif risk_score > 40:
        level = "MEDIUM"
        recommendation = "Moderate plagiarism concerns. Review and revise flagged sections."
    elif risk_score > 20:
        level = "LOW"
        recommendation = "Minor similarity detected. Consider adding citations."
    else:
        level = "MINIMAL"
        recommendation = "Text appears original."

    return risk_score, {
        "risk_level": level,
        "risk_factors": risk_factors,
        "detected_patterns": patterns,
        "recommendation": recommendation,
        "weight_breakdown": weights,
        "similarity_metrics": similarity_metrics,
        "ai_probability": ai_probability
    }
    
    def get_detection_report(self, text: str, reference: str = "") -> Tuple[str, float, Dict[str, Any]]:
        """Generate a comprehensive detection report"""
        score, details = self.calculate_plagiarism_risk(text, reference)
        
        report_lines = [
            f"═══ PLAGIARISM DETECTION REPORT ═══",
            f"Risk Level: {details['risk_level']} ({score:.1f}/100)",
            f"",
            f"Recommendation: {details['recommendation']}",
            f""
        ]
        
        if details['risk_factors']:
            report_lines.append("Risk Factors:")
            for i, factor in enumerate(details['risk_factors'], 1):
                report_lines.append(f"  {i}. {factor}")
            report_lines.append("")
        
        if details.get('weight_breakdown'):
            report_lines.append("Score Breakdown:")
            for category, weight in details['weight_breakdown'].items():
                report_lines.append(f"  • {category.replace('_', ' ').title()}: +{weight} points")
            report_lines.append("")
        
        patterns = details['detected_patterns']
        if any(patterns.values()):
            report_lines.append("Detected Patterns:")
            if patterns.get('missing_citations'):
                report_lines.append(f"  • Uncited Quotes: {len(patterns['missing_citations'])}")
            if patterns.get('style_inconsistencies'):
                report_lines.append(f"  • Style Issues: {len(patterns['style_inconsistencies'])}")
            if patterns.get('academic_phrases'):
                report_lines.append(f"  • Academic Phrases: {len(patterns['academic_phrases'])}")
            if patterns.get('suspicious_patterns'):
                for pattern in patterns['suspicious_patterns']:
                    report_lines.append(f"  • {pattern}")
        
        report = "\n".join(report_lines)
        return report, score, details

    def get_plagiarism_report(self, text1: str, text2: str) -> Tuple[str, float, str]:
        """Compare two texts and return a comprehensive report"""
        similarity_metrics = self.calculate_sequence_similarity(text1, text2)
        score = similarity_metrics["overall_similarity"] * 100
        
        # Classification
        if score > 85: 
            classification = "Nearly Identical"
        elif score > 70: 
            classification = "Highly Similar"
        elif score > 50: 
            classification = "Moderately Similar"
        elif score > 30: 
            classification = "Somewhat Similar"
        else: 
            classification = "Original / Different"
        
        # Build detailed report
        report_lines = [
            f"═══ TEXT COMPARISON REPORT ═══",
            f"Overall Similarity: {score:.2f}%",
            f"Classification: {classification}",
            f"",
            f"Detailed Metrics:",
            f"  • Sequence Match: {similarity_metrics['sequence_ratio']*100:.1f}%",
            f"  • Cosine Similarity: {similarity_metrics['cosine_similarity']*100:.1f}%",
            f"  • N-gram Overlap: {similarity_metrics['ngram_overlap']*100:.1f}%",
            f"  • Sentence Similarity: {similarity_metrics['sentence_similarity']*100:.1f}%"
        ]
        
        report = "\n".join(report_lines)
        return report, score, classification

    def get_plagiarism_statistics(self, text1: str, text2: str) -> Dict[str, Any]:
        """Get detailed statistics about text comparison"""
        matcher = difflib.SequenceMatcher(None, text1, text2)
        similarity_metrics = self.calculate_sequence_similarity(text1, text2)
        
        matching_blocks = matcher.get_matching_blocks()
        # Calculate total matching characters
        total_match_length = sum(block.size for block in matching_blocks)
        
        return {
            "similarity_ratio": matcher.ratio(),
            "overall_similarity": similarity_metrics["overall_similarity"],
            "cosine_similarity": similarity_metrics["cosine_similarity"],
            "ngram_overlap": similarity_metrics["ngram_overlap"],
            "sentence_similarity": similarity_metrics["sentence_similarity"],
            "matching_blocks": len(matching_blocks),
            "total_matching_chars": total_match_length,
            "text1_length": len(text1),
            "text2_length": len(text2),
            "text1_word_count": len(text1.split()),
            "text2_word_count": len(text2.split()),
            "text1_sentence_count": len(self.extract_sentences(text1)),
            "text2_sentence_count": len(self.extract_sentences(text2))
        }

    def find_similar_sentences(self, text1: str, text2: str, threshold: float = 0.7) -> List[Dict[str, Any]]:
        """Find similar sentences between two texts with improved matching"""
        sentences1 = self.extract_sentences(text1)
        sentences2 = self.extract_sentences(text2)
        
        matches = []
        for i, s1 in enumerate(sentences1):
            for j, s2 in enumerate(sentences2):
                # Use multiple similarity measures
                seq_sim = difflib.SequenceMatcher(None, s1.lower(), s2.lower()).ratio()
                cos_sim = self.calculate_cosine_similarity(s1, s2)
                
                # Combined similarity
                combined_sim = (seq_sim * 0.6 + cos_sim * 0.4)
                
                if combined_sim >= threshold:
                    matches.append({
                        "source": s1,
                        "match": s2,
                        "similarity": combined_sim,
                        "sequence_similarity": seq_sim,
                        "cosine_similarity": cos_sim,
                        "source_index": i,
                        "match_index": j
                    })
        
        # Sort by similarity (highest first)
        matches.sort(key=lambda x: x["similarity"], reverse=True)
        return matches

    def find_matching_phrases(self, text1: str, text2: str, min_length: int = 5) -> List[Dict[str, Any]]:
        """Find matching phrases of at least min_length words"""
        words1 = self.preprocess_text(text1).lower().split()
        words2 = self.preprocess_text(text2).lower().split()
        
        matcher = difflib.SequenceMatcher(None, words1, words2)
        matching_blocks = matcher.get_matching_blocks()
        
        matches = []
        for block in matching_blocks:
            if block.size >= min_length:
                phrase1 = ' '.join(words1[block.a:block.a + block.size])
                phrase2 = ' '.join(words2[block.b:block.b + block.size])
                matches.append({
                    "phrase": phrase1,
                    "length": block.size,
                    "text1_position": block.a,
                    "text2_position": block.b
                })
        
        # Sort by length (longest first)
        matches.sort(key=lambda x: x["length"], reverse=True)
        return matches

    def remove(self, text: str, rewrite_mode: str = "balanced", reference_text: str = "") -> Tuple[str, Dict[str, Any]]:
        """
        Rewrites text to remove plagiarism with improved prompting
        """
        if self.client:
            try:
                # Calculate initial plagiarism score
                initial_score, initial_details = self.calculate_plagiarism_risk(text, reference_text)
                
                # Construct a detailed prompt based on mode
                mode_instructions = {
                    "conservative": "Make minimal changes while removing plagiarism. Keep technical terms and proper nouns.",
                    "balanced": "Rewrite to remove plagiarism while maintaining clarity. Change sentence structure and use synonyms appropriately.",
                    "aggressive": "Completely rewrite the text with new sentence structures and vocabulary. Ensure maximum originality while preserving all key information."
                }
                
                instruction = mode_instructions.get(rewrite_mode, mode_instructions["balanced"])
                
                prompt = f"""{instruction}

Original Text:
{text}

Requirements:
1. Preserve all factual information and key concepts
2. Change sentence structure significantly
3. Use different vocabulary (synonyms) where appropriate
4. Maintain the same tone and reading level
5. Do not add new information
6. Ensure the rewritten text flows naturally

Provide only the rewritten text without any preamble or explanation."""
                
                message = self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=2048,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                rewritten = message.content[0].text.strip()
                
                # Calculate new plagiarism score
                new_score, new_details = self.calculate_plagiarism_risk(rewritten, reference_text)
                
                improvement = initial_score - new_score
                
                return rewritten, {
                    "status": "Successfully rewritten by Claude API",
                    "rewrite_mode": rewrite_mode,
                    "original_plagiarism_score": round(initial_score, 2),
                    "new_plagiarism_score": round(new_score, 2),
                    "improvement": round(improvement, 2),
                    "original_risk_level": initial_details["risk_level"],
                    "new_risk_level": new_details["risk_level"],
                    "success": improvement > 0
                }
            except Exception as e:
                logger.error(f"Claude API failed: {e}")
                return text, {
                    "status": f"API Error: {str(e)}",
                    "fallback_used": True,
                    "error": str(e)
                }
        
        # Fallback: basic synonym replacement
        logger.warning("API not available, using fallback rewriter")
        return self._fallback_rewrite(text), {
            "status": "API Unavailable - Basic rewriting applied",
            "fallback_used": True
        }

    def _fallback_rewrite(self, text: str) -> str:
        """Basic fallback rewriter using simple transformations"""
        # Simple synonym dictionary (very basic)
        synonyms = {
            'important': 'significant',
            'show': 'demonstrate',
            'use': 'utilize',
            'get': 'obtain',
            'make': 'create',
            'good': 'beneficial',
            'bad': 'detrimental',
            'big': 'large',
            'small': 'minor',
            'help': 'assist'
        }
        
        words = text.split()
        result = []
        
        for word in words:
            lower_word = word.lower().strip('.,!?;:')
            if lower_word in synonyms:
                # Preserve original capitalization
                replacement = synonyms[lower_word]
                if word[0].isupper():
                    replacement = replacement.capitalize()
                # Preserve punctuation
                punctuation = ''.join(c for c in word if not c.isalnum())
                result.append(replacement + punctuation)
            else:
                result.append(word)
        
        return ' '.join(result)
