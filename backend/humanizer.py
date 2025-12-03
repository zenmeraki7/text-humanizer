# # """
# # Text Humanizer Module
# # Contains functionality to convert AI-generated text to human-like text
# # """

# # import anthropic
# # import logging
# # from typing import Tuple

# # logger = logging.getLogger(__name__)

# # class TextHumanizer:
# #     def __init__(self, anthropic_api_key: str, ai_detector=None):
# #         # Initialize Anthropic client
# #         self.anthropic_available = anthropic_api_key != "dummy_key"
# #         if self.anthropic_available:
# #             try:
# #                 self.client = anthropic.Anthropic(api_key=anthropic_api_key)
# #                 logger.info("✅ Anthropic client initialized for humanization")
# #             except Exception as e:
# #                 logger.warning(f"⚠️ Anthropic client failed: {e}")
# #                 self.client = None
# #                 self.anthropic_available = False
# #         else:
# #             self.client = None
# #             logger.warning("⚠️ Anthropic client disabled for humanization")

# #         # Reference to AI detector for pattern analysis
# #         self.ai_detector = ai_detector
        
# #         # Load humanized alternatives
# #         self.humanized_alternatives = self._load_humanized_alternatives()
        
# #         logger.info("✅ Text Humanizer initialized")

# #     def _load_humanized_alternatives(self):
# #         """Enhanced humanized alternatives including Excel suggestions"""
# #         alternatives = {
# #             "in today's fast-paced world": [
# #                 "these days", "nowadays", "right now", "with everything moving so quickly", "lately"
# #             ],
# #             "with that being said": [
# #                 "but", "however", "though", "that said", "still", "even so"
# #             ],
# #             "at the end of the day": [
# #                 "ultimately", "in the end", "when it comes down to it", "what matters most", "bottom line"
# #             ],
# #             "it goes without saying": [
# #                 "obviously", "clearly", "naturally", "of course", "everyone knows"
# #             ],
# #             "leverage": [
# #                 "use", "tap into", "make use of", "take advantage of", "work with"
# #             ],
# #             "optimize": [
# #                 "improve", "make better", "fine-tune", "enhance", "perfect"
# #             ],
# #             "cutting-edge": [
# #                 "latest", "newest", "advanced", "modern", "up-to-date", "fresh"
# #             ],
# #             "furthermore": [
# #                 "plus", "also", "and", "what's more", "on top of that", "besides"
# #             ],
# #             "however": [
# #                 "but", "though", "yet", "still", "on the flip side", "that said"
# #             ],
# #             "therefore": [
# #                 "so", "that's why", "which means", "as a result", "because of this"
# #             ]
# #         }

# #         # Add Excel pattern suggestions to alternatives if AI detector is available
# #         if self.ai_detector and hasattr(self.ai_detector, 'pattern_details'):
# #             for pattern, details in self.ai_detector.pattern_details.items():
# #                 if details['suggestions']:
# #                     alternatives[pattern] = [s.strip() for s in details['suggestions'] if s.strip()]

# #         return alternatives

# #     def humanize(self, text: str) -> Tuple[str, str, str]:
# #         """Enhanced humanization with pattern avoidance including Excel suggestions"""
# #         if not self.anthropic_available:
# #             return "❌ Humanization requires ANTHROPIC_API_KEY", "❌ API key required", "Set ANTHROPIC_API_KEY to enable this feature"

# #         if not text.strip():
# #             return "Please provide some text to humanize.", "❌ No text provided", "No analysis available"

# #         try:
# #             # Detect patterns before processing (if AI detector is available)
# #             patterns_before = {}
# #             ai_score_before = 0.0
            
# #             if self.ai_detector:
# #                 patterns_before = self.ai_detector.detect_ai_patterns(text)
# #                 ai_score_before, _ = self.ai_detector.calculate_ai_score(text)

# #             # Create enhanced prompt with Excel suggestions
# #             flagged_phrases = []
# #             suggestions_text = ""

# #             for patterns in patterns_before.values():
# #                 flagged_phrases.extend(patterns)

