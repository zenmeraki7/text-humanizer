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
Tone Modes Module for Claude API
Handles all tone-related functionality for the Text Humanizer with Claude API integration
"""

import os
import asyncio
import aiohttp
from enum import Enum
from typing import Dict, List, Optional, Tuple
import logging
import json

logger = logging.getLogger(__name__)

class ToneMode(Enum):
    """Available tone modes for text humanization"""
    STANDARD = "standard"
    FLUENCY = "fluency"
    FORMAL = "formal"
    SIMPLE = "simple"
    CREATIVE = "creative"
    ACADEMIC = "academic"
    EXPAND = "expand"
    SHORTEN = "shorten"
    HUMANIZE = "humanize"

class ClaudeAPIError(Exception):
    """Custom exception for Claude API errors"""
    pass

class ToneManager:
    """Manages tone modes, prompts, and Claude API integration"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable.")
        
        self.api_url = "https://api.anthropic.com/v1/messages"
        self.api_version = "2023-06-01"
        self.tone_configs = self._load_tone_configurations()
        logger.info(f"✅ Tone Manager initialized with {len(self.tone_configs)} modes")
    
    def _load_tone_configurations(self) -> Dict[ToneMode, Dict]:
        """Load all tone mode configurations"""
        return {
            ToneMode.STANDARD: {
                "name": "🎯 Standard",
                "description": "Neutral rewrite with small tweaks in structure and vocabulary",
                "category": "General",
                "use_cases": ["Default option", "Balanced improvements", "Maintain original tone"],
                "pattern_aware": True,
                "prompt": self._get_standard_prompt(),
                "max_tokens": 4000,
                "temperature": 0.3
            },
            
            ToneMode.FLUENCY: {
                "name": "📖 Fluency",
                "description": "Focus on smooth readability and natural flow",
                "category": "Readability",
                "use_cases": ["Fix awkward phrasing", "Improve sentence flow", "Grammar corrections"],
                "pattern_aware": True,
                "prompt": self._get_fluency_prompt(),
                "max_tokens": 4000,
                "temperature": 0.2
            },
            
            ToneMode.FORMAL: {
                "name": "👔 Formal",
                "description": "Polished, professional tone for business contexts",
                "category": "Professional",
                "use_cases": ["Business emails", "Reports", "Official documents"],
                "pattern_aware": False,
                "prompt": self._get_formal_prompt(),
                "max_tokens": 4000,
                "temperature": 0.1
            },
            
            ToneMode.SIMPLE: {
                "name": "🔍 Simple",
                "description": "Break down complex text into plain, easy language",
                "category": "Accessibility",
                "use_cases": ["Beginner-friendly content", "Technical explanations", "Clear communication"],
                "pattern_aware": False,
                "prompt": self._get_simple_prompt(),
                "max_tokens": 4000,
                "temperature": 0.2
            },
            
            ToneMode.CREATIVE: {
                "name": "🎨 Creative",
                "description": "Add uniqueness, style, and engaging elements",
                "category": "Creative",
                "use_cases": ["Blog posts", "Storytelling", "Marketing content", "Social media"],
                "pattern_aware": False,
                "prompt": self._get_creative_prompt(),
                "max_tokens": 4000,
                "temperature": 0.7
            },
            
            ToneMode.ACADEMIC: {
                "name": "🎓 Academic",
                "description": "Scholarly style with precise, technical vocabulary",
                "category": "Academic",
                "use_cases": ["Research papers", "Essays", "Academic reports", "Scholarly work"],
                "pattern_aware": False,
                "prompt": self._get_academic_prompt(),
                "max_tokens": 4000,
                "temperature": 0.1
            },
            
            ToneMode.EXPAND: {
                "name": "📈 Expand",
                "description": "Add detail, examples, and comprehensive explanations",
                "category": "Content Development",
                "use_cases": ["Add context", "Detailed explanations", "Content writing"],
                "pattern_aware": False,
                "prompt": self._get_expand_prompt(),
                "max_tokens": 6000,
                "temperature": 0.4
            },
            
            ToneMode.SHORTEN: {
                "name": "✂️ Shorten",
                "description": "Condense text while preserving key information",
                "category": "Concision",
                "use_cases": ["Summaries", "Social media posts", "Headlines", "Quick overviews"],
                "pattern_aware": False,
                "prompt": self._get_shorten_prompt(),
                "max_tokens": 2000,
                "temperature": 0.2
            },
            
            ToneMode.HUMANIZE: {
                "name": "🤝 Humanize",
                "description": "Add natural imperfections and human-like flow",
                "category": "AI Detection",
                "use_cases": ["Bypass AI detection", "Natural writing", "Human-like content"],
                "pattern_aware": True,
                "prompt": self._get_humanize_prompt(),
                "max_tokens": 4000,
                "temperature": 0.5
            }
        }
    
    def _get_standard_prompt(self) -> str:
        return """Rewrite this text with neutral, balanced improvements. Make small but meaningful changes to:
- Fix awkward phrasing while keeping the original tone
- Improve sentence structure without dramatic changes
- Replace obvious AI patterns with natural alternatives
- Maintain the author's intended voice and style

Focus on clarity and readability while keeping changes minimal."""
    
    def _get_fluency_prompt(self) -> str:
        return """Rewrite this text for maximum fluency and readability. Focus on:
- Smooth sentence flow and natural transitions
- Fix grammar issues and awkward phrasing
- Improve rhythm and pacing
- Remove choppy or robotic language
- Make it flow like natural speech

Prioritize readability and natural language flow above all else."""
    
    def _get_formal_prompt(self) -> str:
        return """Rewrite this text in a formal, professional tone suitable for business communication:
- Use precise, professional vocabulary
- Maintain respectful and authoritative tone
- Structure content logically and clearly
- Remove casual language and contractions
- Ensure appropriate business etiquette

Perfect for emails, reports, and official documents."""
    
    def _get_simple_prompt(self) -> str:
        return """Rewrite this text in simple, plain language that anyone can understand:
- Use common, everyday words instead of complex terms
- Break down long sentences into shorter ones
- Explain technical concepts in simple terms
- Remove jargon and complicated phrases
- Make it accessible to beginners

Aim for clarity and simplicity above all else."""
    
    def _get_creative_prompt(self) -> str:
        return """Rewrite this text with creative flair and engaging style:
- Add vivid metaphors and imagery where appropriate
- Use varied and interesting vocabulary
- Create engaging hooks and compelling language
- Add personality and unique voice
- Make it memorable and distinctive

Perfect for blogs, storytelling, and marketing content."""
    
    def _get_academic_prompt(self) -> str:
        return """Rewrite this text in academic style suitable for scholarly work:
- Use precise, technical vocabulary
- Maintain objective, analytical tone
- Structure arguments logically
- Include appropriate academic phrasing
- Ensure clarity while maintaining scholarly rigor

Suitable for research papers, essays, and academic reports."""
    
    def _get_expand_prompt(self) -> str:
        return """Expand this text with additional detail and context:
- Add relevant examples and illustrations
- Provide more comprehensive explanations
- Include supporting details and context
- Elaborate on key points
- Make concepts more thorough and complete

Aim to make the content more informative and detailed."""
    
    def _get_shorten_prompt(self) -> str:
        return """Condense this text to its essential elements:
- Remove redundant information and filler words
- Keep only the most important points
- Use concise, direct language
- Eliminate unnecessary elaboration
- Maintain clarity while reducing length

Perfect for summaries, social media, and headlines."""
    
    def _get_humanize_prompt(self) -> str:
        return """Rewrite this text to sound completely human-written with natural imperfections:
- Add varied sentence lengths and rhythms
- Include conversational elements and natural flow
- Remove all AI writing patterns and robotic language
- Add personality quirks and human-like touches
- Make it sound spontaneous and authentic

Focus on making it undetectable as AI-generated content."""
    
    async def _make_claude_request(self, prompt: str, max_tokens: int, temperature: float) -> str:
        """Make async request to Claude API"""
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': self.api_key,
            'anthropic-version': self.api_version
        }
        
        payload = {
            'model': 'claude-3-5-sonnet-20241022',
            'max_tokens': max_tokens,
            'temperature': temperature,
            'messages': [
                {
                    'role': 'user',
                    'content': prompt
                }
            ]
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(self.api_url, headers=headers, json=payload) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data['content'][0]['text']
                    else:
                        error_text = await response.text()
                        logger.error(f"Claude API error {response.status}: {error_text}")
                        raise ClaudeAPIError(f"API request failed with status {response.status}: {error_text}")
        
        except aiohttp.ClientError as e:
            logger.error(f"Network error calling Claude API: {e}")
            raise ClaudeAPIError(f"Network error: {e}")
        except Exception as e:
            logger.error(f"Unexpected error calling Claude API: {e}")
            raise ClaudeAPIError(f"Unexpected error: {e}")
    
    def _make_claude_request_sync(self, prompt: str, max_tokens: int, temperature: float) -> str:
        """Synchronous wrapper for Claude API request"""
        return asyncio.run(self._make_claude_request(prompt, max_tokens, temperature))
    
    async def humanize_text_async(self, text: str, tone_mode: ToneMode = ToneMode.STANDARD, 
                                  pattern_info: str = "") -> Tuple[str, Dict]:
        """
        Async method to humanize text using Claude API
        
        Args:
            text: Text to humanize
            tone_mode: Tone mode to use
            pattern_info: Additional pattern information for pattern-aware modes
            
        Returns:
            Tuple of (humanized_text, metadata)
        """
        if not text.strip():
            raise ValueError("Text cannot be empty")
        
        config = self.get_tone_config(tone_mode)
        prompt = self.build_prompt(tone_mode, text, pattern_info)
        
        api_params = self.get_api_parameters(tone_mode)
        
        try:
            humanized_text = await self._make_claude_request(
                prompt=prompt,
                max_tokens=api_params['max_tokens'],
                temperature=api_params['temperature']
            )
            
            metadata = {
                'tone_mode': tone_mode.value,
                'tone_name': config['name'],
                'original_length': len(text),
                'humanized_length': len(humanized_text),
                'temperature': api_params['temperature'],
                'max_tokens': api_params['max_tokens']
            }
            
            logger.info(f"✅ Successfully humanized text using {tone_mode.value} mode")
            return humanized_text.strip(), metadata
            
        except Exception as e:
            logger.error(f"❌ Failed to humanize text: {e}")
            raise
    
    def humanize_text(self, text: str, tone_mode: ToneMode = ToneMode.STANDARD, 
                      pattern_info: str = "") -> Tuple[str, Dict]:
        """
        Synchronous method to humanize text using Claude API
        
        Args:
            text: Text to humanize
            tone_mode: Tone mode to use
            pattern_info: Additional pattern information for pattern-aware modes
            
        Returns:
            Tuple of (humanized_text, metadata)
        """
        return asyncio.run(self.humanize_text_async(text, tone_mode, pattern_info))
    
    def get_tone_config(self, tone_mode: ToneMode) -> Dict:
        """Get configuration for a specific tone mode"""
        return self.tone_configs.get(tone_mode, self.tone_configs[ToneMode.STANDARD])
    
    def get_available_modes(self) -> Dict[str, Dict]:
        """Get all available tone modes with their details"""
        return {
            mode.value: {
                "name": config["name"],
                "description": config["description"],
                "category": config["category"],
                "use_cases": config["use_cases"]
            }
            for mode, config in self.tone_configs.items()
        }
    
    def get_modes_by_category(self) -> Dict[str, List[Dict]]:
        """Get modes organized by category"""
        categories = {}
        for mode, config in self.tone_configs.items():
            category = config["category"]
            if category not in categories:
                categories[category] = []
            
            categories[category].append({
                "mode": mode.value,
                "name": config["name"],
                "description": config["description"],
                "use_cases": config["use_cases"]
            })
        
        return categories
    
    def is_pattern_aware_mode(self, tone_mode: ToneMode) -> bool:
        """Check if a tone mode should use pattern detection"""
        config = self.get_tone_config(tone_mode)
        return config.get("pattern_aware", False)
    
    def get_api_parameters(self, tone_mode: ToneMode) -> Dict:
        """Get API parameters (max_tokens, temperature) for a tone mode"""
        config = self.get_tone_config(tone_mode)
        return {
            "max_tokens": config.get("max_tokens", 4000),
            "temperature": config.get("temperature", 0.3)
        }
    
    def build_prompt(self, tone_mode: ToneMode, text: str, pattern_info: str = "") -> str:
        """Build the complete prompt for a tone mode"""
        config = self.get_tone_config(tone_mode)
        base_prompt = config["prompt"]
        
        # Add pattern information for pattern-aware modes
        if self.is_pattern_aware_mode(tone_mode) and pattern_info:
            base_prompt += f"\n\nAdditional context about text patterns:\n{pattern_info}"
        
        # Build final prompt
        final_prompt = f"""{base_prompt}

Text to rewrite:
\"\"\"
{text}
\"\"\"

Return ONLY the rewritten version with no explanations or additional text."""
        
        return final_prompt
    
    def validate_mode(self, tone_mode_str: str) -> Optional[ToneMode]:
        """Validate and return ToneMode from string"""
        try:
            return ToneMode(tone_mode_str.lower())
        except ValueError:
            logger.warning(f"Invalid tone mode: {tone_mode_str}")
            return None
    
    def get_recommended_modes_for_use_case(self, use_case: str) -> List[ToneMode]:
        """Get recommended modes for a specific use case"""
        use_case_lower = use_case.lower()
        recommendations = []
        
        for mode, config in self.tone_configs.items():
            use_cases = [uc.lower() for uc in config["use_cases"]]
            if any(use_case_lower in uc or uc in use_case_lower for uc in use_cases):
                recommendations.append(mode)
        
        return recommendations if recommendations else [ToneMode.STANDARD]

# Usage Example
async def main():
    """Example usage of the ToneManager with Claude API"""
    
    # Initialize tone manager
    tone_manager = ToneManager()
    
    # Example text
    sample_text = """
    The implementation of artificial intelligence systems requires careful consideration of various factors.
    These systems must be designed with robustness and reliability in mind. Additionally, ethical 
    considerations should be paramount in the development process.
    """
    
    try:
        # Test different tone modes
        for mode in [ToneMode.HUMANIZE, ToneMode.CREATIVE, ToneMode.SIMPLE]:
            print(f"\n🔄 Testing {mode.value} mode...")
            
            humanized_text, metadata = await tone_manager.humanize_text_async(
                text=sample_text.strip(),
                tone_mode=mode
            )
            
            print(f"✅ {metadata['tone_name']}")
            print(f"📊 Original: {metadata['original_length']} chars → Humanized: {metadata['humanized_length']} chars")
            print(f"📝 Result: {humanized_text[:100]}...")
            
    except ClaudeAPIError as e:
        print(f"❌ API Error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
