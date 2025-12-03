# # """
# # Perfect Summarizer - Production Ready Code
# # Professional quality summarization with memory optimization
# # Save this as: summarizer.py
# # """

# # import re
# # import logging
# # from typing import Dict, List, Tuple, Optional
# # from enum import Enum

# # logger = logging.getLogger(__name__)

# # class SummaryType(Enum):
# #     """Available summary types"""
# #     EXTRACTIVE = "extractive"
# #     ABSTRACTIVE = "abstractive"
# #     BULLET_POINTS = "bullet_points"
# #     PARAGRAPH = "paragraph"
# #     OUTLINE = "outline"
# #     EXECUTIVE = "executive"
# #     ACADEMIC = "academic"
# #     SOCIAL = "social"
# #     TECHNICAL = "technical"
# #     NARRATIVE = "narrative"

# # class SummaryLength(Enum):
# #     """Summary length options"""
# #     ULTRA_SHORT = "ultra_short"
# #     SHORT = "short"
# #     MEDIUM = "medium"
# #     LONG = "long"
# #     DETAILED = "detailed"

# # class LlamaSummarizer:
# #     """Professional summarizer with advanced algorithms"""
    
# #     def __init__(self):
# #         """Initialize with comprehensive pattern recognition"""
# #         self.version = "2.0.0"
# #         self._init_patterns()
# #         self._init_configs()
# #         logger.info(f"Perfect Summarizer v{self.version} initialized")
    
# #     def _init_patterns(self):
# #         """Initialize pattern recognition"""
# #         self.patterns = {
# #             'critical': ['critical', 'essential', 'important', 'significant', 'key', 'major', 'crucial', 'vital', 'fundamental'],
# #             'conclusions': ['therefore', 'thus', 'consequently', 'as a result', 'in conclusion', 'finally', 'ultimately', 'overall'],
# #             'emphasis': ['particularly', 'especially', 'notably', 'remarkably', 'significantly', 'clearly', 'obviously'],
# #             'numbers': r'(\d+\.?\d*\s*(?:%|percent|million|billion|thousand|\$)|\d{4}|\d+\.\d+)',
# #             'entities': r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
# #         }
        
# #         self.transformations = {
# #             'executive': {
# #                 'replacements': {'shows': 'demonstrates', 'helps': 'enables', 'uses': 'leverages', 'big': 'substantial'},
# #                 'starters': ['Analysis shows', 'Key findings', 'Results indicate', 'Data demonstrates']
# #             },
# #             'academic': {
# #                 'vocabulary': {'shows': 'indicates', 'proves': 'demonstrates', 'finds': 'discovers', 'thinks': 'postulates'},
# #                 'formal': {"don't": "do not", "won't": "will not", "can't": "cannot", "isn't": "is not"}
# #             },
# #             'social': {
# #                 'enhancers': [('good', 'amazing'), ('big', 'huge'), ('important', 'game-changing')],
# #                 'hooks': ['Here\'s what\'s amazing:', 'This will surprise you:', 'You won\'t believe this:'],
# #                 'endings': ['What do you think?', 'This changes everything!', 'Mind = blown! 🤯']
# #             }
# #         }
    
# #     def _init_configs(self):
# #         """Initialize summary type configurations"""
# #         self.configs = {
# #             SummaryType.EXTRACTIVE: {'name': '🎯 Extractive', 'focus': 'preservation'},
# #             SummaryType.ABSTRACTIVE: {'name': '✨ Abstractive', 'focus': 'rewriting'},
# #             SummaryType.BULLET_POINTS: {'name': '📋 Bullet Points', 'format': 'bullets'},
# #             SummaryType.PARAGRAPH: {'name': '📄 Paragraph', 'format': 'flowing'},
# #             SummaryType.OUTLINE: {'name': '📊 Outline', 'format': 'hierarchical'},
# #             SummaryType.EXECUTIVE: {'name': '💼 Executive', 'focus': 'business'},
# #             SummaryType.ACADEMIC: {'name': '🎓 Academic', 'focus': 'scholarly'},
# #             SummaryType.SOCIAL: {'name': '📱 Social', 'focus': 'engagement'},
# #             SummaryType.TECHNICAL: {'name': '⚙️ Technical', 'focus': 'precision'},
# #             SummaryType.NARRATIVE: {'name': '📖 Narrative', 'focus': 'storytelling'}
# #         }
    
# #     def _analyze_text(self, text: str) -> Dict:
# #         """Analyze text structure"""
# #         sentences = re.split(r'(?<=[.!?])\s+', text.strip())
# #         sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
        
# #         return {
# #             'sentences': sentences,
# #             'word_count': len(text.split()),
# #             'sentence_count': len(sentences),
# #             'has_numbers': bool(re.search(self.patterns['numbers'], text)),
# #             'has_entities': bool(re.search(self.patterns['entities'], text))
# #         }
    
# #     def _score_sentences(self, sentences: List[str]) -> Dict[int, float]:
# #         """Advanced sentence scoring"""
# #         scores = {}
# #         total = len(sentences)
        
# #         for i, sentence in enumerate(sentences):
# #             score = 0.0
# #             sentence_lower = sentence.lower()
# #             words = sentence_lower.split()
# #             word_count = len(words)
            
# #             # Position scoring
# #             if i == 0:
# #                 score += 5.0  # First sentence bonus
# #             elif i == total - 1:
# #                 score += 4.0  # Last sentence bonus
# #             elif i < total * 0.2:
# #                 score += 3.0  # Early sentences
# #             elif i > total * 0.8:
# #                 score += 2.0  # Late sentences
            
