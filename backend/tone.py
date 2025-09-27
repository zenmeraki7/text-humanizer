# """
# Tone Modes Module
# Handles all tone-related functionality for the Text Humanizer
# """

# from enum import Enum
# from typing import Dict, List, Optional
# import logging

# logger = logging.getLogger(__name__)

# class ToneMode(Enum):
#     """Available tone modes for text humanization"""
#     STANDARD = "standard"
#     FLUENCY = "fluency"
#     FORMAL = "formal"
#     SIMPLE = "simple"
#     CREATIVE = "creative"
#     ACADEMIC = "academic"
#     EXPAND = "expand"
#     SHORTEN = "shorten"
#     HUMANIZE = "humanize"

# class ToneManager:
#     """Manages tone modes, prompts, and tone-specific logic"""
    
#     def __init__(self):
#         self.tone_configs = self._load_tone_configurations()
#         logger.info(f"✅ Tone Manager initialized with {len(self.tone_configs)} modes")
    
#     def _load_tone_configurations(self) -> Dict[ToneMode, Dict]:
#         """Load all tone mode configurations"""
#         return {
#             ToneMode.STANDARD: {
#                 "name": "🎯 Standard",
#                 "description": "Neutral rewrite with small tweaks in structure and vocabulary",
#                 "category": "General",
#                 "use_cases": ["Default option", "Balanced improvements", "Maintain original tone"],
#                 "pattern_aware": True,
#                 "prompt": self._get_standard_prompt(),
#                 "max_tokens": 4000,
#                 "temperature": 0.3
#             },
            
#             ToneMode.FLUENCY: {
#                 "name": "📖 Fluency",
#                 "description": "Focus on smooth readability and natural flow",
#                 "category": "Readability",
#                 "use_cases": ["Fix awkward phrasing", "Improve sentence flow", "Grammar corrections"],
#                 "pattern_aware": True,
#                 "prompt": self._get_fluency_prompt(),
#                 "max_tokens": 4000,
#                 "temperature": 0.2
#             },
            
#             ToneMode.FORMAL: {
#                 "name": "👔 Formal",
#                 "description": "Polished, professional tone for business contexts",
#                 "category": "Professional",
#                 "use_cases": ["Business emails", "Reports", "Official documents"],
#                 "pattern_aware": False,
#                 "prompt": self._get_formal_prompt(),
#                 "max_tokens": 4000,
#                 "temperature": 0.1
#             },
            
#             ToneMode.SIMPLE: {
#                 "name": "🔍 Simple",
#                 "description": "Break down complex text into plain, easy language",
#                 "category": "Accessibility",
#                 "use_cases": ["Beginner-friendly content", "Technical explanations", "Clear communication"],
#                 "pattern_aware": False,
#                 "prompt": self._get_simple_prompt(),
#                 "max_tokens": 4000,
#                 "temperature": 0.2
#             },
            
#             ToneMode.CREATIVE: {
#                 "name": "🎨 Creative",
#                 "description": "Add uniqueness, style, and engaging elements",
#                 "category": "Creative",
#                 "use_cases": ["Blog posts", "Storytelling", "Marketing content", "Social media"],
#                 "pattern_aware": False,
#                 "prompt": self._get_creative_prompt(),
#                 "max_tokens": 4000,
#                 "temperature": 0.7
#             },
            
#             ToneMode.ACADEMIC: {
#                 "name": "🎓 Academic",
#                 "description": "Scholarly style with precise, technical vocabulary",
#                 "category": "Academic",
#                 "use_cases": ["Research papers", "Essays", "Academic reports", "Scholarly work"],
#                 "pattern_aware": False,
#                 "prompt": self._get_academic_prompt(),
#                 "max_tokens": 4000,
#                 "temperature": 0.1
#             },
            
#             ToneMode.EXPAND: {
#                 "name": "📈 Expand",
#                 "description": "Add detail, examples, and comprehensive explanations",
#                 "category": "Content Development",
#                 "use_cases": ["Add context", "Detailed explanations", "Content writing"],
#                 "pattern_aware": False,
#                 "prompt": self._get_expand_prompt(),
#                 "max_tokens": 6000,
#                 "temperature": 0.4
#             },
            
#             ToneMode.SHORTEN: {
#                 "name": "✂️ Shorten",
#                 "description": "Condense text while preserving key information",
#                 "category": "Concision",
#                 "use_cases": ["Summaries", "Social media posts", "Headlines", "Quick overviews"],
#                 "pattern_aware": False,
#                 "prompt": self._get_shorten_prompt(),
#                 "max_tokens": 2000,
#                 "temperature": 0.2
#             },
            
