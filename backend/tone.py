# # """
# # Tone Modes Module
# # Handles all tone-related functionality for the Text Humanizer
# # """

# # from enum import Enum
# # from typing import Dict, List, Optional
# # import logging

# # logger = logging.getLogger(__name__)

# # class ToneMode(Enum):
# #     """Available tone modes for text humanization"""
# #     STANDARD = "standard"
# #     FLUENCY = "fluency"
# #     FORMAL = "formal"
# #     SIMPLE = "simple"
# #     CREATIVE = "creative"
# #     ACADEMIC = "academic"
# #     EXPAND = "expand"
# #     SHORTEN = "shorten"
# #     HUMANIZE = "humanize"

# # class ToneManager:
# #     """Manages tone modes, prompts, and tone-specific logic"""
    
# #     def __init__(self):
# #         self.tone_configs = self._load_tone_configurations()
# #         logger.info(f"✅ Tone Manager initialized with {len(self.tone_configs)} modes")
    
# #     def _load_tone_configurations(self) -> Dict[ToneMode, Dict]:
# #         """Load all tone mode configurations"""
# #         return {
# #             ToneMode.STANDARD: {
# #                 "name": "🎯 Standard",
# #                 "description": "Neutral rewrite with small tweaks in structure and vocabulary",
# #                 "category": "General",
# #                 "use_cases": ["Default option", "Balanced improvements", "Maintain original tone"],
# #                 "pattern_aware": True,
# #                 "prompt": self._get_standard_prompt(),
# #                 "max_tokens": 4000,
# #                 "temperature": 0.3
# #             },
            
# #             ToneMode.FLUENCY: {
# #                 "name": "📖 Fluency",
# #                 "description": "Focus on smooth readability and natural flow",
# #                 "category": "Readability",
# #                 "use_cases": ["Fix awkward phrasing", "Improve sentence flow", "Grammar corrections"],
# #                 "pattern_aware": True,
# #                 "prompt": self._get_fluency_prompt(),
# #                 "max_tokens": 4000,
# #                 "temperature": 0.2
# #             },
            
# #             ToneMode.FORMAL: {
# #                 "name": "👔 Formal",
# #                 "description": "Polished, professional tone for business contexts",
# #                 "category": "Professional",
# #                 "use_cases": ["Business emails", "Reports", "Official documents"],
# #                 "pattern_aware": False,
# #                 "prompt": self._get_formal_prompt(),
# #                 "max_tokens": 4000,
# #                 "temperature": 0.1
# #             },
            
# #             ToneMode.SIMPLE: {
# #                 "name": "🔍 Simple",
# #                 "description": "Break down complex text into plain, easy language",
# #                 "category": "Accessibility",
# #                 "use_cases": ["Beginner-friendly content", "Technical explanations", "Clear communication"],
# #                 "pattern_aware": False,
# #                 "prompt": self._get_simple_prompt(),
# #                 "max_tokens": 4000,
# #                 "temperature": 0.2
# #             },
            
# #             ToneMode.CREATIVE: {
# #                 "name": "🎨 Creative",
# #                 "description": "Add uniqueness, style, and engaging elements",
# #                 "category": "Creative",
# #                 "use_cases": ["Blog posts", "Storytelling", "Marketing content", "Social media"],
# #                 "pattern_aware": False,
# #                 "prompt": self._get_creative_prompt(),
# #                 "max_tokens": 4000,
# #                 "temperature": 0.7
# #             },
            
# #             ToneMode.ACADEMIC: {
# #                 "name": "🎓 Academic",
# #                 "description": "Scholarly style with precise, technical vocabulary",
# #                 "category": "Academic",
# #                 "use_cases": ["Research papers", "Essays", "Academic reports", "Scholarly work"],
# #                 "pattern_aware": False,
# #                 "prompt": self._get_academic_prompt(),
# #                 "max_tokens": 4000,
# #                 "temperature": 0.1
# #             },
            
# #             ToneMode.EXPAND: {
# #                 "name": "📈 Expand",
# #                 "description": "Add detail, examples, and comprehensive explanations",
# #                 "category": "Content Development",
# #                 "use_cases": ["Add context", "Detailed explanations", "Content writing"],
# #                 "pattern_aware": False,
# #                 "prompt": self._get_expand_prompt(),
# #                 "max_tokens": 6000,
# #                 "temperature": 0.4
# #             },
            