# #             # Add suggestions from Excel patterns
# #             if self.ai_detector and hasattr(self.ai_detector, 'pattern_details'):
# #                 excel_suggestions = []
# #                 for pattern in flagged_phrases:
# #                     if pattern.lower() in self.ai_detector.pattern_details:
# #                         details = self.ai_detector.pattern_details[pattern.lower()]
# #                         if details['suggestions']:
# #                             excel_suggestions.append(f'"{pattern}" → {", ".join(details["suggestions"][:2])}')

# #                 if excel_suggestions:
# #                     suggestions_text = f"\n\nUSE THESE ALTERNATIVES:\n" + "\n".join(excel_suggestions[:10])

# #             pattern_warning = ""
# #             if flagged_phrases:
# #                 pattern_warning = f"\n\nAVOID these detected AI patterns: {', '.join(flagged_phrases[:15])}{suggestions_text}"

# #             prompt = f"""Rewrite this text to sound completely human-written. Remove all AI writing patterns and corporate jargon.

# # Guidelines:
# # - Use varied sentence lengths and structures
# # - Remove robotic scaffolds and transitions
# # - Add natural personality and voice
# # - Use contractions and conversational tone
# # - Remove buzzwords and replace with simple language
# # - Make it feel like a real person wrote it spontaneously{pattern_warning}

# # Text to rewrite:
# # \"\"\"
# # {text}
# # \"\"\"

# # Return only the rewritten version with no explanations."""

# #             response = self.client.messages.create(
# #                 model="claude-3-5-sonnet-20241022",
# #                 max_tokens=4000,
# #                 messages=[{"role": "user", "content": prompt}]
# #             )

# #             humanized_text = response.content[0].text

# #             # Analyze results (if AI detector is available)
# #             patterns_after = {}
# #             ai_score_after = 0.0
            
# #             if self.ai_detector:
# #                 patterns_after = self.ai_detector.detect_ai_patterns(humanized_text)
# #                 ai_score_after, _ = self.ai_detector.calculate_ai_score(humanized_text)

# #             # Calculate improvement
# #             before_count = sum(len(patterns) for patterns in patterns_before.values())
# #             after_count = sum(len(patterns) for patterns in patterns_after.values())
# #             score_improvement = ai_score_before - ai_score_after

# #             status = f"✅ AI Score: {ai_score_before:.1f}% → {ai_score_after:.1f}% (-{score_improvement:.1f}%)"
# #             if score_improvement > 20:
# #                 status += " | Significant improvement!"
# #             elif score_improvement > 10:
# #                 status += " | Good improvement"
# #             elif score_improvement > 0:
# #                 status += " | Minor improvement"
# #             else:
# #                 status += " | ⚠️ Limited improvement"

# #             # Generate analysis
# #             analysis = "**BEFORE HUMANIZATION:**\n"
# #             analysis += f"AI Score: {ai_score_before:.1f}% | Patterns: {before_count}\n\n"
# #             analysis += "**AFTER HUMANIZATION:**\n"
# #             analysis += f"AI Score: {ai_score_after:.1f}% | Patterns: {after_count}\n"
# #             analysis += f"Improvement: -{score_improvement:.1f} percentage points"

# #             return humanized_text, status, analysis

# #         except Exception as e:
# #             logger.error(f"Humanization error: {str(e)}")
# #             return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

# #     def get_humanization_suggestions(self, text: str) -> dict:
# #         """Get specific suggestions for humanizing text"""
# #         if not self.ai_detector:
# #             return {"error": "AI detector not available for analysis"}
            
# #         detected_patterns = self.ai_detector.detect_ai_patterns(text)
# #         suggestions = {}
        
# #         for category, patterns in detected_patterns.items():
# #             category_suggestions = []
# #             for pattern in patterns:
# #                 if pattern.lower() in self.humanized_alternatives:
# #                     alternatives = self.humanized_alternatives[pattern.lower()]
# #                     category_suggestions.append({
# #                         'pattern': pattern,
# #                         'alternatives': alternatives[:3]  # Top 3 alternatives
# #                     })
                    
# #             if category_suggestions:
# #                 suggestions[category] = category_suggestions
                
# #         return suggestions




# """
# Text Humanizer Module
# Uses existing ai_patterns.json and phrasal_patterns.xlsx files
# """

# import anthropic
# import logging
# import json
# import pandas as pd
# import re
# from typing import Tuple, Dict, List

# logger = logging.getLogger(__name__)