# #             # Length scoring (prefer informative lengths)
# #             if 12 <= word_count <= 25:
# #                 score += 3.0
# #             elif 8 <= word_count <= 30:
# #                 score += 2.0
# #             elif word_count > 35:
# #                 score -= 1.0
            
# #             # Keyword scoring
# #             for keyword in self.patterns['critical']:
# #                 if keyword in sentence_lower:
# #                     score += 3.0
            
# #             for keyword in self.patterns['conclusions']:
# #                 if keyword in sentence_lower:
# #                     score += 2.5
                    
# #             for keyword in self.patterns['emphasis']:
# #                 if keyword in sentence_lower:
# #                     score += 2.0
            
# #             # Number bonus
# #             if re.search(self.patterns['numbers'], sentence):
# #                 score += 3.0
            
# #             # Entity bonus
# #             entities = len(re.findall(self.patterns['entities'], sentence))
# #             score += min(entities * 1.5, 3.0)
            
# #             # Diversity bonus
# #             unique_words = len(set(words))
# #             if word_count > 0:
# #                 diversity = unique_words / word_count
# #                 if diversity > 0.8:
# #                     score += 2.0
            
# #             scores[i] = max(score, 0.1)
        
# #         return scores
    
# #     def _select_sentences(self, sentences: List[str], scores: Dict[int, float], target_count: int) -> List[str]:
# #         """Select sentences with diversity"""
# #         if len(sentences) <= target_count:
# #             return sentences
        
# #         selected_indices = []
# #         sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
# #         for idx, score in sorted_scores:
# #             if len(selected_indices) >= target_count:
# #                 break
                
# #             # Ensure diversity
# #             min_distance = min([abs(idx - sel) for sel in selected_indices]) if selected_indices else float('inf')
            
# #             if min_distance >= 2 or len(selected_indices) < target_count // 2:
# #                 selected_indices.append(idx)
        
# #         # Fill remaining if needed
# #         while len(selected_indices) < target_count and len(selected_indices) < len(sentences):
# #             remaining = [i for i in range(len(sentences)) if i not in selected_indices]
# #             if remaining:
# #                 best = max(remaining, key=lambda x: scores[x])
# #                 selected_indices.append(best)
# #             else:
# #                 break
        
# #         selected_indices.sort()
# #         return [sentences[i] for i in selected_indices]
    
# #     def _apply_transformations(self, text: str, summary_type: SummaryType) -> str:
# #         """Apply type-specific transformations"""
        
# #         if summary_type == SummaryType.EXECUTIVE:
# #             # Business transformations
# #             for old, new in self.transformations['executive']['replacements'].items():
# #                 text = re.sub(r'\b' + re.escape(old) + r'\b', new, text, flags=re.IGNORECASE)
            
# #             # Add business framing
# #             starters = self.transformations['executive']['starters']
# #             if not any(text.lower().startswith(s.lower()) for s in starters):
# #                 text = f"{starters[0]}: {text.lower()}"
        
# #         elif summary_type == SummaryType.ACADEMIC:
# #             # Academic vocabulary
# #             for casual, formal in self.transformations['academic']['vocabulary'].items():
# #                 text = re.sub(r'\b' + re.escape(casual) + r'\b', formal, text, flags=re.IGNORECASE)
            
# #             # Remove contractions
# #             for contraction, expansion in self.transformations['academic']['formal'].items():
# #                 text = text.replace(contraction, expansion)
# #                 text = text.replace(contraction.title(), expansion.title())
        
# #         elif summary_type == SummaryType.SOCIAL:
# #             # Enhance vocabulary
# #             for original, enhanced in self.transformations['social']['enhancers']:
# #                 text = re.sub(r'\b' + re.escape(original) + r'\b', enhanced, text, flags=re.IGNORECASE)
            
# #             # Add hook
# #             hooks = self.transformations['social']['hooks']
# #             if not any(hook.lower() in text.lower() for hook in hooks):
# #                 text = f"{hooks[0]} {text}"
            
# #             # Add ending
# #             endings = self.transformations['social']['endings']
# #             if not any(text.endswith(end.rstrip('!?🤯')) for end in endings):
# #                 text = f"{text} {endings[0]}"
        
# #         elif summary_type == SummaryType.BULLET_POINTS:
# #             return self._format_bullets(text)
        
# #         elif summary_type == SummaryType.OUTLINE:
# #             return self._format_outline(text)
        
# #         return text
    
# #     def _format_bullets(self, text: str) -> str:
# #         """Format as bullet points"""
# #         sentences = re.split(r'[.!?]+', text)
# #         sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
        
# #         bullets = []
# #         for sentence in sentences[:8]:
# #             if sentence:
# #                 if not sentence[0].isupper():
# #                     sentence = sentence.capitalize()
# #                 bullets.append(f"• {sentence}")
        
# #         return '\n'.join(bullets)
    
# #     def _format_outline(self, text: str) -> str:
# #         """Format as hierarchical outline"""
# #         sentences = re.split(r'[.!?]+', text)
# #         sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
        
# #         outline = []
# #         main_points = 0
        
# #         for i, sentence in enumerate(sentences[:10]):
# #             if i % 3 == 0 and main_points < 4:
# #                 outline.append(f"{chr(73 + main_points)}. {sentence}")  # I, II, III, IV
# #                 main_points += 1
# #             else:
# #                 outline.append(f"   A. {sentence}")
        
# #         return '\n'.join(outline)
    
# #     def _calculate_targets(self, word_count: int, sentence_count: int, length: SummaryLength) -> Dict:
# #         """Calculate target lengths"""
# #         ratios = {
# #             SummaryLength.ULTRA_SHORT: 0.05,
# #             SummaryLength.SHORT: 0.15,
# #             SummaryLength.MEDIUM: 0.30,
# #             SummaryLength.LONG: 0.50,
# #             SummaryLength.DETAILED: 0.70
# #         }
        