#             ToneMode.HUMANIZE: {
#                 "name": "🤝 Humanize",
#                 "description": "Add natural imperfections and human-like flow",
#                 "category": "AI Detection",
#                 "use_cases": ["Bypass AI detection", "Natural writing", "Human-like content"],
#                 "pattern_aware": True,
#                 "prompt": self._get_humanize_prompt(),
#                 "max_tokens": 4000,
#                 "temperature": 0.5
#             },
            

#         }
    
#     def _get_standard_prompt(self) -> str:
#         return """Rewrite this text with neutral, balanced improvements. Make small but meaningful changes to:
# - Fix awkward phrasing while keeping the original tone
# - Improve sentence structure without dramatic changes
# - Replace obvious AI patterns with natural alternatives
# - Maintain the author's intended voice and style

# Focus on clarity and readability while keeping changes minimal."""
    
#     def _get_fluency_prompt(self) -> str:
#         return """Rewrite this text for maximum fluency and readability. Focus on:
# - Smooth sentence flow and natural transitions
# - Fix grammar issues and awkward phrasing
# - Improve rhythm and pacing
# - Remove choppy or robotic language
# - Make it flow like natural speech

# Prioritize readability and natural language flow above all else."""
    
#     def _get_formal_prompt(self) -> str:
#         return """Rewrite this text in a formal, professional tone suitable for business communication:
# - Use precise, professional vocabulary
# - Maintain respectful and authoritative tone
# - Structure content logically and clearly
# - Remove casual language and contractions
# - Ensure appropriate business etiquette

# Perfect for emails, reports, and official documents."""
    
#     def _get_simple_prompt(self) -> str:
#         return """Rewrite this text in simple, plain language that anyone can understand:
# - Use common, everyday words instead of complex terms
# - Break down long sentences into shorter ones
# - Explain technical concepts in simple terms
# - Remove jargon and complicated phrases
# - Make it accessible to beginners

# Aim for clarity and simplicity above all else."""
    
#     def _get_creative_prompt(self) -> str:
#         return """Rewrite this text with creative flair and engaging style:
# - Add vivid metaphors and imagery where appropriate
# - Use varied and interesting vocabulary
# - Create engaging hooks and compelling language
# - Add personality and unique voice
# - Make it memorable and distinctive

# Perfect for blogs, storytelling, and marketing content."""
    
#     def _get_academic_prompt(self) -> str:
#         return """Rewrite this text in academic style suitable for scholarly work:
# - Use precise, technical vocabulary
# - Maintain objective, analytical tone
# - Structure arguments logically
# - Include appropriate academic phrasing
# - Ensure clarity while maintaining scholarly rigor

# Suitable for research papers, essays, and academic reports."""
    
#     def _get_expand_prompt(self) -> str:
#         return """Expand this text with additional detail and context:
# - Add relevant examples and illustrations
# - Provide more comprehensive explanations
# - Include supporting details and context
# - Elaborate on key points
# - Make concepts more thorough and complete

# Aim to make the content more informative and detailed."""
    
#     def _get_shorten_prompt(self) -> str:
#         return """Condense this text to its essential elements:
# - Remove redundant information and filler words
# - Keep only the most important points
# - Use concise, direct language
# - Eliminate unnecessary elaboration
# - Maintain clarity while reducing length

# Perfect for summaries, social media, and headlines."""
    
#     def _get_humanize_prompt(self) -> str:
#         return """Rewrite this text to sound completely human-written with natural imperfections:
# - Add varied sentence lengths and rhythms
# - Include conversational elements and natural flow
# - Remove all AI writing patterns and robotic language
# - Add personality quirks and human-like touches
# - Make it sound spontaneous and authentic

# Focus on making it undetectable as AI-generated content."""
    

    
#     def get_tone_config(self, tone_mode: ToneMode) -> Dict:
#         """Get configuration for a specific tone mode"""
#         return self.tone_configs.get(tone_mode, self.tone_configs[ToneMode.STANDARD])
    
#     def get_available_modes(self) -> Dict[str, Dict]:
#         """Get all available tone modes with their details"""
#         return {
#             mode.value: {
#                 "name": config["name"],
#                 "description": config["description"],
#                 "category": config["category"],
#                 "use_cases": config["use_cases"]
#             }
#             for mode, config in self.tone_configs.items()
#         }
    
#     def get_modes_by_category(self) -> Dict[str, List[Dict]]:
#         """Get modes organized by category"""
#         categories = {}
#         for mode, config in self.tone_configs.items():
#             category = config["category"]
#             if category not in categories:
#                 categories[category] = []
            