# class TextHumanizer:
#     def __init__(self, anthropic_api_key: str, ai_detector=None):
#         # Initialize Anthropic client
#         self.anthropic_available = anthropic_api_key != "dummy_key"
#         if self.anthropic_available:
#             try:
#                 self.client = anthropic.Anthropic(api_key=anthropic_api_key)
#                 logger.info("✅ Anthropic client initialized for humanization")
#             except Exception as e:
#                 logger.warning(f"⚠️ Anthropic client failed: {e}")
#                 self.client = None
#                 self.anthropic_available = False
#         else:
#             self.client = None
#             logger.warning("⚠️ Anthropic client disabled for humanization")

#         # Reference to AI detector
#         self.ai_detector = ai_detector
        
#         # Load patterns and alternatives from existing files
#         self.ai_patterns = self._load_json_patterns()
#         self.excel_alternatives = self._load_excel_alternatives()
#         self.humanized_alternatives = self._create_all_alternatives()
        
#         total_patterns = sum(len(p) if isinstance(p, list) else 0 for p in self.ai_patterns.values())
#         total_alternatives = len(self.humanized_alternatives)
        
#         logger.info(f"✅ Text Humanizer initialized with {total_patterns} patterns and {total_alternatives} alternatives")

#     def _load_json_patterns(self):
#         """Load patterns from existing ai_patterns.json"""
#         try:
#             with open('ai_patterns.json', 'r', encoding='utf-8') as file:
#                 patterns = json.load(file)
#                 logger.info(f"✅ Loaded JSON patterns from ai_patterns.json")
#                 return patterns
#         except FileNotFoundError:
#             logger.error("❌ ai_patterns.json not found!")
#             return {}
#         except Exception as e:
#             logger.error(f"❌ Error loading JSON patterns: {e}")
#             return {}

#     def _load_excel_alternatives(self):
#         """Load alternatives from existing phrasal_patterns.xlsx"""
#         excel_alts = {}
#         try:
#             df = pd.read_excel('phrasal_patterns.xlsx')
#             logger.info("📊 Loading alternatives from phrasal_patterns.xlsx...")

#             # Process Excel data to extract pattern suggestions
#             for index, row in df.iterrows():
#                 if index < 3:  # Skip header rows
#                     continue

#                 # Column mappings: (pattern_col, suggestion_col)
#                 column_mappings = [
#                     (0, 1), (3, 4), (6, 7), (9, 10), (12, 13),
#                     (15, 16), (18, 19), (21, 22), (24, 25)
#                 ]

#                 for pattern_col, suggestion_col in column_mappings:
#                     try:
#                         if (len(row) > pattern_col and pd.notna(row.iloc[pattern_col]) and 
#                             str(row.iloc[pattern_col]).strip()):
                            
#                             pattern = str(row.iloc[pattern_col]).strip().lower()
#                             suggestions = str(row.iloc[suggestion_col]) if (len(row) > suggestion_col and 
#                                                                          pd.notna(row.iloc[suggestion_col])) else ""
                            
#                             if pattern and pattern not in ['pattern', ''] and suggestions:
#                                 clean_suggestions = [s.strip() for s in suggestions.split(',') if s.strip()]
#                                 if clean_suggestions:
#                                     excel_alts[pattern] = clean_suggestions
#                     except:
#                         continue

#             logger.info(f"✅ Loaded {len(excel_alts)} alternatives from Excel")
#             return excel_alts

#         except FileNotFoundError:
#             logger.warning("⚠️ phrasal_patterns.xlsx not found")
#             return {}
#         except Exception as e:
#             logger.error(f"❌ Error loading Excel alternatives: {e}")
#             return {}

#     def _create_all_alternatives(self):
#         """Create comprehensive alternatives using JSON patterns and Excel suggestions"""
#         alternatives = {}
        
#         # Base alternatives for common patterns
#         base_alts = {
#             "in today's fast-paced world": ["these days", "nowadays", "right now"],
#             "with that being said": ["but", "however", "though", "still"],
#             "at the end of the day": ["ultimately", "in the end", "what matters most"],
#             "it goes without saying": ["obviously", "clearly", "naturally"],
#             "moving forward": ["from now on", "going ahead", "next"],
#             "furthermore": ["plus", "also", "and", "what's more"],
#             "however": ["but", "though", "yet", "still"],
#             "therefore": ["so", "that's why", "which means"],
#             "leverage": ["use", "tap into", "work with"],
#             "optimize": ["improve", "make better", "enhance"],
#             "cutting-edge": ["latest", "newest", "advanced"],
#             "synergy": ["teamwork", "working together", "collaboration"],
#             "paradigm": ["approach", "way of thinking", "model"],
#             "holistic": ["complete", "whole", "comprehensive"],
#             "streamline": ["simplify", "make easier", "improve"],
#             "empower": ["help", "enable", "support"]
#         }
        