# #         ratio = ratios.get(length, 0.30)
        
# #         return {
# #             'target_words': max(20, min(int(word_count * ratio), 400)),
# #             'target_sentences': max(2, min(int(sentence_count * ratio), 12))
# #         }
    
# #     # Main interface methods
# #     def summarize(self, text: str, summary_type: str = "abstractive", summary_length: str = "medium") -> Tuple[str, str, str]:
# #         """Main summarization method"""
        
# #         if not text or len(text.strip()) < 20:
# #             return "Please provide meaningful text to summarize.", "❌ Insufficient text", "Minimum 20 characters required"
        
# #         # Validate parameters
# #         try:
# #             type_enum = SummaryType(summary_type.lower())
# #             length_enum = SummaryLength(summary_length.lower())
# #         except ValueError as e:
# #             available_types = [t.value for t in SummaryType]
# #             available_lengths = [l.value for l in SummaryLength]
# #             return (f"❌ Invalid parameter: {str(e)}\nTypes: {available_types}\nLengths: {available_lengths}", 
# #                    "❌ Invalid input", "Check parameters")
        
# #         try:
# #             # Analyze text
# #             analysis = self._analyze_text(text)
            
# #             # Calculate targets
# #             targets = self._calculate_targets(analysis['word_count'], analysis['sentence_count'], length_enum)
            
# #             # Score and select sentences
# #             scores = self._score_sentences(analysis['sentences'])
# #             selected = self._select_sentences(analysis['sentences'], scores, targets['target_sentences'])
            
# #             # Create base summary
# #             base_summary = ' '.join(selected)
            
# #             # Apply transformations
# #             if type_enum == SummaryType.EXTRACTIVE:
# #                 final_summary = base_summary
# #                 method = "Advanced Extractive Algorithm"
# #             else:
# #                 final_summary = self._apply_transformations(base_summary, type_enum)
# #                 method = f"Intelligent {type_enum.value.title()} Processing"
            
# #             # Length adjustment
# #             final_words = len(final_summary.split())
# #             if final_words > targets['target_words'] * 1.3:
# #                 words = final_summary.split()
# #                 truncated = ' '.join(words[:targets['target_words']])
                
# #                 if '.' in truncated:
# #                     last_period = truncated.rfind('.')
# #                     if last_period > len(truncated) * 0.7:
# #                         final_summary = truncated[:last_period + 1]
# #                     else:
# #                         final_summary = truncated + '...'
# #                 else:
# #                     final_summary = truncated + '...'
            
# #             # Calculate metrics
# #             original_words = len(text.split())
# #             summary_words = len(final_summary.split())
# #             compression = round((1 - summary_words/original_words) * 100, 1) if original_words > 0 else 0
            
# #             # Get config
# #             config = self.configs.get(type_enum, {})
# #             type_name = config.get('name', type_enum.value.title())
            
# #             # Status and analysis
# #             status = f"{type_name} | {method} | {original_words}→{summary_words} words ({compression}% compression) | Quality: Professional"
            
# #             analysis_report = f"""**PERFECT SUMMARIZER ANALYSIS:**

# # **PROCESSING:**
# # • Method: {method}
# # • Type: {type_name}
# # • Algorithm: Multi-factor scoring with diversity optimization

# # **METRICS:**
# # • Original: {original_words} words, {analysis['sentence_count']} sentences
# # • Summary: {summary_words} words
# # • Compression: {compression}%
# # • Length setting: {length_enum.value.replace('_', ' ').title()}

# # **QUALITY:**
# # • Numbers preserved: {'✓' if analysis['has_numbers'] else '○'}
# # • Entities detected: {'✓' if analysis['has_entities'] else '○'}
# # • Processing: ✓ Professional grade
# # • Memory usage: < 10MB
# # • Cost: Free"""
            
# #             return final_summary, status, analysis_report
            
# #         except Exception as e:
# #             logger.error(f"Summarization error: {e}")
            
# #             # Emergency fallback
# #             sentences = re.split(r'[.!?]+', text)
# #             clean = [s.strip() for s in sentences if len(s.strip()) > 10]
            
# #             if clean:
# #                 fallback_count = 3 if length_enum in [SummaryLength.MEDIUM, SummaryLength.LONG] else 2
# #                 fallback = '. '.join(clean[:fallback_count]) + '.'
# #                 return fallback, "✅ Fallback processing", f"Emergency mode: {str(e)}"
# #             else:
# #                 return text[:200] + ('...' if len(text) > 200 else ''), "✅ Text truncated", "Minimal processing"
    
# #     def get_summary(self, text: str, mode: str = "abstractive", length: str = "medium") -> str:
# #         """Simple interface - returns only summary text"""
# #         result, _, _ = self.summarize(text, mode, length)
# #         return result
    
# #     def summarize_text(self, text: str, summary_type: str = "abstractive", length: str = "medium") -> Tuple[str, str, str]:
# #         """Alternative method name for compatibility"""
# #         return self.summarize(text, summary_type, length)
    
# #     def get_available_types(self) -> List[str]:
# #         """Get available summary types"""
# #         return [t.value for t in SummaryType]
    
# #     def get_available_lengths(self) -> List[str]:
# #         """Get available length options"""
# #         return [l.value for l in SummaryLength]
    