#             categories[category].append({
#                 "mode": mode.value,
#                 "name": config["name"],
#                 "description": config["description"],
#                 "use_cases": config["use_cases"]
#             })
        
#         return categories
    
#     def is_pattern_aware_mode(self, tone_mode: ToneMode) -> bool:
#         """Check if a tone mode should use pattern detection"""
#         config = self.get_tone_config(tone_mode)
#         return config.get("pattern_aware", False)
    
#     def get_api_parameters(self, tone_mode: ToneMode) -> Dict:
#         """Get API parameters (max_tokens, temperature) for a tone mode"""
#         config = self.get_tone_config(tone_mode)
#         return {
#             "max_tokens": config.get("max_tokens", 4000),
#             "temperature": config.get("temperature", 0.3)
#         }
    
#     def build_prompt(self, tone_mode: ToneMode, text: str, pattern_info: str = "") -> str:
#         """Build the complete prompt for a tone mode"""
#         config = self.get_tone_config(tone_mode)
#         base_prompt = config["prompt"]
        
#         # Add pattern information for pattern-aware modes
#         if self.is_pattern_aware_mode(tone_mode) and pattern_info:
#             base_prompt += pattern_info
        
#         # Build final prompt
#         final_prompt = f"""{base_prompt}

# Text to rewrite:
# \"\"\"
# {text}
# \"\"\"

# Return ONLY the rewritten version with no explanations."""
        
#         return final_prompt
    
#     def validate_mode(self, tone_mode_str: str) -> Optional[ToneMode]:
#         """Validate and return ToneMode from string"""
#         try:
#             return ToneMode(tone_mode_str.lower())
#         except ValueError:
#             logger.warning(f"Invalid tone mode: {tone_mode_str}")
#             return None
    
#     def get_recommended_modes_for_use_case(self, use_case: str) -> List[ToneMode]:
#         """Get recommended modes for a specific use case"""
#         use_case_lower = use_case.lower()
#         recommendations = []
        
#         for mode, config in self.tone_configs.items():
#             use_cases = [uc.lower() for uc in config["use_cases"]]
#             if any(use_case_lower in uc or uc in use_case_lower for uc in use_cases):
#                 recommendations.append(mode)
        
#         return recommendations if recommendations else [ToneMode.STANDARD]




"""
Improved Tone Manager with Perfect Claude API Integration
Optimized for high-quality output with official Anthropic SDK
"""

import os
import time
import random
import logging
from enum import Enum
from typing import Dict, List, Optional, Tuple
import anthropic

logger = logging.getLogger(__name__)

class ToneMode(Enum):
    """Core tone modes optimized for best results"""
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    ACADEMIC = "academic"
    CREATIVE = "creative"
    SIMPLE = "simple"
    FORMAL = "formal"

class ClaudeAPIError(Exception):
    """Custom exception for Claude API errors"""
    pass

class ToneManager:
    """Advanced tone manager with perfect Claude integration"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("Anthropic API key required. Set ANTHROPIC_API_KEY environment variable.")
        
        # Use official Anthropic SDK
        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.tone_configs = self._load_tone_configurations()
        logger.info(f"✅ Advanced Tone Manager initialized with {len(self.tone_configs)} optimized modes")
    
    def _load_tone_configurations(self) -> Dict[ToneMode, Dict]:
        """Load optimized tone configurations for best Claude output"""
        return {
            ToneMode.PROFESSIONAL: {
                "name": "💼 Professional",
                "description": "Polished business communication with authority and clarity",
                "prompt": self._get_professional_prompt(),
                "temperature": 0.1,
                "max_tokens": 3000
            },
            
            ToneMode.CASUAL: {
                "name": "😊 Casual",
                "description": "Friendly, conversational tone for everyday communication",
                "prompt": self._get_casual_prompt(),
                "temperature": 0.4,
                "max_tokens": 3000
            },
            
            ToneMode.ACADEMIC: {
                "name": "🎓 Academic",
                "description": "Scholarly, precise language for research and formal writing",
                "prompt": self._get_academic_prompt(),
                "temperature": 0.1,
                "max_tokens": 4000
            },
            
            ToneMode.CREATIVE: {
                "name": "🎨 Creative",
                "description": "Engaging, imaginative style with personality and flair",
                "prompt": self._get_creative_prompt(),
                "temperature": 0.6,
                "max_tokens": 3500
            },
            
            ToneMode.SIMPLE: {
                "name": "🔍 Simple",
                "description": "Clear, easy-to-understand language for broad audiences",
                "prompt": self._get_simple_prompt(),
                "temperature": 0.2,
                "max_tokens": 3000
            },
            
            ToneMode.FORMAL: {
                "name": "👔 Formal",
                "description": "Dignified, official tone for important documents",
                "prompt": self._get_formal_prompt(),
                "temperature": 0.1,
                "max_tokens": 3500
            }
        }
    
    def _get_professional_prompt(self) -> str:
        return """Transform this text into professional business communication that:

• Uses confident, authoritative language appropriate for executives
• Maintains clear structure with logical flow
• Employs precise business vocabulary without jargon
• Sounds competent and trustworthy
• Focuses on outcomes and value propositions
• Removes any casual or uncertain language

Write in a tone suitable for boardroom presentations, client proposals, or executive reports."""
    
    def _get_casual_prompt(self) -> str:
        return """Rewrite this text in a friendly, conversational style that:

• Sounds like you're talking to a friend or colleague
• Uses natural, everyday language
• Includes contractions and relaxed phrasing
• Maintains warmth and approachability
• Avoids overly formal or stiff language
• Keeps the original meaning but makes it more relatable

Write as if you're having a comfortable conversation."""
    
    def _get_academic_prompt(self) -> str:
        return """Transform this text into scholarly academic writing that:

• Uses precise, technical vocabulary appropriate for research
• Maintains objective, analytical tone throughout
• Structures arguments with clear logical progression
• Includes appropriate academic phrasing and conventions
• Demonstrates intellectual rigor and careful analysis
• Avoids personal opinions or casual language

Write in the style of peer-reviewed academic publications."""
    
    def _get_creative_prompt(self) -> str:
        return """Rewrite this text with creative flair and engaging style that:

• Uses vivid language and compelling imagery
• Includes varied sentence structures for rhythm
• Adds personality and unique voice
• Creates hooks that capture attention
• Makes the content memorable and distinctive
• Balances creativity with clarity

Write in a style that would engage readers and make them want to continue reading."""
    
    def _get_simple_prompt(self) -> str:
        return """Simplify this text for easy understanding by:

• Using common, everyday words instead of complex terms
• Breaking long sentences into shorter, clearer ones
• Explaining any technical concepts in plain language
• Removing unnecessary jargon and complicated phrases
• Making it accessible to general audiences
• Maintaining all important information while improving clarity

Write so that anyone can easily understand the message."""
    
    def _get_formal_prompt(self) -> str:
        return """Transform this text into formal, dignified language that:

• Uses elevated vocabulary and sophisticated phrasing
• Maintains respectful, ceremonial tone
• Structures content with proper formal conventions
• Avoids contractions and casual expressions
• Demonstrates gravity and importance
• Sounds appropriate for official documents or ceremonies

Write in the style of formal declarations, legal documents, or state occasions."""
    
    def _make_claude_request_with_retry(self, prompt: str, max_tokens: int, temperature: float, max_retries: int = 5) -> str:
        """Make Claude API request with intelligent retry logic"""
        
        for attempt in range(max_retries):
            try:
                message = self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=max_tokens,
                    temperature=temperature,
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                )
                return message.content[0].text.strip()
                
            except anthropic.RateLimitError as e:
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + random.uniform(0, 2)
                    logger.info(f"Rate limit hit, waiting {wait_time:.1f}s... (attempt {attempt + 1})")
                    time.sleep(wait_time)
                    continue
                raise ClaudeAPIError(f"Rate limit exceeded after {max_retries} attempts")
                
            except anthropic.APIError as e:
                error_str = str(e).lower()
                if "overloaded" in error_str or "529" in error_str:
                    if attempt < max_retries - 1:
                        wait_time = (2 ** attempt) + random.uniform(1, 3)
                        logger.info(f"API overloaded, waiting {wait_time:.1f}s... (attempt {attempt + 1})")
                        time.sleep(wait_time)
                        continue
                    raise ClaudeAPIError("Claude API is currently overloaded. Please try again in a few minutes.")
                else:
                    raise ClaudeAPIError(f"Claude API error: {e}")
                    
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                raise ClaudeAPIError(f"Unexpected error: {e}")
        
        raise ClaudeAPIError("Maximum retries exceeded")
    
    def change_tone(self, text: str, tone_mode: str) -> Tuple[str, str, Dict]:
        """
        Change text tone using Claude API
        
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
            raise ValueError(f"Invalid tone mode: {tone_mode}. Available: {available_modes}")
        
        config = self.tone_configs[mode_enum]
        
        # Build optimized prompt
        prompt = f"""{config['prompt']}

Original text to transform:
'''{text}'''