# #             ToneMode.SHORTEN: {
# #                 "name": "✂️ Shorten",
# #                 "description": "Condense text while preserving key information",
# #                 "category": "Concision",
# #                 "use_cases": ["Summaries", "Social media posts", "Headlines", "Quick overviews"],
# #                 "pattern_aware": False,
# #                 "prompt": self._get_shorten_prompt(),
# #                 "max_tokens": 2000,
# #                 "temperature": 0.2
# #             },
            
# #             ToneMode.HUMANIZE: {
# #                 "name": "🤝 Humanize",
# #                 "description": "Add natural imperfections and human-like flow",
# #                 "category": "AI Detection",
# #                 "use_cases": ["Bypass AI detection", "Natural writing", "Human-like content"],
# #                 "pattern_aware": True,
# #                 "prompt": self._get_humanize_prompt(),
# #                 "max_tokens": 4000,
# #                 "temperature": 0.5
# #             },
            

# #         }
    
# #     def _get_standard_prompt(self) -> str:
# #         return """Rewrite this text with neutral, balanced improvements. Make small but meaningful changes to:
# # - Fix awkward phrasing while keeping the original tone
# # - Improve sentence structure without dramatic changes
# # - Replace obvious AI patterns with natural alternatives
# # - Maintain the author's intended voice and style

# # Focus on clarity and readability while keeping changes minimal."""
    
# #     def _get_fluency_prompt(self) -> str:
# #         return """Rewrite this text for maximum fluency and readability. Focus on:
# # - Smooth sentence flow and natural transitions
# # - Fix grammar issues and awkward phrasing
# # - Improve rhythm and pacing
# # - Remove choppy or robotic language
# # - Make it flow like natural speech

# # Prioritize readability and natural language flow above all else."""
    
# #     def _get_formal_prompt(self) -> str:
# #         return """Rewrite this text in a formal, professional tone suitable for business communication:
# # - Use precise, professional vocabulary
# # - Maintain respectful and authoritative tone
# # - Structure content logically and clearly
# # - Remove casual language and contractions
# # - Ensure appropriate business etiquette

# # Perfect for emails, reports, and official documents."""
    
# #     def _get_simple_prompt(self) -> str:
# #         return """Rewrite this text in simple, plain language that anyone can understand:
# # - Use common, everyday words instead of complex terms
# # - Break down long sentences into shorter ones
# # - Explain technical concepts in simple terms
# # - Remove jargon and complicated phrases
# # - Make it accessible to beginners

# # Aim for clarity and simplicity above all else."""
    
# #     def _get_creative_prompt(self) -> str:
# #         return """Rewrite this text with creative flair and engaging style:
# # - Add vivid metaphors and imagery where appropriate
# # - Use varied and interesting vocabulary
# # - Create engaging hooks and compelling language
# # - Add personality and unique voice
# # - Make it memorable and distinctive

# # Perfect for blogs, storytelling, and marketing content."""
    
# #     def _get_academic_prompt(self) -> str:
# #         return """Rewrite this text in academic style suitable for scholarly work:
# # - Use precise, technical vocabulary
# # - Maintain objective, analytical tone
# # - Structure arguments logically
# # - Include appropriate academic phrasing
# # - Ensure clarity while maintaining scholarly rigor

# # Suitable for research papers, essays, and academic reports."""
    
# #     def _get_expand_prompt(self) -> str:
# #         return """Expand this text with additional detail and context:
# # - Add relevant examples and illustrations
# # - Provide more comprehensive explanations
# # - Include supporting details and context
# # - Elaborate on key points
# # - Make concepts more thorough and complete

# # Aim to make the content more informative and detailed."""
    
# #     def _get_shorten_prompt(self) -> str:
# #         return """Condense this text to its essential elements:
# # - Remove redundant information and filler words
# # - Keep only the most important points
# # - Use concise, direct language
# # - Eliminate unnecessary elaboration
# # - Maintain clarity while reducing length

# # Perfect for summaries, social media, and headlines."""
    
# #     def _get_humanize_prompt(self) -> str:
# #         return """Rewrite this text to sound completely human-written with natural imperfections:
# # - Add varied sentence lengths and rhythms
# # - Include conversational elements and natural flow
# # - Remove all AI writing patterns and robotic language
# # - Add personality quirks and human-like touches
# # - Make it sound spontaneous and authentic

# # Focus on making it undetectable as AI-generated content."""
    

    
# #     def get_tone_config(self, tone_mode: ToneMode) -> Dict:
# #         """Get configuration for a specific tone mode"""
# #         return self.tone_configs.get(tone_mode, self.tone_configs[ToneMode.STANDARD])
    