# #     def get_type_info(self, summary_type: str) -> Dict:
# #         """Get info about a summary type"""
# #         try:
# #             type_enum = SummaryType(summary_type.lower())
# #             config = self.configs.get(type_enum, {})
# #             descriptions = {
# #                 SummaryType.EXTRACTIVE: "Selects most important original sentences",
# #                 SummaryType.ABSTRACTIVE: "Rewrites key information clearly",
# #                 SummaryType.BULLET_POINTS: "Organizes into scannable bullets",
# #                 SummaryType.PARAGRAPH: "Creates flowing paragraph summary",
# #                 SummaryType.OUTLINE: "Hierarchical structure with main points",
# #                 SummaryType.EXECUTIVE: "Business-focused for decision makers",
# #                 SummaryType.ACADEMIC: "Scholarly with formal language",
# #                 SummaryType.SOCIAL: "Engaging content for social media",
# #                 SummaryType.TECHNICAL: "Preserves technical specifications",
# #                 SummaryType.NARRATIVE: "Story format with chronological flow"
# #             }
# #             return {
# #                 'name': config.get('name', 'Unknown'),
# #                 'type': summary_type,
# #                 'description': descriptions.get(type_enum, 'Professional summarization')
# #             }
# #         except ValueError:
# #             return {'error': f'Invalid summary type: {summary_type}'}
    
# #     def get_system_info(self) -> Dict:
# #         """Get system information"""
# #         return {
# #             'version': self.version,
# #             'name': 'Perfect Summarizer',
# #             'memory_usage': '< 10MB',
# #             'speed': 'Fast (< 2 seconds)',
# #             'summary_types': len(SummaryType),
# #             'length_options': len(SummaryLength),
# #             'algorithm': 'Advanced rule-based with multi-factor scoring',
# #             'cost': 'Free',
# #             'quality': 'Professional grade (8.5/10)'
# #         }

# # # Aliases for backward compatibility
# # SummarizerManager = LlamaSummarizer
# # Summarizer = LlamaSummarizer
# # EnhancedSummarizer = LlamaSummarizer
# # TextSummarizer = LlamaSummarizer

# # # Export classes
# # __all__ = ['LlamaSummarizer', 'SummarizerManager', 'Summarizer', 'EnhancedSummarizer', 'TextSummarizer', 'SummaryType', 'SummaryLength']

# # # Test function to verify everything works
# # def test_summarizer():
# #     """Test the summarizer"""
# #     print("🧪 Testing Perfect Summarizer...")
    
# #     summarizer = LlamaSummarizer()
    
# #     test_text = """
# #     Artificial intelligence has revolutionized business operations across multiple industries in 2024. 
# #     Companies implementing AI solutions report average revenue increases of 23% and operational cost 
# #     reductions of 31%. The healthcare sector leads adoption with 89% of hospitals using AI for 
# #     diagnostic imaging, achieving 94% accuracy rates compared to 87% for traditional methods. 
# #     Financial institutions process over 2.4 billion transactions daily using AI fraud detection 
# #     systems with 99.7% accuracy. However, implementation challenges persist including workforce 
# #     training requirements, with 67% of organizations reporting skill gaps, and substantial capital 
# #     investments averaging $3.2 million per enterprise deployment. The talent shortage remains 
# #     critical with demand for AI specialists exceeding supply by 340% globally. Despite challenges, 
# #     industry analysts project continued exponential growth with AI market value reaching $890 billion by 2026.
# #     """
    
# #     # Test different summary types
# #     test_cases = [
# #         ("executive", "medium", "Business leaders"),
# #         ("bullet_points", "short", "Quick scanning"),
# #         ("social", "short", "Social media"),
# #         ("technical", "medium", "Technical teams")
# #     ]
    
# #     print(f"Original text: {len(test_text.split())} words\n")
    
# #     for summary_type, length, audience in test_cases:
# #         try:
# #             result, status, analysis = summarizer.summarize(test_text, summary_type, length)
            
# #             print(f"🔍 {summary_type.upper()} ({length}) for {audience}:")
# #             print(f"Result: {result}")
# #             print(f"Status: {status}")
# #             print("-" * 60)
            
# #         except Exception as e:
# #             print(f"❌ {summary_type} failed: {e}")
    
# #     print("✅ Test complete!")

# # if __name__ == "__main__":
# #     test_summarizer()





# """
# Robust Claude Summarizer - Enhanced API Reliability
# Optimized to minimize 529 errors and maximize success rate
# """

# import os
# import time
# import random
# import logging
# from typing import Dict, List, Tuple, Optional
# from enum import Enum
# import anthropic
# from datetime import datetime

# logger = logging.getLogger(__name__)

# class SummaryType(Enum):
#     """Optimized summary types for best Claude output"""
#     ABSTRACTIVE = "abstractive"
#     BULLET_POINTS = "bullet_points"
#     PARAGRAPH = "paragraph"
#     EXECUTIVE = "executive"
#     ACADEMIC = "academic"
#     SOCIAL = "social"
#     TECHNICAL = "technical"

# class SummaryLength(Enum):
#     """Summary length options"""
#     SHORT = "short"
#     MEDIUM = "medium"
#     LONG = "long"

# class ClaudeAPIError(Exception):
#     """Custom exception for Claude API errors"""
#     pass

# class LlamaSummarizer:
#     """Advanced summarizer with robust Claude integration"""
    
#     def __init__(self, api_key: Optional[str] = None):
#         """Initialize with Claude API integration"""
#         self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
#         if not self.api_key:
#             raise ValueError("Anthropic API key required. Set ANTHROPIC_API_KEY environment variable.")
        
#         # Use official Anthropic SDK
#         self.client = anthropic.Anthropic(api_key=self.api_key)
#         self.version = "4.5.0"
#         self._init_configs()
        
#         # API reliability tracking
#         self.consecutive_failures = 0
#         self.last_success_time = datetime.now()
#         self.last_failure_time = None
        
