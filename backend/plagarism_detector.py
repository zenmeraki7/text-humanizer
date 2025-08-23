"""
Plagiarism Detection and Removal Module
Contains functionality for detecting and removing plagiarism from text
"""

import re
import anthropic
import logging
from typing import Dict, List, Tuple
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)

class PlagiarismDetector:
    def __init__(self, anthropic_api_key: str, ai_detector=None):
        # Initialize Anthropic client for plagiarism removal
        self.anthropic_available = anthropic_api_key != "dummy_key"
        if self.anthropic_available:
            try:
                self.client = anthropic.Anthropic(api_key=anthropic_api_key)
                logger.info("✅ Anthropic client initialized for plagiarism removal")
            except Exception as e:
                logger.warning(f"⚠️ Anthropic client failed: {e}")
                self.client = None
                self.anthropic_available = False
        else:
            self.client = None
            logger.warning("⚠️ Anthropic client disabled for plagiarism removal")

        # Reference to AI detector for pattern analysis
        self.ai_detector = ai_detector
        
        logger.info("✅ Plagiarism Detector initialized")

    def check_plagiarism_local(self, text1: str, text2: str) -> Tuple[float, dict]:
        """Check for plagiarism between two texts using local similarity analysis"""
        if not text1.strip() or not text2.strip():
            return 0.0, {"error": "Both texts must be provided"}

        # Clean and normalize texts
        text1_clean = re.sub(r'[^\w\s]', '', text1.lower())
        text2_clean = re.sub(r'[^\w\s]', '', text2.lower())

        # Overall similarity using SequenceMatcher
        overall_similarity = SequenceMatcher(None, text1_clean, text2_clean).ratio()

        # Sentence-by-sentence comparison
        sentences1 = [s.strip() for s in re.split(r'[.!?]+', text1) if s.strip()]
        sentences2 = [s.strip() for s in re.split(r'[.!?]+', text2) if s.strip()]

        sentence_similarities = []
        for s1 in sentences1:
            max_sim = 0.0
            for s2 in sentences2:
                sim = SequenceMatcher(None, s1.lower(), s2.lower()).ratio()
                if sim > max_sim:
                    max_sim = sim
            sentence_similarities.append(max_sim)

        avg_sentence_similarity = sum(sentence_similarities) / len(sentence_similarities) if sentence_similarities else 0.0

        # Word overlap analysis
        words1 = set(text1_clean.split())
        words2 = set(text2_clean.split())
        if words1 and words2:
            word_overlap = len(words1.intersection(words2)) / len(words1.union(words2))
        else:
            word_overlap = 0.0

        # N-gram analysis (3-grams)
        def get_ngrams(text, n=3):
            words = text.split()
            return set(zip(*[words[i:] for i in range(n)])) if len(words) >= n else set()

        ngrams1 = get_ngrams(text1_clean)
        ngrams2 = get_ngrams(text2_clean)
        if ngrams1 and ngrams2:
            ngram_overlap = len(ngrams1.intersection(ngrams2)) / len(ngrams1.union(ngrams2))
        else:
            ngram_overlap = 0.0

        # Combined plagiarism score
        plagiarism_score = (
            (overall_similarity * 0.4) +
            (avg_sentence_similarity * 0.3) +
            (word_overlap * 0.2) +
            (ngram_overlap * 0.1)
        )

        details = {
            'overall_similarity': overall_similarity * 100,
            'sentence_similarity': avg_sentence_similarity * 100,
            'word_overlap': word_overlap * 100,
            'ngram_overlap': ngram_overlap * 100,
            'word_count_1': len(text1.split()),
            'word_count_2': len(text2.split())
        }

        return plagiarism_score * 100, details

    def get_plagiarism_report(self, text1: str, text2: str) -> Tuple[str, float, str]:
        """Generate comprehensive plagiarism analysis report"""
        if not text1.strip() or not text2.strip():
            return "❌ **Please provide both texts for plagiarism comparison.**", 0, "❌ Insufficient data"

        plagiarism_score, details = self.check_plagiarism_local(text1, text2)

        # Determine classification
        if plagiarism_score >= 80:
            classification = "🚨 **HIGHLY LIKELY PLAGIARIZED**"
            confidence = "Very High"
        elif plagiarism_score >= 60:
            classification = "⚠️ **POSSIBLY PLAGIARIZED**"
            confidence = "High"
        elif plagiarism_score >= 40:
            classification = "🤔 **SOME SIMILARITIES DETECTED**"
            confidence = "Medium"
        elif plagiarism_score >= 20:
            classification = "📝 **MINOR SIMILARITIES**"
            confidence = "Low"
        else:
            classification = "✅ **LIKELY ORIGINAL**"
            confidence = "Very Low Plagiarism Risk"

        report = f"{classification}\n\n"
        report += f"**Plagiarism Score: {plagiarism_score:.1f}%** (Confidence: {confidence})\n\n"

        # Detailed analysis
        report += "**📊 SIMILARITY ANALYSIS:**\n\n"
        report += f"• **Overall Text Similarity:** {details['overall_similarity']:.1f}%\n"
        report += f"• **Sentence-level Similarity:** {details['sentence_similarity']:.1f}%\n"
        report += f"• **Word Overlap:** {details['word_overlap']:.1f}%\n"
        report += f"• **Phrase Pattern Overlap:** {details['ngram_overlap']:.1f}%\n\n"

        # Text statistics
        report += "**📏 TEXT STATISTICS:**\n\n"
        report += f"• **Text 1 Word Count:** {details['word_count_1']}\n"
        report += f"• **Text 2 Word Count:** {details['word_count_2']}\n"

        length_diff = abs(details['word_count_1'] - details['word_count_2'])
        report += f"• **Length Difference:** {length_diff} words\n\n"

        # Recommendations
        report += "**💡 RECOMMENDATIONS:**\n\n"
        if plagiarism_score >= 60:
            report += "• ⚠️ High similarity detected - review for potential plagiarism\n"
            report += "• 🔍 Check for proper citations and attribution\n"
            report += "• ✏️ Consider paraphrasing or rewriting similar sections\n"
        elif plagiarism_score >= 40:
            report += "• 🤔 Moderate similarities found - verify originality\n"
            report += "• 📝 Review overlapping sections for proper attribution\n"
        elif plagiarism_score >= 20:
            report += "• ✅ Minor similarities are normal for related topics\n"
            report += "• 📚 Ensure any quotes or references are properly cited\n"
        else:
            report += "• ✅ Texts appear to be original with minimal overlap\n"
            report += "• 🎯 Good originality indicators detected\n"

        status = f"Analysis complete: {classification}"

        return report, plagiarism_score, status

    def remove_plagiarism(self, text: str, rewrite_mode: str = "balanced", reference_text: str = "") -> dict:
        """Advanced plagiarism removal with rewriting"""
        if not self.anthropic_available:
            return {"error": "Plagiarism removal requires ANTHROPIC_API_KEY"}

        if not text.strip():
            return {"error": "Text cannot be empty"}

        try:
            # Original plagiarism score if reference provided
            original_plagiarism_score = 0.0
            if reference_text.strip():
                original_plagiarism_score, _ = self.check_plagiarism_local(text, reference_text)

            # Get AI patterns to avoid (if AI detector is available)
            detected_ai_patterns = {}
            flagged_phrases = []
            
            if self.ai_detector:
                detected_ai_patterns = self.ai_detector.detect_ai_patterns(text)
                for patterns in detected_ai_patterns.values():
                    flagged_phrases.extend(patterns)

            # Define rewriting strategies
            strategies = {
                "conservative": {
                    "description": "Light paraphrasing while maintaining original structure",
                    "prompt": """Rewrite this text to eliminate plagiarism while keeping the original meaning and structure as much as possible. Make minimal changes but ensure the text is sufficiently different from the original.

Guidelines:
- Replace key terms with synonyms
- Slightly modify sentence structure
- Keep the same overall organization
- Maintain technical accuracy
- Preserve the original tone
- Avoid AI writing patterns and clichés"""
                },
                "balanced": {
                    "description": "Moderate restructuring with synonym replacement",
                    "prompt": """Rewrite this text to completely eliminate plagiarism while maintaining the core meaning and information. Use a balanced approach that changes both vocabulary and sentence structure.

Guidelines:
- Replace words with appropriate synonyms
- Restructure sentences significantly
- Change paragraph organization if needed
- Use different transitions and connectors
- Maintain factual accuracy
- Keep the same level of detail
- Write in a natural, human style
- Avoid corporate buzzwords and AI patterns"""
                },
                "aggressive": {
                    "description": "Complete restructuring with new writing style",
                    "prompt": """Completely rewrite this text from scratch to eliminate all plagiarism. Transform the writing style, structure, and approach while preserving all the essential information and meaning.

Guidelines:
- Use completely different sentence structures
- Reorganize information flow
- Change the writing style and tone
- Use different examples or explanations where possible
- Replace all possible words with synonyms
- Create a fresh perspective on the same content
- Write naturally like a human would
- Avoid all AI writing patterns, corporate jargon, and clichés"""
                }
            }

            strategy = strategies.get(rewrite_mode, strategies["balanced"])

            # Create the rewriting prompt
            full_prompt = f"""{strategy['prompt']}

Text to rewrite:
\"\"\"
{text}
\"\"\"

IMPORTANT INSTRUCTIONS:
- Write naturally and conversationally
- Avoid these AI patterns: {', '.join(flagged_phrases[:10]) if flagged_phrases else 'corporate buzzwords and clichés'}
- Use varied sentence lengths and structures
- Make it sound human-written

Return only the rewritten version with no explanations."""

            # Add reference context if provided
            if reference_text.strip():
                full_prompt += f"\n\nCRITICAL: Ensure the rewritten text is significantly different from this reference text:\n\"\"\"\n{reference_text[:500]}{'...' if len(reference_text) > 500 else ''}\n\"\"\""

            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                messages=[{"role": "user", "content": full_prompt}]
            )

            rewritten_text = response.content[0].text.strip()

            # Calculate improvement metrics
            new_plagiarism_score = 0.0
            if reference_text.strip():
                new_plagiarism_score, _ = self.check_plagiarism_local(rewritten_text, reference_text)

            # Calculate AI score improvement (if AI detector is available)
            original_ai_score = 0.0
            new_ai_score = 0.0
            
            if self.ai_detector:
                original_ai_score, _ = self.ai_detector.calculate_ai_score(text)
                new_ai_score, _ = self.ai_detector.calculate_ai_score(rewritten_text)

            # Calculate text statistics
            original_word_count = len(text.split())
            new_word_count = len(rewritten_text.split())
            length_change = ((new_word_count - original_word_count) / original_word_count) * 100 if original_word_count > 0 else 0

            return {
                "rewritten_text": rewritten_text,
                "original_plagiarism_score": original_plagiarism_score,
                "new_plagiarism_score": new_plagiarism_score,
                "original_ai_score": original_ai_score,
                "new_ai_score": new_ai_score,
                "improvement": original_plagiarism_score - new_plagiarism_score,
                "ai_improvement": original_ai_score - new_ai_score,
                "original_word_count": original_word_count,
                "new_word_count": new_word_count,
                "length_change": length_change,
                "rewrite_mode": rewrite_mode,
                "strategy_description": strategy["description"]
            }

        except Exception as e:
            logger.error(f"Plagiarism removal error: {str(e)}")
            return {"error": str(e)}

    def find_similar_sentences(self, text1: str, text2: str, threshold: float = 0.7) -> List[dict]:
        """Find sentences with high similarity between two texts"""
        sentences1 = [s.strip() for s in re.split(r'[.!?]+', text1) if s.strip()]
        sentences2 = [s.strip() for s in re.split(r'[.!?]+', text2) if s.strip()]
        
        similar_pairs = []
        
        for i, s1 in enumerate(sentences1):
            for j, s2 in enumerate(sentences2):
                similarity = SequenceMatcher(None, s1.lower(), s2.lower()).ratio()
                if similarity >= threshold:
                    similar_pairs.append({
                        'text1_sentence': s1,
                        'text2_sentence': s2,
                        'similarity': similarity * 100,
                        'text1_position': i,
                        'text2_position': j
                    })
        
        # Sort by similarity descending
        similar_pairs.sort(key=lambda x: x['similarity'], reverse=True)
        
        return similar_pairs

    def get_plagiarism_statistics(self, text1: str, text2: str) -> dict:
        """Get detailed plagiarism statistics"""
        plagiarism_score, details = self.check_plagiarism_local(text1, text2)
        similar_sentences = self.find_similar_sentences(text1, text2)
        
        return {
            'overall_score': plagiarism_score,
            'details': details,
            'similar_sentences_count': len(similar_sentences),
            'similar_sentences': similar_sentences[:5],  # Top 5 most similar
            'total_sentences_text1': len([s for s in re.split(r'[.!?]+', text1) if s.strip()]),
            'total_sentences_text2': len([s for s in re.split(r'[.!?]+', text2) if s.strip()])
        }
