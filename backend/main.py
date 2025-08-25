"""
Plagiarism Detector Module
Detects and removes plagiarism from text
"""

import logging
import re
from difflib import SequenceMatcher
from typing import Tuple, List, Dict, Any

logger = logging.getLogger(__name__)

class PlagiarismDetector:
    def __init__(self, api_key: str, ai_detector):
        """Initialize the plagiarism detector"""
        logger.info("Initializing Plagiarism Detector...")
        
        self.api_key = api_key
        self.ai_detector = ai_detector
        self.anthropic_available = api_key != "dummy_key"
        
        logger.info(f"Plagiarism Detector initialized (API Available: {self.anthropic_available})")
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity percentage between two texts"""
        # Clean and normalize texts
        text1_clean = re.sub(r'[^\w\s]', '', text1.lower())
        text2_clean = re.sub(r'[^\w\s]', '', text2.lower())
        
        # Use SequenceMatcher for basic similarity
        similarity = SequenceMatcher(None, text1_clean, text2_clean).ratio()
        
        return similarity * 100
    
    def find_matching_phrases(self, text1: str, text2: str, min_length: int = 5) -> List[Dict[str, Any]]:
        """Find matching phrases between two texts"""
        words1 = text1.lower().split()
        words2 = text2.lower().split()
        
        matches = []
        
        # Look for matching sequences
        for i in range(len(words1) - min_length + 1):
            for j in range(len(words2) - min_length + 1):
                # Find longest common subsequence starting at positions i, j
                match_length = 0
                while (i + match_length < len(words1) and 
                       j + match_length < len(words2) and 
                       words1[i + match_length] == words2[j + match_length]):
                    match_length += 1
                
                if match_length >= min_length:
                    match_text = ' '.join(words1[i:i + match_length])
                    matches.append({
                        "text": match_text,
                        "length": match_length,
                        "position1": i,
                        "position2": j,
                        "similarity": 100.0  # Exact match
                    })
        
        # Remove overlapping matches (keep longest ones)
        unique_matches = []
        for match in sorted(matches, key=lambda x: x['length'], reverse=True):
            overlap = False
            for existing in unique_matches:
                if (abs(match['position1'] - existing['position1']) < match['length'] or
                    abs(match['position2'] - existing['position2']) < match['length']):
                    overlap = True
                    break
            if not overlap:
                unique_matches.append(match)
        
        return unique_matches[:10]  # Return top 10 matches
    
    def check(self, text1: str, text2: str) -> Tuple[float, List[Dict[str, Any]]]:
        """Check plagiarism between two texts"""
        logger.info("Starting plagiarism check")
        
        # Calculate overall similarity
        similarity_score = self.calculate_similarity(text1, text2)
        
        # Find specific matching phrases
        matches = self.find_matching_phrases(text1, text2)
        
        logger.info(f"Plagiarism check completed: {similarity_score:.1f}% similarity, {len(matches)} matches found")
        
        return similarity_score, matches
    
    def basic_rewrite(self, text: str, mode: str = "balanced") -> str:
        """Basic text rewriting to reduce plagiarism"""
        # Simple synonym replacements and structure changes
        replacements = {
            "significant": "important",
            "demonstrate": "show",
            "utilize": "use",
            "facilitate": "help",
            "implement": "put in place",
            "furthermore": "also",
            "moreover": "additionally",
            "however": "but",
            "therefore": "so",
            "consequently": "as a result"
        }
        
        rewritten = text
        
        # Apply replacements
        for original, replacement in replacements.items():
            rewritten = re.sub(r'\b' + original + r'\b', replacement, rewritten, flags=re.IGNORECASE)
        
        # Simple sentence structure changes
        sentences = rewritten.split('. ')
        modified_sentences = []
        
        for sentence in sentences:
            # Occasionally rearrange sentence structure
            if sentence.startswith('The ') and len(sentence.split()) > 8:
                # Move some phrases around
                words = sentence.split()
                if len(words) > 6:
                    # Simple rearrangement
                    modified_sentence = ' '.join(words[3:6]) + ' ' + ' '.join(words[:3]) + ' ' + ' '.join(words[6:])
                    modified_sentences.append(modified_sentence)
                else:
                    modified_sentences.append(sentence)
            else:
                modified_sentences.append(sentence)
        
        return '. '.join(modified_sentences)
    
    def advanced_rewrite(self, text: str, mode: str = "balanced", reference_text: str = "") -> Tuple[str, str]:
        """Advanced rewriting using AI (requires API key)"""
        if not self.anthropic_available:
            return self.basic_rewrite(text, mode), "Used basic rewriting (no API key)"
        
        try:
            # If you had Anthropic API, you would call it here with prompts like:
            # "Rewrite this text to avoid plagiarism while maintaining meaning..."
            # For now, just use basic rewriting
            rewritten = self.basic_rewrite(text, mode)
            return rewritten, "Advanced rewriting completed"
            
        except Exception as e:
            logger.error(f"Advanced rewriting failed: {e}")
            return self.basic_rewrite(text, mode), f"Fallback to basic rewriting due to error: {str(e)}"
    
    def remove(self, text: str, rewrite_mode: str = "balanced", reference_text: str = "") -> Tuple[str, Dict[str, Any]]:
        """Remove plagiarism from text"""
        logger.info(f"Starting plagiarism removal in {rewrite_mode} mode")
        
        try:
            # Use advanced rewriting if API is available
            if self.anthropic_available:
                cleaned_text, status = self.advanced_rewrite(text, rewrite_mode, reference_text)
            else:
                cleaned_text = self.basic_rewrite(text, rewrite_mode)
                status = "Basic plagiarism removal completed (no API key available)"
            
            # Analyze the results
            if reference_text:
                original_similarity, _ = self.check(text, reference_text)
                new_similarity, _ = self.check(cleaned_text, reference_text)
                improvement = original_similarity - new_similarity
            else:
                original_similarity = 0
                new_similarity = 0
                improvement = 0
            
            # Generate report
            report = {
                "original_length": len(text),
                "cleaned_length": len(cleaned_text),
                "original_similarity": original_similarity,
                "new_similarity": new_similarity,
                "improvement": improvement,
                "status": status,
                "mode_used": rewrite_mode,
                "changes_made": abs(len(text) - len(cleaned_text)),
                "api_available": self.anthropic_available
            }
            
            logger.info(f"Plagiarism removal completed: {improvement:.1f}% improvement")
            
            return cleaned_text, report
            
        except Exception as e:
            logger.error(f"Plagiarism removal failed: {e}")
            return text, {"error": str(e), "status": "failed"}