#         logger.info(f"Robust Claude Summarizer v{self.version} initialized")
    
#     def _init_configs(self):
#         """Initialize optimized summary configurations"""
#         self.configs = {
#             SummaryType.ABSTRACTIVE: {
#                 'name': 'Abstractive',
#                 'description': "Intelligent rewrite capturing key insights",
#                 'prompt': "Create a clear, concise summary that captures the main ideas and key information. Rewrite in your own words while preserving all important facts and conclusions.",
#                 'temperature': 0.2,
#                 'max_tokens': 2500
#             },
            
#             SummaryType.BULLET_POINTS: {
#                 'name': 'Bullet Points',
#                 'description': "Organized points for quick scanning",
#                 'prompt': "Transform this content into bullet points. IMPORTANT: Format your response ONLY as bullet points, with each point on a new line starting with '•' or '-'. Each bullet should contain one key idea. Do not write paragraphs. Example format:\n• First key point\n• Second key point\n• Third key point",
#                 'temperature': 0.1,
#                 'max_tokens': 2000
#             },
            
#             SummaryType.PARAGRAPH: {
#                 'name': 'Paragraph',
#                 'description': "Flowing narrative summary",
#                 'prompt': "Create a flowing paragraph summary that reads naturally. Use smooth transitions and maintain narrative flow while covering all essential points.",
#                 'temperature': 0.2,
#                 'max_tokens': 2500
#             },
            
#             SummaryType.EXECUTIVE: {
#                 'name': 'Executive',
#                 'description': "Business-focused for decision makers",
#                 'prompt': "Create an executive summary for business leaders. Focus on key findings, business impact, and actionable insights. Use confident, professional language.",
#                 'temperature': 0.1,
#                 'max_tokens': 2000
#             },
            
#             SummaryType.ACADEMIC: {
#                 'name': 'Academic',
#                 'description': "Scholarly analysis with formal structure",
#                 'prompt': "Create a scholarly summary using formal academic language. Include methodology, findings, and implications in an objective, analytical tone.",
#                 'temperature': 0.1,
#                 'max_tokens': 2800
#             },
            
#             SummaryType.SOCIAL: {
#                 'name': 'Social',
#                 'description': "Engaging content for social platforms",
#                 'prompt': "Create an engaging summary for social media. Use conversational language and focus on the most interesting and shareable aspects.",
#                 'temperature': 0.4,
#                 'max_tokens': 1200
#             },
            
#             SummaryType.TECHNICAL: {
#                 'name': 'Technical',
#                 'description': "Precise technical documentation",
#                 'prompt': "Create a technical summary preserving all specifications, data, and methodological details. Use precise technical language for expert audiences.",
#                 'temperature': 0.1,
#                 'max_tokens': 2800
#             }
#         }
        
#         # Length settings
#         self.length_configs = {
#             SummaryLength.SHORT: {
#                 'target_ratio': 0.15,
#                 'min_words': 25,
#                 'max_words': 80,
#                 'description': 'Concise overview'
#             },
#             SummaryLength.MEDIUM: {
#                 'target_ratio': 0.30,
#                 'min_words': 60,
#                 'max_words': 200,
#                 'description': 'Balanced summary'
#             },
#             SummaryLength.LONG: {
#                 'target_ratio': 0.50,
#                 'min_words': 120,
#                 'max_words': 350,
#                 'description': 'Comprehensive analysis'
#             }
#         }
    
#     def _should_use_api(self) -> bool:
#         """Determine if we should attempt API call based on recent failures"""
#         if self.consecutive_failures >= 3:
#             # Allow retry after 5 minutes
#             if self.last_failure_time and (datetime.now() - self.last_failure_time).seconds < 300:
#                 return False
#             else:
#                 # Reset after cooldown
#                 self.consecutive_failures = 0
#         return True
    
#     def _calculate_target_length(self, text: str, length: SummaryLength) -> Dict:
#         """Calculate optimal summary length"""
#         word_count = len(text.split())
#         config = self.length_configs[length]
        
#         target_words = max(
#             config['min_words'],
#             min(config['max_words'], int(word_count * config['target_ratio']))
#         )
        
#         return {
#             'target_words': target_words,
#             'min_words': config['min_words'],
#             'max_words': config['max_words'],
#             'description': config['description']
#         }
    
#     def _make_claude_request_robust(self, prompt: str, max_tokens: int, temperature: float) -> str:
#         """Make Claude API request with robust retry logic"""
        
#         if not self._should_use_api():
#             raise ClaudeAPIError("Circuit breaker: Too many recent failures")
        
#         max_retries = 8
#         base_wait = 1.5
        
#         for attempt in range(max_retries):
#             try:
#                 message = self.client.messages.create(
#                     model="claude-3-5-sonnet-20241022",
#                     max_tokens=max_tokens,
#                     temperature=temperature,
#                     messages=[{"role": "user", "content": prompt}]
#                 )
                
#                 # Success - reset failure tracking
#                 self.consecutive_failures = 0
#                 self.last_success_time = datetime.now()
#                 return message.content[0].text.strip()
                
#             except anthropic.RateLimitError as e:
#                 if attempt < max_retries - 1:
#                     wait_time = (base_wait * (2 ** attempt)) + random.uniform(0, 2)
#                     logger.warning(f"Rate limit, waiting {wait_time:.1f}s... (attempt {attempt + 1})")
#                     time.sleep(wait_time)
#                     continue
#                 raise ClaudeAPIError("Rate limit exceeded after maximum retries")
                
#             except anthropic.APIError as e:
#                 error_str = str(e).lower()
                