Requirements:
- Maintain all key information and meaning
- Transform the tone completely to match the target style
- Return ONLY the transformed text with no explanations
- Ensure the output is polished and professional quality"""
        
        try:
            # Make API call with retry logic
            transformed_text = self._make_claude_request_with_retry(
                prompt=prompt,
                max_tokens=config['max_tokens'],
                temperature=config['temperature']
            )
            
            # Calculate metrics
            original_words = len(text.split())
            transformed_words = len(transformed_text.split())
            
            # Create analysis
            analysis = {
                "tone_mode": tone_mode,
                "tone_name": config["name"],
                "original_words": original_words,
                "transformed_words": transformed_words,
                "word_change_ratio": round(transformed_words / original_words, 2) if original_words > 0 else 1,
                "temperature": config["temperature"],
                "model": "claude-3-5-sonnet-20241022",
                "quality": "Premium"
            }
            
            status = f"{config['name']} transformation completed | {original_words}→{transformed_words} words | Quality: Premium"
            
            logger.info(f"✅ Successfully transformed text to {tone_mode} tone")
            return transformed_text, status, analysis
            
        except ClaudeAPIError as e:
            logger.error(f"❌ Tone transformation failed: {e}")
            # Return enhanced fallback
            fallback_text = self._apply_basic_tone_transformation(text, mode_enum)
            return fallback_text, f"Basic {config['name']} (API unavailable)", {"error": str(e)}
        except Exception as e:
            logger.error(f"❌ Unexpected error: {e}")
            raise ClaudeAPIError(f"Tone transformation failed: {e}")
    
    def _apply_basic_tone_transformation(self, text: str, tone_mode: ToneMode) -> str:
        """Apply basic tone transformation as fallback"""
        
        if tone_mode == ToneMode.PROFESSIONAL:
            replacements = {
                "really": "significantly",
                "a lot": "substantially", 
                "thing": "element",
                "stuff": "components",
                "get": "obtain",
                "make": "create",
                "big": "substantial"
            }
        elif tone_mode == ToneMode.CASUAL:
            replacements = {
                "substantial": "big",
                "demonstrate": "show",
                "utilize": "use",
                "implement": "put in place",
                "significantly": "really"
            }
        elif tone_mode == ToneMode.SIMPLE:
            replacements = {
                "utilize": "use",
                "implement": "set up",
                "substantial": "big",
                "demonstrate": "show",
                "facilitate": "help"
            }
        else:
            # Generic improvements
            replacements = {
                "furthermore": "also",
                "moreover": "plus",
                "utilize": "use",
                "implement": "use"
            }
        
        result = text
        for old, new in replacements.items():
            result = result.replace(old, new)
        
        return result
    
    def get_available_modes(self) -> Dict[str, Dict]:
        """Get all available tone modes"""
        return {
            mode.value: {
                "name": config["name"],
                "description": config["description"]
            }
            for mode, config in self.tone_configs.items()
        }
    
    def get_mode_info(self, tone_mode: str) -> Dict:
        """Get detailed information about a specific tone mode"""
        try:
            mode_enum = ToneMode(tone_mode.lower())
            config = self.tone_configs[mode_enum]
            return {
                "mode": tone_mode,
                "name": config["name"],
                "description": config["description"],
                "temperature": config["temperature"],
                "max_tokens": config["max_tokens"]
            }
        except ValueError:
            return {"error": f"Invalid tone mode: {tone_mode}"}
    
    def validate_mode(self, tone_mode_str: str) -> Optional[ToneMode]:
        """Validate tone mode string"""
        try:
            return ToneMode(tone_mode_str.lower())
        except ValueError:
            return None

# Test function
def test_tone_manager():
    """Test the improved tone manager"""
    try:
        tone_manager = ToneManager()
        
        test_text = """
        The implementation of artificial intelligence solutions represents a paradigm shift that enables 
        companies to optimize their operational efficiency while simultaneously reducing costs. Furthermore, 
        these innovative approaches foster enhanced customer experiences and drive sustainable growth trajectories.
        """
        
        print("🧪 Testing Improved Tone Manager...")
        print(f"Original: {test_text.strip()}\n")
        
        # Test different tones
        for mode in ["professional", "casual", "simple", "creative"]:
            try:
                result, status, analysis = tone_manager.change_tone(test_text.strip(), mode)
                print(f"🔄 {mode.upper()}:")
                print(f"Result: {result}")
                print(f"Status: {status}")
                print("-" * 80)
            except Exception as e:
                print(f"❌ {mode} failed: {e}")
        
        print("✅ Test completed!")
        
    except Exception as e:
        print(f"❌ Initialization failed: {e}")

if __name__ == "__main__":
    test_tone_manager()