#         alternatives.update(base_alts)
        
#         # Add alternatives for all JSON patterns
#         for category, patterns in self.ai_patterns.items():
#             if category in ['rhetorical_question_rewrites', 'uniform_sentences']:
#                 continue
                
#             if isinstance(patterns, list):
#                 for pattern in patterns:
#                     if pattern not in alternatives:
#                         alternatives[pattern] = self._generate_simple_alternative(pattern)
#             elif isinstance(patterns, dict) and category == 'rhetorical_questions':
#                 # Handle rhetorical questions
#                 for subcategory, questions in patterns.items():
#                     for question in questions:
#                         if question not in alternatives:
#                             alternatives[question] = ["direct statement version"]

#         # Excel alternatives override everything (highest priority)
#         alternatives.update(self.excel_alternatives)
        
#         return alternatives

#     def _generate_simple_alternative(self, pattern):
#         """Generate simple alternatives for patterns"""
#         pattern_lower = pattern.lower()
        
#         if any(word in pattern_lower for word in ['conclusion', 'summary', 'wrap']):
#             return ["finally", "in the end", "to wrap up"]
#         elif any(word in pattern_lower for word in ['furthermore', 'addition', 'moreover']):
#             return ["also", "plus", "and"]
#         elif any(word in pattern_lower for word in ['however', 'contrast', 'hand']):
#             return ["but", "though", "yet"]
#         elif any(word in pattern_lower for word in ['therefore', 'result', 'thus']):
#             return ["so", "because of this", "that's why"]
#         elif any(word in pattern_lower for word in ['significant', 'important', 'crucial']):
#             return ["really", "very", "quite"]
#         else:
#             return ["simpler version", "plain language"]

#     def humanize(self, text: str) -> Tuple[str, str, str]:
#         """Humanize text using all loaded patterns and alternatives"""
#         if not self.anthropic_available:
#             return "❌ Humanization requires ANTHROPIC_API_KEY", "❌ API key required", "Set ANTHROPIC_API_KEY to enable this feature"

#         if not text.strip():
#             return "Please provide some text to humanize.", "❌ No text provided", "No analysis available"

#         try:
#             # Detect patterns before processing
#             patterns_before = {}
#             ai_score_before = 0.0
            
#             if self.ai_detector:
#                 patterns_before = self.ai_detector.detect_ai_patterns(text)
#                 ai_score_before, _ = self.ai_detector.calculate_ai_score(text)

#             # Collect all flagged patterns and their alternatives
#             flagged_patterns = []
#             suggestions_list = []
            
#             for category, patterns in patterns_before.items():
#                 flagged_patterns.extend(patterns)
                
#                 for pattern in patterns:
#                     if pattern.lower() in self.excel_alternatives:
#                         # Excel suggestions
#                         alts = ', '.join(self.excel_alternatives[pattern.lower()][:3])
#                         suggestions_list.append(f'"{pattern}" → {alts}')
#                     elif pattern in self.ai_patterns.get('rhetorical_question_rewrites', {}):
#                         # Rhetorical question rewrites
#                         rewrite = self.ai_patterns['rhetorical_question_rewrites'][pattern]
#                         suggestions_list.append(f'"{pattern}" → {rewrite}')
#                     elif pattern.lower() in self.humanized_alternatives:
#                         # Other alternatives
#                         alts = ', '.join(self.humanized_alternatives[pattern.lower()][:3])
#                         suggestions_list.append(f'"{pattern}" → {alts}')

#             # Build suggestions text
#             suggestions_text = ""
#             if suggestions_list:
#                 suggestions_text = f"\n\nSPECIFIC ALTERNATIVES:\n" + "\n".join(suggestions_list[:15])