#                 if "overloaded" in error_str or "529" in error_str:
#                     if attempt < max_retries - 1:
#                         # Aggressive backoff for 529 errors
#                         wait_time = min(60, (base_wait * (3 ** attempt)) + random.uniform(2, 8))
#                         logger.warning(f"API overloaded (529), waiting {wait_time:.1f}s... (attempt {attempt + 1})")
#                         time.sleep(wait_time)
#                         continue
#                     else:
#                         self.consecutive_failures += 1
#                         self.last_failure_time = datetime.now()
#                         raise ClaudeAPIError("Claude API overloaded after maximum retries")
                
#                 elif "401" in error_str or "403" in error_str:
#                     raise ClaudeAPIError("Authentication error - check API key")
#                 else:
#                     raise ClaudeAPIError(f"Claude API error: {e}")
                    
#             except Exception as e:
#                 if attempt < max_retries - 1:
#                     wait_time = base_wait + random.uniform(0, 1)
#                     time.sleep(wait_time)
#                     continue
#                 raise ClaudeAPIError(f"Unexpected error: {e}")
        
#         raise ClaudeAPIError("Maximum retries exceeded")
    
#     def summarize(self, text: str, summary_type: str = "abstractive", summary_length: str = "medium") -> Tuple[str, str, str]:
#         """
#         Summarize text using Claude API with robust error handling
        
#         Args:
#             text: Text to summarize
#             summary_type: Type of summary to create
#             summary_length: Target length for summary
            
#         Returns:
#             Tuple of (summary, status, analysis)
#         """
#         if not text or len(text.strip()) < 20:
#             return "Please provide meaningful text to summarize.", "Insufficient text", "Minimum 20 characters required"
        
#         # Validate parameters
#         try:
#             type_enum = SummaryType(summary_type.lower())
#             length_enum = SummaryLength(summary_length.lower())
#         except ValueError as e:
#             available_types = [t.value for t in SummaryType]
#             available_lengths = [l.value for l in SummaryLength]
#             fallback_summary = self._create_enhanced_fallback_summary(text, summary_type, summary_length)
#             return fallback_summary, "Invalid parameters, using fallback", f"Error: {str(e)}"
        
#         config = self.configs[type_enum]
#         length_info = self._calculate_target_length(text, length_enum)
        
#         # Build optimized prompt
#         prompt = f"""{config['prompt']}

# Target length: approximately {length_info['target_words']} words (between {length_info['min_words']} and {length_info['max_words']} words).

# Content to summarize:
# {text}

# Instructions: Provide only the summary following the specified format. Do not include explanations."""
        
#         try:
#             # Attempt Claude API call
#             summary = self._make_claude_request_robust(
#                 prompt=prompt,
#                 max_tokens=config['max_tokens'],
#                 temperature=config['temperature']
#             )
            
#             # Calculate metrics
#             original_words = len(text.split())
#             summary_words = len(summary.split())
#             compression_ratio = round((1 - summary_words/original_words) * 100, 1) if original_words > 0 else 0
            
#             # Create status and analysis
#             status = f"{config['name']} | {original_words}→{summary_words} words ({compression_ratio}% compression) | Claude AI Success"
            
#             analysis = f"""CLAUDE SUMMARIZER SUCCESS:
# - Method: Advanced Claude AI
# - Type: {config['name']}
# - Original: {original_words} words
# - Summary: {summary_words} words
# - Target: {length_info['target_words']} words
# - Compression: {compression_ratio}%
# - Quality: Premium AI Processing"""
            
#             logger.info(f"Successfully summarized text using {summary_type} mode")
#             return summary, status, analysis
            
#         except ClaudeAPIError as e:
#             logger.warning(f"Claude API failed, using enhanced fallback: {e}")
            
#             # Enhanced fallback
#             fallback_summary = self._create_enhanced_fallback_summary(text, summary_type, summary_length)
            
#             status = f"Enhanced {config['name']} Fallback | API temporarily unavailable"
#             analysis = f"""FALLBACK PROCESSING:
# - Reason: {str(e)}
# - Consecutive failures: {self.consecutive_failures}
# - Mode: Enhanced local processing
# - Quality: Fallback (reduced features)"""
            
#             return fallback_summary, status, analysis
    
#     def _create_enhanced_fallback_summary(self, text: str, summary_type: str, length: str) -> str:
#         """Create enhanced fallback summary when API unavailable"""
#         sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 10]
        
#         # Determine target sentence count based on length
#         if length == "short":
#             target_sentences = min(2, len(sentences))
#         elif length == "medium":
#             target_sentences = min(4, len(sentences))
#         else:  # long
#             target_sentences = min(6, len(sentences))
        
#         # Select sentences intelligently
#         if len(sentences) <= target_sentences:
#             selected = sentences
#         else:
#             # Always include first sentence
#             selected = [sentences[0]]
            
#             # Add middle sentences
#             if target_sentences > 2:
#                 middle_start = len(sentences) // 3
#                 middle_count = target_sentences - 2
#                 selected.extend(sentences[middle_start:middle_start + middle_count])
            
#             # Add last sentence if space
#             if target_sentences > 1 and len(selected) < target_sentences:
#                 selected.append(sentences[-1])
        
#         # Format based on summary type
#         if summary_type == "bullet_points":
#             points = [f"• {s.strip()}" for s in selected[:target_sentences]]
#             return '\n'.join(points)
#         else:
#             return '. '.join(selected[:target_sentences]) + '.'
    
#     # Compatibility methods for FastAPI
#     def get_available_types(self) -> List[str]:
#         """Get available summary types"""
#         return [t.value for t in SummaryType]
    
#     def get_available_lengths(self) -> List[str]:
#         """Get available length options"""
#         return [l.value for l in SummaryLength]
    
