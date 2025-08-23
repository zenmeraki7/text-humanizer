"""
Text Humanizer Module
Contains functionality to convert AI-generated text to human-like text
"""

import anthropic
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

class TextHumanizer:
    def __init__(self, anthropic_api_key: str, ai_detector=None):
        # Initialize Anthropic client
        self.anthropic_available = anthropic_api_key != "dummy_key"
        if self.anthropic_available:
            try:
                self.client = anthropic.Anthropic(api_key=anthropic_api_key)
                logger.info("✅ Anthropic client initialized for humanization")
            except Exception as e:
                logger.warning(f"⚠️ Anthropic client failed: {e}")
                self.client = None
                self.anthropic_available = False
        else:
            self.client = None
            logger.warning("⚠️ Anthropic client disabled for humanization")

        # Reference to AI detector for pattern analysis
        self.ai_detector = ai_detector
        
        # Load humanized alternatives
        self.humanized_alternatives = self._load_humanized_alternatives()
        
        logger.info("✅ Text Humanizer initialized")

    def _load_humanized_alternatives(self):
        """Enhanced humanized alternatives including Excel suggestions"""
        alternatives = {
            "in today's fast-paced world": [
                "these days", "nowadays", "right now", "with everything moving so quickly", "lately"
            ],
            "with that being said": [
                "but", "however", "though", "that said", "still", "even so"
            ],
            "at the end of the day": [
                "ultimately", "in the end", "when it comes down to it", "what matters most", "bottom line"
            ],
            "it goes without saying": [
                "obviously", "clearly", "naturally", "of course", "everyone knows"
            ],
            "leverage": [
                "use", "tap into", "make use of", "take advantage of", "work with"
            ],
            "optimize": [
                "improve", "make better", "fine-tune", "enhance", "perfect"
            ],
            "cutting-edge": [
                "latest", "newest", "advanced", "modern", "up-to-date", "fresh"
            ],
            "furthermore": [
                "plus", "also", "and", "what's more", "on top of that", "besides"
            ],
            "however": [
                "but", "though", "yet", "still", "on the flip side", "that said"
            ],
            "therefore": [
                "so", "that's why", "which means", "as a result", "because of this"
            ]
        }

        # Add Excel pattern suggestions to alternatives if AI detector is available
        if self.ai_detector and hasattr(self.ai_detector, 'pattern_details'):
            for pattern, details in self.ai_detector.pattern_details.items():
                if details['suggestions']:
                    alternatives[pattern] = [s.strip() for s in details['suggestions'] if s.strip()]

        return alternatives

    def humanize(self, text: str) -> Tuple[str, str, str]:
        """Enhanced humanization with pattern avoidance including Excel suggestions"""
        if not self.anthropic_available:
            return "❌ Humanization requires ANTHROPIC_API_KEY", "❌ API key required", "Set ANTHROPIC_API_KEY to enable this feature"

        if not text.strip():
            return "Please provide some text to humanize.", "❌ No text provided", "No analysis available"

        try:
            # Detect patterns before processing (if AI detector is available)
            patterns_before = {}
            ai_score_before = 0.0
            
            if self.ai_detector:
                patterns_before = self.ai_detector.detect_ai_patterns(text)
                ai_score_before, _ = self.ai_detector.calculate_ai_score(text)

            # Create enhanced prompt with Excel suggestions
            flagged_phrases = []
            suggestions_text = ""

            for patterns in patterns_before.values():
                flagged_phrases.extend(patterns)

            # Add suggestions from Excel patterns
            if self.ai_detector and hasattr(self.ai_detector, 'pattern_details'):
                excel_suggestions = []
                for pattern in flagged_phrases:
                    if pattern.lower() in self.ai_detector.pattern_details:
                        details = self.ai_detector.pattern_details[pattern.lower()]
                        if details['suggestions']:
                            excel_suggestions.append(f'"{pattern}" → {", ".join(details["suggestions"][:2])}')

                if excel_suggestions:
                    suggestions_text = f"\n\nUSE THESE ALTERNATIVES:\n" + "\n".join(excel_suggestions[:10])

            pattern_warning = ""
            if flagged_phrases:
                pattern_warning = f"\n\nAVOID these detected AI patterns: {', '.join(flagged_phrases[:15])}{suggestions_text}"

            prompt = f"""Rewrite this text to sound completely human-written. Remove all AI writing patterns and corporate jargon.

Guidelines:
- Use varied sentence lengths and structures
- Remove robotic scaffolds and transitions
- Add natural personality and voice
- Use contractions and conversational tone
- Remove buzzwords and replace with simple language
- Make it feel like a real person wrote it spontaneously{pattern_warning}

Text to rewrite:
\"\"\"
{text}
\"\"\"

Return only the rewritten version with no explanations."""

            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )

            humanized_text = response.content[0].text

            # Analyze results (if AI detector is available)
            patterns_after = {}
            ai_score_after = 0.0
            
            if self.ai_detector:
                patterns_after = self.ai_detector.detect_ai_patterns(humanized_text)
                ai_score_after, _ = self.ai_detector.calculate_ai_score(humanized_text)

            # Calculate improvement
            before_count = sum(len(patterns) for patterns in patterns_before.values())
            after_count = sum(len(patterns) for patterns in patterns_after.values())
            score_improvement = ai_score_before - ai_score_after

            status = f"✅ AI Score: {ai_score_before:.1f}% → {ai_score_after:.1f}% (-{score_improvement:.1f}%)"
            if score_improvement > 20:
                status += " | Significant improvement!"
            elif score_improvement > 10:
                status += " | Good improvement"
            elif score_improvement > 0:
                status += " | Minor improvement"
            else:
                status += " | ⚠️ Limited improvement"

            # Generate analysis
            analysis = "**BEFORE HUMANIZATION:**\n"
            analysis += f"AI Score: {ai_score_before:.1f}% | Patterns: {before_count}\n\n"
            analysis += "**AFTER HUMANIZATION:**\n"
            analysis += f"AI Score: {ai_score_after:.1f}% | Patterns: {after_count}\n"
            analysis += f"Improvement: -{score_improvement:.1f} percentage points"

            return humanized_text, status, analysis

        except Exception as e:
            logger.error(f"Humanization error: {str(e)}")
            return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

    def get_humanization_suggestions(self, text: str) -> dict:
        """Get specific suggestions for humanizing text"""
        if not self.ai_detector:
            return {"error": "AI detector not available for analysis"}
            
        detected_patterns = self.ai_detector.detect_ai_patterns(text)
        suggestions = {}
        
        for category, patterns in detected_patterns.items():
            category_suggestions = []
            for pattern in patterns:
                if pattern.lower() in self.humanized_alternatives:
                    alternatives = self.humanized_alternatives[pattern.lower()]
                    category_suggestions.append({
                        'pattern': pattern,
                        'alternatives': alternatives[:3]  # Top 3 alternatives
                    })
                    
            if category_suggestions:
                suggestions[category] = category_suggestions
                
        return suggestions