#             # Create enhanced prompt
#             pattern_warning = ""
#             if flagged_patterns:
#                 pattern_warning = f"\n\nDETECTED AI PATTERNS ({len(flagged_patterns)} total): {', '.join(flagged_patterns[:20])}{suggestions_text}"

#             prompt = f"""Rewrite this text to sound completely human-written. Remove ALL AI writing patterns, corporate jargon, and robotic language.

# CRITICAL GUIDELINES:
# - Use varied sentence lengths and natural flow
# - Replace corporate buzzwords with simple, everyday language  
# - Remove robotic transitions and scaffolding phrases
# - Add personality, contractions, and conversational tone
# - Convert rhetorical questions to direct statements
# - Remove repetitive sentence structures
# - Make it sound like someone talking naturally
# - Avoid dramatic, escalating, or revelatory language
# - Use specific examples instead of vague generalizations{pattern_warning}

# Text to rewrite:
# \"\"\"
# {text}
# \"\"\"

# Return ONLY the rewritten version with no explanations."""

#             response = self.client.messages.create(
#                 model="claude-3-5-sonnet-20241022",
#                 max_tokens=4000,
#                 messages=[{"role": "user", "content": prompt}]
#             )

#             humanized_text = response.content[0].text

#             # Analyze results
#             patterns_after = {}
#             ai_score_after = 0.0
            
#             if self.ai_detector:
#                 patterns_after = self.ai_detector.detect_ai_patterns(humanized_text)
#                 ai_score_after, _ = self.ai_detector.calculate_ai_score(humanized_text)

#             # Calculate improvement
#             before_count = sum(len(patterns) for patterns in patterns_before.values())
#             after_count = sum(len(patterns) for patterns in patterns_after.values())
#             score_improvement = ai_score_before - ai_score_after
#             pattern_reduction = before_count - after_count

#             # Generate status
#             status = f"✅ AI Score: {ai_score_before:.1f}% → {ai_score_after:.1f}% (-{score_improvement:.1f}%)"
#             status += f" | Patterns: {before_count} → {after_count} (-{pattern_reduction})"
            
#             if score_improvement > 30:
#                 status += " | 🎉 Excellent improvement!"
#             elif score_improvement > 20:
#                 status += " | 🚀 Significant improvement!"
#             elif score_improvement > 10:
#                 status += " | ✅ Good improvement"
#             elif score_improvement > 0:
#                 status += " | ⬆️ Minor improvement"
#             else:
#                 status += " | ⚠️ Limited improvement"

#             # Generate analysis
#             analysis = "**HUMANIZATION ANALYSIS:**\n\n"
#             analysis += f"**BEFORE:** AI Score: {ai_score_before:.1f}% | Patterns: {before_count}\n"
#             analysis += f"**AFTER:** AI Score: {ai_score_after:.1f}% | Patterns: {after_count}\n"
#             analysis += f"**IMPROVEMENT:** -{score_improvement:.1f} points | {pattern_reduction} patterns removed"
            
#             if pattern_reduction > 0:
#                 success_rate = (pattern_reduction / before_count * 100) if before_count > 0 else 0
#                 analysis += f" ({success_rate:.1f}% success rate)"

#             return humanized_text, status, analysis

#         except Exception as e:
#             logger.error(f"Humanization error: {str(e)}")
#             return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

#     def get_humanization_suggestions(self, text: str) -> dict:
#         """Get suggestions using existing files"""
#         if not self.ai_detector:
#             return {"error": "AI detector not available"}
            
#         detected_patterns = self.ai_detector.detect_ai_patterns(text)
#         suggestions = {}
        
#         for category, patterns in detected_patterns.items():
#             category_suggestions = []
            
#             for pattern in patterns:
#                 suggestion_data = {'pattern': pattern, 'alternatives': []}
                
#                 # Check Excel alternatives first
#                 if pattern.lower() in self.excel_alternatives:
#                     suggestion_data['alternatives'] = self.excel_alternatives[pattern.lower()][:3]
#                     suggestion_data['source'] = 'Excel'
#                 # Check rhetorical rewrites
#                 elif pattern in self.ai_patterns.get('rhetorical_question_rewrites', {}):
#                     suggestion_data['alternatives'] = [self.ai_patterns['rhetorical_question_rewrites'][pattern]]
#                     suggestion_data['source'] = 'Rhetorical Rewrite'
#                 # Check general alternatives
#                 elif pattern.lower() in self.humanized_alternatives:
#                     suggestion_data['alternatives'] = self.humanized_alternatives[pattern.lower()][:3]
#                     suggestion_data['source'] = 'Generated'
                