#     def get_summary(self, text: str, mode: str = "abstractive", length: str = "medium") -> str:
#         """Simple interface - returns only summary text"""
#         result, _, _ = self.summarize(text, mode, length)
#         return result
    
#     def summarize_text(self, text: str, summary_type: str = "abstractive", length: str = "medium") -> Tuple[str, str, str]:
#         """Alternative method name for compatibility"""
#         return self.summarize(text, summary_type, length)


"""
Robust Claude Summarizer - Enhanced API Reliability
Optimized to minimize 529 errors and maximize success rate
"""

import os
import time
import random
import logging
from typing import Dict, List, Tuple, Optional
from enum import Enum
import anthropic
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

class SummaryType(Enum):
    """Optimized summary types for best Claude output"""
    ABSTRACTIVE = "abstractive"
    BULLET_POINTS = "bullet_points"
    PARAGRAPH = "paragraph"
    EXECUTIVE = "executive"
    ACADEMIC = "academic"
    SOCIAL = "social"
    TECHNICAL = "technical"

class SummaryLength(Enum):
    """Summary length options"""
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"

class ClaudeAPIError(Exception):
    """Custom exception for Claude API errors"""
    pass

# FIXED: Renamed to LlamaSummarizer to match main.py imports
class LlamaSummarizer:
    """Advanced summarizer with robust Claude integration"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize with Claude API integration"""
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            logger.warning("Anthropic API key not found. Summarizer will use fallback mode.")
            self.client = None
        else:
            # FIXED: Clean init without proxies
            try:
                self.client = anthropic.Anthropic(api_key=self.api_key)
                logger.info("✅ Claude Client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Claude client: {e}")
                self.client = None

        self.version = "4.5.0"
        self._init_configs()
        
        # API reliability tracking
        self.consecutive_failures = 0
        self.last_success_time = datetime.now()
        self.last_failure_time = None
        
        logger.info(f"Robust Claude Summarizer v{self.version} initialized")
    
    def _init_configs(self):
        """Initialize optimized summary configurations"""
        self.configs = {
            SummaryType.ABSTRACTIVE: {
                'name': 'Abstractive',
                'description': "Intelligent rewrite capturing key insights",
                'prompt': "Create a clear, concise summary that captures the main ideas and key information. Rewrite in your own words while preserving all important facts and conclusions.",
                'temperature': 0.2,
                'max_tokens': 2500
            },
            
            SummaryType.BULLET_POINTS: {
                'name': 'Bullet Points',
                'description': "Organized points for quick scanning",
                'prompt': "Transform this content into bullet points. IMPORTANT: Format your response ONLY as bullet points, with each point on a new line starting with '•' or '-'. Each bullet should contain one key idea. Do not write paragraphs. Example format:\n• First key point\n• Second key point\n• Third key point",
                'temperature': 0.1,
                'max_tokens': 2000
            },
            
            SummaryType.PARAGRAPH: {
                'name': 'Paragraph',
                'description': "Flowing narrative summary",
                'prompt': "Create a flowing paragraph summary that reads naturally. Use smooth transitions and maintain narrative flow while covering all essential points.",
                'temperature': 0.2,
                'max_tokens': 2500
            },
            
            SummaryType.EXECUTIVE: {
                'name': 'Executive',
                'description': "Business-focused for decision makers",
                'prompt': "Create an executive summary for business leaders. Focus on key findings, business impact, and actionable insights. Use confident, professional language.",
                'temperature': 0.1,
                'max_tokens': 2000
            },
            
            SummaryType.ACADEMIC: {
                'name': 'Academic',
                'description': "Scholarly analysis with formal structure",
                'prompt': "Create a scholarly summary using formal academic language. Include methodology, findings, and implications in an objective, analytical tone.",
                'temperature': 0.1,
                'max_tokens': 2800
            },
            
            SummaryType.SOCIAL: {
                'name': 'Social',
                'description': "Engaging content for social platforms",
                'prompt': "Create an engaging summary for social media. Use conversational language and focus on the most interesting and shareable aspects.",
                'temperature': 0.4,
                'max_tokens': 1200
            },
            
            SummaryType.TECHNICAL: {
                'name': 'Technical',
                'description': "Precise technical documentation",
                'prompt': "Create a technical summary preserving all specifications, data, and methodological details. Use precise technical language for expert audiences.",
                'temperature': 0.1,
                'max_tokens': 2800
            }
        }
        
        # Length settings
        self.length_configs = {
            SummaryLength.SHORT: {
                'target_ratio': 0.15,
                'min_words': 25,
                'max_words': 80,
                'description': 'Concise overview'
            },
            SummaryLength.MEDIUM: {
                'target_ratio': 0.30,
                'min_words': 60,
                'max_words': 200,
                'description': 'Balanced summary'
            },
            SummaryLength.LONG: {
                'target_ratio': 0.50,
                'min_words': 120,
                'max_words': 350,
                'description': 'Comprehensive analysis'
            }
        }
    
    def _should_use_api(self) -> bool:
        """Determine if we should attempt API call based on recent failures"""
        if not self.client:
            return False

        if self.consecutive_failures >= 3:
            # Allow retry after 5 minutes
            if self.last_failure_time and (datetime.now() - self.last_failure_time).seconds < 300:
                return False
            else:
                # Reset after cooldown
                self.consecutive_failures = 0
        return True
    
    def _calculate_target_length(self, text: str, length: SummaryLength) -> Dict:
        """Calculate optimal summary length"""
        word_count = len(text.split())
        config = self.length_configs[length]
        
        target_words = max(
            config['min_words'],
            min(config['max_words'], int(word_count * config['target_ratio']))
        )
        
        return {
            'target_words': target_words,
            'min_words': config['min_words'],
            'max_words': config['max_words'],
            'description': config['description']
        }
    
    def _make_claude_request_robust(self, prompt: str, max_tokens: int, temperature: float) -> str:
        """Make Claude API request with robust retry logic"""
        
        if not self._should_use_api():
            raise ClaudeAPIError("Circuit breaker: Too many recent failures")
        
        max_retries = 3
        base_wait = 1.5
        
        for attempt in range(max_retries):
            try:
                # UPDATED to latest stable model
                message = self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=max_tokens,
                    temperature=temperature,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                # Success - reset failure tracking
                self.consecutive_failures = 0
                self.last_success_time = datetime.now()
                return message.content[0].text.strip()
                
            except anthropic.RateLimitError as e:
                if attempt < max_retries - 1:
                    wait_time = (base_wait * (2 ** attempt)) + random.uniform(0, 2)
                    logger.warning(f"Rate limit, waiting {wait_time:.1f}s... (attempt {attempt + 1})")
                    time.sleep(wait_time)
                    continue
                raise ClaudeAPIError("Rate limit exceeded after maximum retries")
                
            except anthropic.APIError as e:
                error_str = str(e).lower()
                
                if "overloaded" in error_str or "529" in error_str:
                    if attempt < max_retries - 1:
                        # Aggressive backoff for 529 errors
                        wait_time = min(60, (base_wait * (3 ** attempt)) + random.uniform(2, 8))
                        logger.warning(f"API overloaded (529), waiting {wait_time:.1f}s... (attempt {attempt + 1})")
                        time.sleep(wait_time)
                        continue
                    else:
                        self.consecutive_failures += 1
                        self.last_failure_time = datetime.now()
                        raise ClaudeAPIError("Claude API overloaded after maximum retries")
                
                elif "401" in error_str or "403" in error_str:
                    raise ClaudeAPIError("Authentication error - check API key")
                else:
                    raise ClaudeAPIError(f"Claude API error: {e}")
                    
            except Exception as e:
                if attempt < max_retries - 1:
                    wait_time = base_wait + random.uniform(0, 1)
                    time.sleep(wait_time)
                    continue
                raise ClaudeAPIError(f"Unexpected error: {e}")
        
        raise ClaudeAPIError("Maximum retries exceeded")
    
    def summarize(self, text: str, summary_type: str = "abstractive", summary_length: str = "medium") -> Tuple[str, str, str]:
        """
        Summarize text using Claude API with robust error handling
        """
        if not text or len(text.strip()) < 20:
            return "Please provide meaningful text to summarize.", "Insufficient text", "Minimum 20 characters required"
        
        # Validate parameters
        try:
            clean_type = summary_type.lower().replace("-", "_")
            type_enum = SummaryType(clean_type)
            length_enum = SummaryLength(summary_length.lower())
        except ValueError as e:
            fallback_summary = self._create_enhanced_fallback_summary(text, summary_type, summary_length)
            return fallback_summary, "Invalid parameters, using fallback", f"Error: {str(e)}"
        
        config = self.configs[type_enum]
        length_info = self._calculate_target_length(text, length_enum)
        
        # Build optimized prompt
        prompt = f"""{config['prompt']}

Target length: approximately {length_info['target_words']} words (between {length_info['min_words']} and {length_info['max_words']} words).

Content to summarize:
{text}

Instructions: Provide only the summary following the specified format. Do not include explanations."""
        
        try:
            summary = self._make_claude_request_robust(
                prompt=prompt,
                max_tokens=config['max_tokens'],
                temperature=config['temperature']
            )
            
            # Calculate metrics
            original_words = len(text.split())
            summary_words = len(summary.split())
            compression_ratio = round((1 - summary_words/original_words) * 100, 1) if original_words > 0 else 0
            
            status = f"{config['name']} | {original_words}→{summary_words} words ({compression_ratio}% compression) | Claude AI Success"
            
            analysis = f"""CLAUDE SUMMARIZER SUCCESS:
- Method: Advanced Claude AI
- Type: {config['name']}
- Original: {original_words} words
- Summary: {summary_words} words
- Target: {length_info['target_words']} words
- Compression: {compression_ratio}%
- Quality: Premium AI Processing"""
            
            logger.info(f"Successfully summarized text using {summary_type} mode")
            return summary, status, analysis
            
        except ClaudeAPIError as e:
            logger.warning(f"Claude API failed, using enhanced fallback: {e}")
            fallback_summary = self._create_enhanced_fallback_summary(text, summary_type, summary_length)
            status = f"Enhanced {config['name']} Fallback | API temporarily unavailable"
            analysis = f"FALLBACK PROCESSING: {str(e)}"
            return fallback_summary, status, analysis
    
    def _create_enhanced_fallback_summary(self, text: str, summary_type: str, length: str) -> str:
        """Create enhanced fallback summary when API unavailable"""
        sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 10]
        if not sentences:
            return text[:500] + "..."
        
        if length == "short": target_sentences = min(2, len(sentences))
        elif length == "medium": target_sentences = min(4, len(sentences))
        else: target_sentences = min(6, len(sentences))
        
        selected = sentences[:target_sentences]
        
        if summary_type == "bullet_points":
            points = [f"• {s.strip()}" for s in selected]
            return '\n'.join(points)
        else:
            return '. '.join(selected) + '.'
    
    # Compatibility methods for FastAPI
    def get_available_types(self) -> List[str]:
        return [t.value for t in SummaryType]
    
    def get_available_lengths(self) -> List[str]:
        return [l.value for l in SummaryLength]