# #     def get_available_modes(self) -> Dict[str, Dict]:
# #         """Get all available tone modes with their details"""
# #         return {
# #             mode.value: {
# #                 "name": config["name"],
# #                 "description": config["description"],
# #                 "category": config["category"],
# #                 "use_cases": config["use_cases"]
# #             }
# #             for mode, config in self.tone_configs.items()
# #         }
    
# #     def get_modes_by_category(self) -> Dict[str, List[Dict]]:
# #         """Get modes organized by category"""
# #         categories = {}
# #         for mode, config in self.tone_configs.items():
# #             category = config["category"]
# #             if category not in categories:
# #                 categories[category] = []
            
# #             categories[category].append({
# #                 "mode": mode.value,
# #                 "name": config["name"],
# #                 "description": config["description"],
# #                 "use_cases": config["use_cases"]
# #             })
        
# #         return categories
    
# #     def is_pattern_aware_mode(self, tone_mode: ToneMode) -> bool:
# #         """Check if a tone mode should use pattern detection"""
# #         config = self.get_tone_config(tone_mode)
# #         return config.get("pattern_aware", False)
    
# #     def get_api_parameters(self, tone_mode: ToneMode) -> Dict:
# #         """Get API parameters (max_tokens, temperature) for a tone mode"""
# #         config = self.get_tone_config(tone_mode)
# #         return {
# #             "max_tokens": config.get("max_tokens", 4000),
# #             "temperature": config.get("temperature", 0.3)
# #         }
    
# #     def build_prompt(self, tone_mode: ToneMode, text: str, pattern_info: str = "") -> str:
# #         """Build the complete prompt for a tone mode"""
# #         config = self.get_tone_config(tone_mode)
# #         base_prompt = config["prompt"]
        
# #         # Add pattern information for pattern-aware modes
# #         if self.is_pattern_aware_mode(tone_mode) and pattern_info:
# #             base_prompt += pattern_info
        
# #         # Build final prompt
# #         final_prompt = f"""{base_prompt}

# # Text to rewrite:
# # \"\"\"
# # {text}
# # \"\"\"

# # Return ONLY the rewritten version with no explanations."""
        
# #         return final_prompt
    
# #     def validate_mode(self, tone_mode_str: str) -> Optional[ToneMode]:
# #         """Validate and return ToneMode from string"""
# #         try:
# #             return ToneMode(tone_mode_str.lower())
# #         except ValueError:
# #             logger.warning(f"Invalid tone mode: {tone_mode_str}")
# #             return None
    
# #     def get_recommended_modes_for_use_case(self, use_case: str) -> List[ToneMode]:
# #         """Get recommended modes for a specific use case"""
# #         use_case_lower = use_case.lower()
# #         recommendations = []
        
# #         for mode, config in self.tone_configs.items():
# #             use_cases = [uc.lower() for uc in config["use_cases"]]
# #             if any(use_case_lower in uc or uc in use_case_lower for uc in use_cases):
# #                 recommendations.append(mode)
        
# #         return recommendations if recommendations else [ToneMode.STANDARD]






"""
Robust Tone Manager with Enhanced API Reliability
Optimized to minimize 529 errors and maximize success rate
Updated with latest Claude Sonnet 4 model
"""

import os
import time
import random
import logging
from enum import Enum
from typing import Dict, List, Optional, Tuple
import anthropic
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class ToneMode(Enum):
    """Core tone modes optimized for best results"""
    STANDARD = "standard"
    FLUENCY = "fluency"
    ACADEMIC = "academic"
    CREATIVE = "creative"
    SIMPLE = "simple"
    FORMAL = "formal"
    EXPAND = "expand"
    SHORTEN = "shorten"
    HUMANIZE = "humanize"

class ClaudeAPIError(Exception):
    """Custom exception for Claude API errors"""
    pass