#                 if suggestion_data['alternatives']:
#                     category_suggestions.append(suggestion_data)
                    
#             if category_suggestions:
#                 suggestions[category] = category_suggestions
                
#         return suggestions


"""
Text Humanizer Module
Uses existing ai_patterns.json and phrasal_patterns.xlsx files
"""

import anthropic
import logging
import json
import pandas as pd
import re
from typing import Tuple, Dict, List, Optional

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class TextHumanizer:
    def __init__(self, anthropic_api_key: str, ai_detector=None):
        # Initialize Anthropic client
        self.anthropic_available = anthropic_api_key and anthropic_api_key != "dummy_key"
        self.client = None
        
        if self.anthropic_available:
            try:
                # FIX: Removed 'proxies' argument - this was causing the crash
                self.client = anthropic.Anthropic(api_key=anthropic_api_key)
                logger.info("✅ Anthropic client initialized for humanization")
            except Exception as e:
                logger.warning(f"⚠️ Anthropic client failed: {e}")
                self.client = None
                self.anthropic_available = False
        else:
            self.client = None
            logger.warning("⚠️ Anthropic client disabled for humanization")

        # Reference to AI detector
        self.ai_detector = ai_detector
        
        # Load patterns and alternatives from existing files
        self.ai_patterns = self._load_json_patterns()
        self.excel_alternatives = self._load_excel_alternatives()
        self.humanized_alternatives = self._create_all_alternatives()
        
        # Calculate stats safely
        total_patterns = 0
        if self.ai_patterns:
            total_patterns = sum(len(p) if isinstance(p, list) else 0 for p in self.ai_patterns.values())
            
        total_alternatives = len(self.humanized_alternatives)
        logger.info(f"✅ Text Humanizer initialized with {total_patterns} patterns and {total_alternatives} alternatives")
    # --------------------- Load JSON and Excel ---------------------
    def _load_json_patterns(self):
        try:
            with open('ai_patterns.json', 'r', encoding='utf-8') as file:
                patterns = json.load(file)
                logger.info(f"✅ Loaded JSON patterns from ai_patterns.json")
                return patterns
        except FileNotFoundError:
            logger.error("❌ ai_patterns.json not found!")
            return {}
        except Exception as e:
            logger.error(f"❌ Error loading JSON patterns: {e}")
            return {}

    def _load_excel_alternatives(self):
        excel_alts = {}
        try:
            df = pd.read_excel('phrasal_patterns.xlsx')
            logger.info("📊 Loading alternatives from phrasal_patterns.xlsx...")

            for index, row in df.iterrows():
                if index < 3:  # Skip header
                    continue
                column_mappings = [
                    (0, 1), (3, 4), (6, 7), (9, 10), (12, 13),
                    (15, 16), (18, 19), (21, 22), (24, 25)
                ]
                for pattern_col, suggestion_col in column_mappings:
                    try:
                        if (len(row) > pattern_col and pd.notna(row.iloc[pattern_col]) and 
                            str(row.iloc[pattern_col]).strip()):
                            pattern = str(row.iloc[pattern_col]).strip().lower()
                            suggestions = str(row.iloc[suggestion_col]) if (len(row) > suggestion_col and 
                                                                          pd.notna(row.iloc[suggestion_col])) else ""
                            if pattern and pattern not in ['pattern', ''] and suggestions:
                                clean_suggestions = [s.strip() for s in suggestions.split(',') if s.strip()]
                                if clean_suggestions:
                                    excel_alts[pattern] = clean_suggestions
                    except:
                        continue

            logger.info(f"✅ Loaded {len(excel_alts)} alternatives from Excel")
            return excel_alts

        except FileNotFoundError:
            logger.warning("⚠️ phrasal_patterns.xlsx not found")
            return {}
        except Exception as e:
            logger.error(f"❌ Error loading Excel alternatives: {e}")
            return {}

    # --------------------- Create combined alternatives ---------------------
    def _create_all_alternatives(self):
        alternatives = {}
        
        base_alts = {
            "in today's fast-paced world": ["these days", "nowadays", "right now"],
            "with that being said": ["but", "however", "though", "still"],
            "at the end of the day": ["ultimately", "in the end", "what matters most"],
            "it goes without saying": ["obviously", "clearly", "naturally"],
            "moving forward": ["from now on", "going ahead", "next"],
            "furthermore": ["plus", "also", "and", "what's more"],
            "however": ["but", "though", "yet", "still"],
            "therefore": ["so", "that's why", "which means"],
            "leverage": ["use", "tap into", "work with"],
            "optimize": ["improve", "make better", "enhance"],
            "cutting-edge": ["latest", "newest", "advanced"],
            "synergy": ["teamwork", "working together", "collaboration"],
            "paradigm": ["approach", "way of thinking", "model"],
            "holistic": ["complete", "whole", "comprehensive"],
            "streamline": ["simplify", "make easier", "improve"],
            "empower": ["help", "enable", "support"]
        }
        alternatives.update(base_alts)

        # JSON patterns
        if self.ai_patterns:
            for category, patterns in self.ai_patterns.items():
                if category in ['rhetorical_question_rewrites', 'uniform_sentences']:
                    continue
                if isinstance(patterns, list):
                    for pattern in patterns:
                        if pattern not in alternatives:
                            alternatives[pattern] = self._generate_simple_alternative(pattern)
                elif isinstance(patterns, dict) and category == 'rhetorical_questions':
                    for subcategory, questions in patterns.items():
                        for question in questions:
                            if question not in alternatives:
                                alternatives[question] = ["direct statement version"]

        # Excel alternatives override all
        alternatives.update(self.excel_alternatives)
        return alternatives

    def _generate_simple_alternative(self, pattern):
        pattern_lower = pattern.lower()
        if any(word in pattern_lower for word in ['conclusion', 'summary', 'wrap']):
            return ["finally", "in the end", "to wrap up"]
        elif any(word in pattern_lower for word in ['furthermore', 'addition', 'moreover']):
            return ["also", "plus", "and"]
        elif any(word in pattern_lower for word in ['however', 'contrast', 'hand']):
            return ["but", "though", "yet"]
        elif any(word in pattern_lower for word in ['therefore', 'result', 'thus']):
            return ["so", "because of this", "that's why"]
        elif any(word in pattern_lower for word in ['significant', 'important', 'crucial']):
            return ["really", "very", "quite"]
        else:
            return ["simpler version", "plain language"]

    # --------------------- Pattern-based humanize ---------------------
    def humanize(self, text: str) -> Tuple[str, str, str]:
        """Humanize text using all loaded patterns and alternatives"""
        if not self.anthropic_available:
            return "❌ Humanization requires ANTHROPIC_API_KEY", "❌ API key required", "Set ANTHROPIC_API_KEY to enable this feature"

        if not text.strip():
            return "Please provide some text to humanize.", "❌ No text provided", "No analysis available"

        try:
            # Detect patterns before processing
            patterns_before = {}
            if self.ai_detector:
                patterns_before = self.ai_detector.detect_ai_patterns(text)

            # Collect all flagged patterns and their alternatives
            flagged_patterns = []
            suggestions_list = []

            for category, patterns in patterns_before.items():
                flagged_patterns.extend(patterns)
                for pattern in patterns:
                    if pattern.lower() in self.excel_alternatives:
                        alts = ', '.join(self.excel_alternatives[pattern.lower()][:3])
                        suggestions_list.append(f'"{pattern}" → {alts}')
                    elif pattern in self.ai_patterns.get('rhetorical_question_rewrites', {}):
                        rewrite = self.ai_patterns['rhetorical_question_rewrites'][pattern]
                        suggestions_list.append(f'"{pattern}" → {rewrite}')
                    elif pattern.lower() in self.humanized_alternatives:
                        alts = ', '.join(self.humanized_alternatives[pattern.lower()][:3])
                        suggestions_list.append(f'"{pattern}" → {alts}')

            suggestions_text = ""
            if suggestions_list:
                suggestions_text = f"\n\nSPECIFIC ALTERNATIVES:\n" + "\n".join(suggestions_list[:15])

            pattern_warning = ""
            if flagged_patterns:
                pattern_warning = f"\n\nDETECTED AI PATTERNS ({len(flagged_patterns)} total): {', '.join(flagged_patterns[:20])}{suggestions_text}"

            prompt = f"""Rewrite this text to sound completely human-written. Remove ALL AI writing patterns, corporate jargon, and robotic language.

CRITICAL GUIDELINES:
- Use varied sentence lengths and natural flow
- Replace corporate buzzwords with simple, everyday language  
- Remove robotic transitions and scaffolding phrases
- Add personality, contractions, and conversational tone
- Convert rhetorical questions to direct statements
- Remove repetitive sentence structures
- Make it sound like someone talking naturally
- Avoid dramatic, escalating, or revelatory language
- Use specific examples instead of vague generalizations{pattern_warning}

Text to rewrite:
\"\"\"{text}\"\"\"

Return ONLY the rewritten version with no explanations."""

            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )

            humanized_text = response.content[0].text
            return humanized_text, "✅ Pattern-based humanization completed", "Analysis available"

        except Exception as e:
            logger.error(f"Humanization error: {str(e)}")
            return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

    # --------------------- Pattern-free humanize ---------------------
    def humanize_without_patterns(self, text: str) -> str:
        """Humanize text without requiring pattern files"""
        if not self.anthropic_available or self.client is None:
            return "❌ Anthropic client not initialized"

        prompt = f"""You are an expert at converting AI-generated text into natural human writing.

MISSION: Remove ALL rhetorical questions and AI writing patterns.

RHETORICAL QUESTION RULES:
1. Any question mark (?) in the text is suspicious - evaluate if it's truly needed
2. If a question isn't seeking new information, convert it to a statement
3. Replace question scaffolding with direct declarations

Examples:
"Why does this matter?" → "This matters because it directly impacts..."
"What can we learn?" → "The key lesson is..."
"How do we solve this?" → "The solution involves..."
"Isn't it interesting that..." → "Notably,..."

OTHER AI MARKERS TO REMOVE:
- "It's important to note/mention/remember"
- "Furthermore/Moreover/Additionally" (use: also, plus, and)
- "In conclusion/summary" (use: finally, ultimately)
- "Delve into" (use: explore, examine, look at)
- "Leverage" (use: use, utilize)
- "At the end of the day" (use: ultimately, what matters)

TARGET STYLE:
- Confident declarative statements
- Natural conversational flow
- Varied sentence structures
- Occasional contractions
- Specific over vague
- No question marks unless absolutely necessary

Text to rewrite:
{text}

Rewritten text:"""

        try:
            # FIX: Updated to valid model ID
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                temperature=0.4,
                messages=[{"role": "user", "content": prompt}]
            )

            return response.content[0].text.strip()

        except Exception as e:
            logger.error(f"Pattern-free humanization error: {e}")
            return f"Error during humanization: {str(e)}"

    # --------------------- Suggestions based on files ---------------------
    def get_humanization_suggestions(self, text: str) -> dict:
        if not self.ai_detector:
            return {"error": "AI detector not available"}
        
        detected_patterns = self.ai_detector.detect_ai_patterns(text)
        suggestions = {}
        
        for category, patterns in detected_patterns.items():
            category_suggestions = []
            for pattern in patterns:
                suggestion_data = {'pattern': pattern, 'alternatives': []}
                
                if pattern.lower() in self.excel_alternatives:
                    suggestion_data['alternatives'] = self.excel_alternatives[pattern.lower()][:3]
                    suggestion_data['source'] = 'Excel'
                elif pattern in self.ai_patterns.get('rhetorical_question_rewrites', {}):
                    suggestion_data['alternatives'] = [self.ai_patterns['rhetorical_question_rewrites'][pattern]]
                    suggestion_data['source'] = 'Rhetorical Rewrite'
                elif pattern.lower() in self.humanized_alternatives:
                    suggestion_data['alternatives'] = self.humanized_alternatives[pattern.lower()][:3]
                    suggestion_data['source'] = 'Generated'
                
                if suggestion_data['alternatives']:
                    category_suggestions.append(suggestion_data)
            
            if category_suggestions:
                suggestions[category] = category_suggestions
        return suggestions

# --------------------- Usage Example ---------------------
if __name__ == "__main__":
    humanizer = TextHumanizer(anthropic_api_key="dummy_key")
    print("Humanizer initialized (Test Mode)")