class ToneManager:
    """Advanced tone manager with robust Claude integration"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("Anthropic API key required. Set ANTHROPIC_API_KEY environment variable.")
        
        # Use official Anthropic SDK
        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.model = "claude-sonnet-4-20250514"  # Latest Claude Sonnet 4
        self.version = "2.0.0"
        self.tone_configs = self._load_tone_configurations()
        
        # API reliability tracking
        self.consecutive_failures = 0
        self.last_success_time = datetime.now()
        self.last_failure_time = None
        
        logger.info(f"Robust Tone Manager v{self.version} initialized with {len(self.tone_configs)} modes using {self.model}")
    
    def _load_tone_configurations(self) -> Dict[ToneMode, Dict]:
        """Load optimized tone configurations"""
        return {
            ToneMode.STANDARD: {
                "name": "Standard",
                "description": "Balanced processing for general content with natural flow",
                "prompt": "Rewrite this text with balanced, natural language that flows well and reduces AI-like patterns while maintaining the original meaning and context.",
                "temperature": 0.2,
                "max_tokens": 2500
            },
            
            ToneMode.FLUENCY: {
                "name": "Fluency",
                "description": "Enhanced readability and smooth flow",
                "prompt": "Rewrite this text to enhance readability and flow. Make it smooth, clear, and well-structured.",
                "temperature": 0.2,
                "max_tokens": 2500
            },
            
            ToneMode.ACADEMIC: {
                "name": "Academic",
                "description": "Scholarly and research writing standards",
                "prompt": "Rewrite this text in an academic style suitable for scholarly work. Use formal vocabulary, proper structure, and maintain objectivity.",
                "temperature": 0.1,
                "max_tokens": 3000
            },
            
            ToneMode.CREATIVE: {
                "name": "Creative",
                "description": "Artistic and expressive content enhancement",
                "prompt": "Rewrite this text in a creative and engaging way. Use varied sentence structures, expressive language, and make it interesting to read.",
                "temperature": 0.5,
                "max_tokens": 2800
            },
            
            ToneMode.SIMPLE: {
                "name": "Simple",
                "description": "Clear and easy-to-understand language for all readers",
                "prompt": "Rewrite this text in simple, easy-to-understand language. Use short sentences, plain vocabulary, and make it accessible for all readers.",
                "temperature": 0.2,
                "max_tokens": 2500
            },
            
            ToneMode.FORMAL: {
                "name": "Formal",
                "description": "Polished and respectful communication style",
                "prompt": "Rewrite this text in a formal, professional style. Use sophisticated vocabulary, polite phrasing, and structured formatting.",
                "temperature": 0.1,
                "max_tokens": 2800
            },
            
            ToneMode.EXPAND: {
                "name": "Expand",
                "description": "Elaborates on ideas with more detail and explanation",
                "prompt": "Expand this text by adding more detail, context, and explanation. Elaborate on key points while maintaining clarity.",
                "temperature": 0.3,
                "max_tokens": 3500
            },
            
            ToneMode.SHORTEN: {
                "name": "Shorten",
                "description": "Condenses content to be brief and to the point",
                "prompt": "Condense this text to be brief and concise. Keep only the essential information and main points.",
                "temperature": 0.1,
                "max_tokens": 2000
            },
            
            ToneMode.HUMANIZE: {
                "name": "Humanize",
                "description": "Makes text sound more natural and human-like",
                "prompt": "Rewrite this text to sound more natural and human-like. Remove any AI-like patterns and make it conversational and authentic.",
                "temperature": 0.4,
                "max_tokens": 2500
            }
        }
    
    def _should_use_api(self) -> bool:
        """Determine if we should attempt API call based on recent failures"""
        # If too many consecutive failures, use fallback
        if self.consecutive_failures >= 3:
            # Allow retry after 5 minutes
            if self.last_failure_time and (datetime.now() - self.last_failure_time).seconds < 300:
                return False
            else:
                # Reset after cooldown
                self.consecutive_failures = 0
        
        return True
    
    def _make_claude_request_robust(self, prompt: str, max_tokens: int, temperature: float) -> str:
        """Make Claude API request with aggressive retry logic for 529 errors"""
        
        if not self._should_use_api():
            raise ClaudeAPIError("Circuit breaker: Too many recent failures")
        
        max_retries = 8  # Increased retries
        base_wait = 1.5   # Shorter initial wait
        
        for attempt in range(max_retries):
            try:
                message = self.client.messages.create(
                    model=self.model,  # Use the configured model
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
    
    def change_tone(self, text: str, tone_mode: str) -> Tuple[str, str, Dict]:
        """
        Change text tone using Claude API with robust error handling
        
        Args:
            text: Text to transform
            tone_mode: Target tone mode
            
        Returns:
            Tuple of (transformed_text, status, analysis)
        """
        if not text.strip():
            raise ValueError("Text cannot be empty")
        
        # Validate tone mode
        try:
            mode_enum = ToneMode(tone_mode.lower())
        except ValueError:
            available_modes = [mode.value for mode in ToneMode]
            # Use fallback with basic transformation
            fallback_text = self._apply_enhanced_fallback(text, tone_mode)
            return fallback_text, f"Invalid tone mode, using fallback", {
                "error": f"Invalid tone mode: {tone_mode}. Available: {available_modes}"
            }
        
        config = self.tone_configs[mode_enum]
        
        # Build optimized prompt
        prompt = f"""{config['prompt']}

Original text:
{text}

Instructions: Return ONLY the transformed text with no explanations."""
        
        try:
            # Attempt Claude API call
            transformed_text = self._make_claude_request_robust(
                prompt=prompt,
                max_tokens=config['max_tokens'],
                temperature=config['temperature']
            )
            
            # Calculate metrics
            original_words = len(text.split())
            transformed_words = len(transformed_text.split())
            
            analysis = {
                "tone_mode": tone_mode,
                "tone_name": config["name"],
                "original_words": original_words,
                "transformed_words": transformed_words,
                "model": self.model,
                "quality": "Premium Claude Sonnet 4",
                "success": True
            }
            
            status = f"{config['name']} | {original_words}→{transformed_words} words | Claude Sonnet 4 Success"
            
            logger.info(f"Successfully transformed text to {tone_mode} tone using {self.model}")
            return transformed_text, status, analysis
            
        except ClaudeAPIError as e:
            logger.warning(f"Claude API failed, using enhanced fallback: {e}")
            
            # Enhanced fallback
            fallback_text = self._apply_enhanced_fallback(text, tone_mode)
            
            analysis = {
                "tone_mode": tone_mode,
                "fallback_used": True,
                "api_error": str(e),
                "consecutive_failures": self.consecutive_failures,
                "quality": "Fallback Processing"
            }
            
            status = f"Enhanced {config['name']} Fallback | API temporarily unavailable"
            
            return fallback_text, status, analysis
    
    def _apply_enhanced_fallback(self, text: str, tone_mode: str) -> str:
        """Apply enhanced fallback transformation"""
        
        try:
            mode_enum = ToneMode(tone_mode.lower())
        except ValueError:
            mode_enum = ToneMode.STANDARD
        
        if mode_enum == ToneMode.FORMAL:
            replacements = {
                "can't": "cannot", "won't": "will not", "don't": "do not",
                "isn't": "is not", "aren't": "are not", "doesn't": "does not",
                "really": "significantly", "a lot": "substantially"
            }
        elif mode_enum == ToneMode.SIMPLE:
            replacements = {
                "utilize": "use", "implement": "set up", "substantial": "big",
                "demonstrate": "show", "facilitate": "help", "approximately": "about",
                "subsequently": "then", "consequently": "so", "furthermore": "also"
            }
        elif mode_enum == ToneMode.ACADEMIC:
            replacements = {
                "show": "demonstrate", "use": "utilize", "help": "facilitate",
                "big": "substantial", "really": "significantly", "also": "furthermore"
            }
        elif mode_enum == ToneMode.CREATIVE:
            replacements = {
                "good": "excellent", "big": "massive", "important": "crucial",
                "show": "reveal", "help": "empower", "make": "craft"
            }
        elif mode_enum == ToneMode.SHORTEN:
            # Remove common filler words
            sentences = text.split('.')
            return '. '.join(sentences[:max(1, len(sentences)//2)]) + '.'
        elif mode_enum == ToneMode.EXPAND:
            # Add context markers
            return f"{text} This represents a comprehensive analysis of the subject matter."
        else:  # STANDARD, FLUENCY, HUMANIZE
            replacements = {
                "really": "quite", "a lot": "many", "thing": "aspect"
            }
        
        result = text
        for old, new in replacements.items():
            # Case-sensitive replacement
            result = result.replace(old, new)
            result = result.replace(old.capitalize(), new.capitalize())
        
        return result
    
    def get_available_modes(self) -> List[str]:
        """Get list of available tone modes"""
        return [mode.value for mode in ToneMode]
    
    def get_mode_details(self) -> Dict[str, Dict]:
        """Get detailed information about all tone modes"""
        return {
            mode.value: {
                "name": config["name"],
                "description": config["description"]
            }
            for mode, config in self.tone_configs.items()
        }
    
    def get_api_status(self) -> Dict:
        """Get current API status information"""
        return {
            "model": self.model,
            "version": self.version,
            "consecutive_failures": self.consecutive_failures,
            "last_success": self.last_success_time.isoformat(),
            "last_failure": self.last_failure_time.isoformat() if self.last_failure_time else None,
            "api_available": self._should_use_api(),
            "circuit_breaker_active": self.consecutive_failures >= 3
        }
    
    def validate_mode(self, tone_mode_str: str) -> Optional[ToneMode]:
        """Validate tone mode string"""
        try:
            return ToneMode(tone_mode_str.lower())
        except ValueError:
            return None
