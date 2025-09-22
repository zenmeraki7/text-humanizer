# """
# Updated Tone Modes Module with Llama Integration
# Handles all tone-related functionality using free Llama models
# """

# from enum import Enum
# from typing import Dict, List, Optional, Tuple
# import logging
# #import torch
# import requests
# import json

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
#     """Manages tone modes, prompts, and tone-specific logic with Llama models"""
    
#     def __init__(self, use_ollama: bool = True, ollama_model: str = "llama2"):
#         self.tone_configs = self._load_tone_configurations()
#         self.use_ollama = use_ollama
#         self.ollama_model = ollama_model
#         self.ollama_base_url = "http://localhost:11434"
        
#         # Check if Ollama is available
#         self.ollama_available = self._check_ollama() if use_ollama else False
        
#         # Initialize fallback model if needed
#         self.fallback_model = None
#         if not self.ollama_available:
#             self._init_fallback_model()
        
#         logger.info(f"✅ Tone Manager initialized with {len(self.tone_configs)} modes")
#         if self.ollama_available:
#             logger.info(f"✅ Using Ollama with {ollama_model}")
#         else:
#             logger.info("✅ Using fallback model (rule-based transformations)")
    
#     def _check_ollama(self) -> bool:
#         """Check if Ollama is running"""
#         try:
#             response = requests.get(f"{self.ollama_base_url}/api/tags", timeout=3)
#             return response.status_code == 200
#         except:
#             return False
    
#     def _init_fallback_model(self):
#         """Initialize simple rule-based transformations as fallback"""
#         self.fallback_rules = {
#             'formal': {
#                 'contractions': {
#                     "don't": "do not", "won't": "will not", "can't": "cannot",
#                     "isn't": "is not", "aren't": "are not", "wasn't": "was not",
#                     "I'm": "I am", "you're": "you are", "it's": "it is"
#                 },
#                 'replacements': {
#                     'stuff': 'items', 'things': 'elements', 'guy': 'individual',
#                     'gets': 'obtains', 'got': 'obtained', 'really': 'considerably'
#                 }
#             },
#             'simple': {
#                 'replacements': {
#                     'utilize': 'use', 'commence': 'start', 'demonstrate': 'show',
#                     'substantial': 'large', 'numerous': 'many', 'implement': 'do'
#                 }
#             }
#         }

#     def _load_tone_configurations(self) -> Dict[ToneMode, Dict]:
#         """Load all tone mode configurations - same as before"""
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
#             }
#         }

#     # Keep all your existing prompt methods unchanged
#     def _get_standard_prompt(self) -> str:
#         return """You must rewrite this text with neutral improvements while preserving the original meaning. Follow these rules exactly:

# MANDATORY CHANGES:
# - Replace awkward phrases with natural alternatives
# - Fix grammar errors and improve sentence flow
# - Remove robotic patterns like "Furthermore," "Moreover," "In conclusion"
# - Vary sentence lengths (mix short and long sentences)
# - Use active voice instead of passive voice where possible

# KEEP UNCHANGED:
# - The main message and key points
# - Technical terms that are necessary
# - The author's overall tone and style

# EXAMPLES OF IMPROVEMENTS:
# - "Furthermore, it is important to note" → "It's also worth mentioning"
# - "In order to achieve" → "To achieve"
# - "It can be seen that" → "This shows"

# Write only the rewritten version. Do not add explanations."""

#     def _get_fluency_prompt(self) -> str:
#         return """You must rewrite this text for perfect readability and natural flow. Follow these strict rules:

# SENTENCE FLOW RULES:
# - Connect ideas smoothly without choppy transitions
# - Remove awkward phrasing immediately
# - Fix all grammar and punctuation errors
# - Make every sentence flow into the next naturally

# RHYTHM REQUIREMENTS:
# - Mix short sentences (5-10 words) with longer ones (15-25 words)
# - Remove repetitive sentence starts
# - Use transitions like: "Also," "However," "Then," "Plus," "But"
# - Make it sound like natural conversation

# FORBIDDEN PHRASES:
# - "It should be noted that"
# - "It is worth mentioning"
# - "One might consider"
# - "It appears that"
# - Any overly formal or robotic language

# REQUIRED STYLE: Write like you're explaining to a friend - clear, smooth, and easy to read.

# Write only the improved version."""

#     def _get_formal_prompt(self) -> str:
#         return """You must rewrite this text in strict business-professional format. Follow these exact requirements:

# VOCABULARY CHANGES:
# - Replace ALL contractions: don't→do not, can't→cannot, won't→will not
# - Use professional terms: get→obtain, show→demonstrate, help→assist
# - Replace casual words: stuff→materials, things→items, guys→individuals

# SENTENCE STRUCTURE:
# - Start sentences formally: "The analysis indicates..." not "This shows..."
# - Use complete sentences with proper subjects
# - Avoid starting with "And," "But," "So,"
# - Use phrases like: "It is recommended that," "Analysis suggests," "Data indicates"

# TONE REQUIREMENTS:
# - Respectful and authoritative
# - No casual expressions or slang
# - Third-person perspective preferred
# - Professional courtesy language

# EXAMPLES:
# - "We think this works" → "Analysis suggests this approach is effective"
# - "This is really important" → "This factor is particularly significant"
# - "Let's try this" → "It is recommended that we implement this approach"

# Write in perfect business English only."""

#     def _get_simple_prompt(self) -> str:
#         return """You must rewrite this text for someone with basic education. Follow these mandatory rules:

# WORD REPLACEMENT (Replace these immediately):
# - utilize→use, commence→start, demonstrate→show, implement→do
# - substantial→big, numerous→many, facilitate→help, approximately→about
# - methodology→method, functionality→feature, optimize→improve
# - subsequent→next, prior→before, indicate→show

# SENTENCE RULES:
# - Maximum 15 words per sentence
# - Break long sentences into 2-3 shorter ones
# - Use simple subject-verb-object structure
# - Start sentences with simple words: "The," "This," "You," "We"

# EXPLANATION STYLE:
# - If you use a technical term, immediately explain it in simple words
# - Use examples: "For instance," "Like," "Such as"
# - Use everyday comparisons people understand

# FORBIDDEN WORDS/PHRASES:
# - Complex words when simple ones exist
# - Jargon or technical terms without explanation
# - Long, winding sentences
# - Academic or business language

# TARGET: Write for someone reading at 8th grade level. Every word should be easily understood.

# Write only the simplified version."""

#     def _get_creative_prompt(self) -> str:
#         return """You must rewrite this text with engaging, creative style. Follow these specific requirements:

# CREATIVE TECHNIQUES (Use at least 3):
# - Add vivid imagery: "crystal clear" instead of "clear"
# - Use metaphors: "navigate challenges" instead of "handle problems"
# - Include sensory details: colors, sounds, textures
# - Add personality with unique word choices
# - Create rhythm with varied sentence patterns

# ENGAGING ELEMENTS:
# - Start with hooks: "Picture this:" "Imagine if..." "Here's the thing:"
# - Use power words: amazing, remarkable, extraordinary, breakthrough
# - Add emotional language that connects with readers
# - Include rhetorical questions: "But what if there's more?"

# STYLE REQUIREMENTS:
# - Write like a skilled storyteller
# - Make boring topics interesting
# - Use active, dynamic verbs
# - Create momentum that pulls readers forward
# - Add unexpected word choices that surprise

# EXAMPLES:
# - "The results were good" → "The results were nothing short of remarkable"
# - "This method works" → "This approach works like magic"
# - "It's important" → "Here's what'll blow your mind"

# Write with flair and personality. Make it memorable."""

#     def _get_academic_prompt(self) -> str:
#         return """You must rewrite this text in strict academic format. Follow these scholarly requirements:

# ACADEMIC VOCABULARY (Replace these):
# - shows→demonstrates, proves→indicates, thinks→postulates
# - says→states, talks about→discusses, looks at→examines
# - finds→discovers, uses→employs, helps→facilitates

# SCHOLARLY PHRASES (Use these):
# - "Research indicates that..."
# - "Evidence suggests..."
# - "Studies have demonstrated..."
# - "The literature supports..."
# - "Empirical data reveals..."
# - "Analysis demonstrates..."

# STRUCTURE REQUIREMENTS:
# - Present arguments logically with clear progression
# - Use transitional phrases: "Furthermore," "Moreover," "Consequently," "Additionally"
# - Support claims with reasoning
# - Maintain objective, third-person perspective
# - Use complex sentence structures appropriately

# TONE STANDARDS:
# - Formal and authoritative
# - Objective and analytical
# - Precise and measured
# - No casual language or contractions
# - Evidence-based statements

# EXAMPLES:
# - "This works well" → "This methodology demonstrates considerable efficacy"
# - "Many people think" → "Substantial evidence suggests"
# - "The results show" → "The findings indicate"

# Write in formal academic style suitable for peer-reviewed publication."""

#     def _get_expand_prompt(self) -> str:
#         return """You must expand this text with substantial additional detail. Follow these expansion rules:

# CONTENT ADDITIONS (Add all of these):
# - Relevant examples for each main point
# - Background context where needed
# - Supporting details and explanations
# - Practical applications or implications
# - Step-by-step breakdowns of processes

# EXPANSION TECHNIQUES:
# - After each main point, add: "For example..." or "Specifically..."
# - Include statistics, data, or research when relevant
# - Add cause-and-effect explanations
# - Provide multiple perspectives on topics
# - Include potential challenges and solutions

# STRUCTURE REQUIREMENTS:
# - Expand each paragraph to 2-3 times its length
# - Add transitions between expanded sections
# - Maintain logical flow despite increased length
# - Group related details together

# TARGET LENGTH: Aim for 2-3 times the original word count while maintaining quality.

# EXAMPLES:
# - "Exercise is beneficial" → "Exercise provides numerous health benefits including improved cardiovascular function, enhanced mental wellbeing, stronger immune system, and increased longevity. For example, just 30 minutes of moderate exercise three times per week can reduce heart disease risk by up to 35% according to recent studies."

# Write the comprehensive, detailed version only."""

#     def _get_shorten_prompt(self) -> str:
#         return """You must condense this text to essential information only. Follow these strict reduction rules:

# IMMEDIATE REMOVALS:
# - All filler words: "basically," "actually," "really," "quite," "rather"
# - Redundant phrases: "in order to"→"to," "due to the fact that"→"because"
# - Wordy expressions: "at this point in time"→"now," "in the event that"→"if"
# - Unnecessary qualifiers: "It should be noted that," "It is important to mention"

# CONDENSATION METHODS:
# - Combine related sentences into one concise statement
# - Remove examples unless absolutely critical
# - Keep only the most important points
# - Use strong, specific verbs instead of weak verb phrases
# - Replace long phrases with single words where possible

# WORD REPLACEMENTS:
# - "utilize" → "use"
# - "demonstrate" → "show"
# - "indicate" → "show"
# - "in order to" → "to"
# - "a large number of" → "many"

# TARGET: Reduce to 50-70% of original length while keeping all essential meaning.

# EXAMPLES:
# - "It is important to note that regular exercise can help to improve your overall health" → "Regular exercise improves health"
# - "Due to the fact that technology is advancing" → "As technology advances"

# Write only the condensed version. No explanations."""

#     def _get_humanize_prompt(self) -> str:
#         return """You must rewrite this text to sound completely human-written and bypass AI detection. Follow these critical rules:

# REMOVE AI PATTERNS (Eliminate these immediately):
# - "Furthermore," "Moreover," "Additionally," "In conclusion"
# - "It's important to note," "It should be mentioned," "One might consider"
# - Perfect parallel structure and overly balanced sentences
# - Robotic transitions and scaffolding language

# ADD HUMAN CHARACTERISTICS:
# - Mix sentence lengths: some short (3-8 words), some medium (10-15), some longer (20+ words)
# - Use contractions naturally: don't, won't, I've, there's, it's
# - Add conversational elements: "Look," "Here's the thing," "Actually," "Plus"
# - Include slight imperfections in structure (not errors, just natural flow)

# NATURAL LANGUAGE PATTERNS:
# - Start some sentences with "And" or "But"
# - Use ellipses for trailing thoughts...
# - Add personal touches: "I think," "seems like," "probably"
# - Include natural asides in parentheses (like this)
# - Use rhetorical questions that sound conversational

# EXAMPLES:
# - "Furthermore, it is essential to consider" → "Plus, you should probably think about"
# - "In conclusion, the data suggests" → "So basically, what this shows is"
# - "This methodology demonstrates" → "This approach works because"

# GOAL: Make it sound like a real person wrote this spontaneously, not an AI following instructions.

# Write only the humanized version."""

#     # NEW METHOD: Generate text using Llama
#     def _generate_with_llama(self, prompt: str, temperature: float = 0.3) -> str:
#         """Generate text using Ollama/Llama"""
#         try:
#             response = requests.post(
#                 f"{self.ollama_base_url}/api/generate",
#                 json={
#                     "model": self.ollama_model,
#                     "prompt": prompt,
#                     "stream": False,
#                     "options": {
#                         "temperature": temperature,
#                         "top_p": 0.9,
#                         "max_tokens": 512
#                     }
#                 },
#                 timeout=30
#             )
            
#             if response.status_code == 200:
#                 result = response.json()["response"].strip()
#                 return self._clean_llama_response(result)
#             else:
#                 logger.error(f"Ollama request failed: {response.status_code}")
#                 return ""
                
#         except Exception as e:
#             logger.error(f"Llama generation failed: {e}")
#             return ""
    
#     def _clean_llama_response(self, response: str) -> str:
#         """Clean up Llama's response"""
#         # Remove common prefixes that Llama might add
#         prefixes_to_remove = [
#             "Here's the rewritten text:",
#             "Rewritten text:",
#             "Here is the rewritten version:",
#             "The rewritten version is:",
#         ]
        
#         response = response.strip()
#         for prefix in prefixes_to_remove:
#             if response.lower().startswith(prefix.lower()):
#                 response = response[len(prefix):].strip()
        
#         # Remove quotes if entire response is quoted
#         if (response.startswith('"') and response.endswith('"')):
#             response = response[1:-1].strip()
        
#         return response
    
#     def _apply_fallback_rules(self, text: str, tone_mode: str) -> str:
#         """Apply simple rule-based transformations as fallback"""
#         if tone_mode not in self.fallback_rules:
#             return text
        
#         rules = self.fallback_rules[tone_mode]
#         result = text
        
#         # Apply contractions
#         if 'contractions' in rules:
#             for contraction, expansion in rules['contractions'].items():
#                 result = result.replace(contraction, expansion)
        
#         # Apply word replacements
#         if 'replacements' in rules:
#             for old_word, new_word in rules['replacements'].items():
#                 # Use word boundaries to avoid partial matches
#                 import re
#                 pattern = r'\b' + re.escape(old_word) + r'\b'
#                 result = re.sub(pattern, new_word, result, flags=re.IGNORECASE)
        
#         return result

#     # NEW METHOD: Main tone changing function
#     def change_tone(self, text: str, tone_mode: str, pattern_info: str = "") -> Tuple[str, str, str]:
#         """
#         Change tone using Llama models - NEW MAIN METHOD
        
#         Args:
#             text: Original text
#             tone_mode: Target tone mode
#             pattern_info: Pattern information for pattern-aware modes
            
#         Returns:
#             Tuple of (changed_text, status, analysis)
#         """
#         if not text.strip():
#             return "Please provide text to change tone.", "❌ No text provided", "No analysis available"
        
#         # Validate tone mode
#         tone_enum = self.validate_mode(tone_mode)
#         if not tone_enum:
#             return f"❌ Invalid tone mode: {tone_mode}", "❌ Invalid mode", f"Available: {list(self.get_available_modes().keys())}"
        
#         # Get configuration
#         config = self.get_tone_config(tone_enum)
        
#         try:
#             # Build prompt
#             prompt = self.build_prompt_for_llama(tone_enum, text, pattern_info)
            
#             # Generate using Llama or fallback
#             if self.ollama_available:
#                 changed_text = self._generate_with_llama(prompt, config["temperature"])
#                 model_used = f"Ollama ({self.ollama_model})"
#             else:
#                 # Use rule-based fallback
#                 changed_text = self._apply_fallback_rules(text, tone_mode)
#                 model_used = "Rule-based fallback"
            
#             # Validate result
#             if not changed_text or changed_text.strip() == text.strip():
#                 return "❌ Tone change failed", "❌ No changes made", f"Model: {model_used}"
            
#             # Calculate statistics
#             original_words = len(text.split())
#             changed_words = len(changed_text.split())
            
#             # Generate status
#             status = f"{config['name']} | {model_used} | {original_words} → {changed_words} words | Free"
            
#             # Generate analysis
#             analysis = f"**TONE CHANGE ANALYSIS:**\n\n"
#             analysis += f"**MODEL:** {model_used}\n"
#             analysis += f"**ORIGINAL:** {original_words} words\n"
#             analysis += f"**CHANGED:** {changed_words} words\n"
#             analysis += f"**MODE:** {config['name']} | **CATEGORY:** {config['category']}\n"
#             analysis += f"**COST:** Completely free"
            
#             return changed_text, status, analysis
            
#         except Exception as e:
#             logger.error(f"Tone change error: {e}")
#             return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

#     # NEW METHOD: Build prompts specifically for Llama
#     def build_prompt_for_llama(self, tone_mode: ToneMode, text: str, pattern_info: str = "") -> str:
#         """Build prompt optimized for Llama models"""
#         config = self.get_tone_config(tone_mode)
#         base_instructions = config["prompt"]
        
#         # Add pattern information for pattern-aware modes
#         if self.is_pattern_aware_mode(tone_mode) and pattern_info:
#             base_instructions += f"\n\nAdditional patterns to address: {pattern_info}"
        
#         # Create Llama-optimized prompt
#         llama_prompt = f"""You are an expert writer. Rewrite the following text in {tone_mode} tone.

# Instructions:
# {base_instructions}

# Original text: "{text}"

# Rewritten text:"""
        
#         return llama_prompt

#     # Keep all existing methods unchanged
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
#         """Build the complete prompt for a tone mode - DEPRECATED, use change_tone() directly"""
#         return self.build_prompt_for_llama(tone_mode, text, pattern_info)
    
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
Enhanced Tone Modes Module with Pretrained Models
Replaces Ollama with lightweight Hugging Face models and strongest prompts
"""

from enum import Enum
from typing import Dict, List, Optional, Tuple
import logging
import re

logger = logging.getLogger(__name__)

# Try to import transformers, fall back gracefully if not available
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("Transformers not available. Using fallback methods only.")

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

class ToneManager:
    """Manages tone modes using pretrained models with strongest prompts"""
    
    def __init__(self, model_name="google/flan-t5-small"):
        """
        Initialize with lightweight pretrained model
        
        Recommended models for cloud deployment:
        - google/flan-t5-small: 80MB, excellent instruction following
        - t5-small: 60MB, basic text-to-text
        - google/flan-t5-base: 250MB, better quality (if memory allows)
        """
        self.model_name = model_name
        self.tone_configs = self._load_tone_configurations()
        
        # Initialize pretrained model
        self.model_available = False
        self.model = None
        
        if TRANSFORMERS_AVAILABLE:
            self._init_pretrained_model()
        
        # Initialize fallback rules
        self._init_fallback_rules()
        
        logger.info(f"Tone Manager initialized - Model available: {self.model_available}")
    
    def _init_pretrained_model(self):
        """Initialize the pretrained model"""
        try:
            logger.info(f"Loading {self.model_name} for tone changes...")
            
            self.model = pipeline(
                "text2text-generation",
                model=self.model_name,
                device=-1,  # Force CPU for cloud compatibility
                max_length=512
            )
            
            self.model_available = True
            logger.info(f"Successfully loaded {self.model_name}")
            
        except Exception as e:
            logger.error(f"Failed to load {self.model_name}: {e}")
            self.model_available = False
    
    def _init_fallback_rules(self):
        """Initialize comprehensive rule-based fallback transformations"""
        self.fallback_rules = {
            'formal': {
                'contractions': {
                    "don't": "do not", "won't": "will not", "can't": "cannot",
                    "isn't": "is not", "aren't": "are not", "wasn't": "was not",
                    "weren't": "were not", "haven't": "have not", "hasn't": "has not",
                    "hadn't": "had not", "shouldn't": "should not", "wouldn't": "would not",
                    "couldn't": "could not", "mustn't": "must not", "I'm": "I am",
                    "you're": "you are", "he's": "he is", "she's": "she is",
                    "it's": "it is", "we're": "we are", "they're": "they are"
                },
                'replacements': {
                    'stuff': 'materials', 'things': 'items', 'guy': 'individual',
                    'gets': 'obtains', 'got': 'obtained', 'really': 'considerably',
                    'pretty': 'quite', 'big': 'substantial', 'lots of': 'numerous',
                    'kind of': 'somewhat', 'sort of': 'somewhat', 'okay': 'acceptable'
                }
            },
            'simple': {
                'replacements': {
                    'utilize': 'use', 'commence': 'start', 'demonstrate': 'show',
                    'substantial': 'large', 'numerous': 'many', 'implement': 'do',
                    'facilitate': 'help', 'methodology': 'method', 'optimize': 'improve',
                    'approximately': 'about', 'subsequent': 'next', 'prior': 'before',
                    'indicate': 'show', 'acquire': 'get', 'terminate': 'end',
                    'comprehend': 'understand', 'endeavor': 'try', 'sufficient': 'enough'
                }
            },
            'creative': {
                'enhancements': [
                    ('good', 'remarkable'), ('nice', 'delightful'), ('big', 'massive'),
                    ('small', 'tiny'), ('fast', 'lightning-quick'), ('slow', 'leisurely'),
                    ('important', 'crucial'), ('interesting', 'fascinating'),
                    ('difficult', 'challenging'), ('easy', 'effortless')
                ]
            },
            'humanize': {
                'ai_phrases': {
                    'furthermore': 'plus', 'moreover': 'also', 'in addition': 'and',
                    'it is important to note': '', 'it should be mentioned': '',
                    'in conclusion': 'so', 'to summarize': 'basically',
                    'as a result': 'so', 'consequently': 'so', 'therefore': 'so'
                }
            }
        }

    def _load_tone_configurations(self) -> Dict[ToneMode, Dict]:
        """Load tone configurations with strongest possible prompts"""
        return {
            ToneMode.STANDARD: {
                "name": "🎯 Standard",
                "description": "Neutral rewrite with small tweaks in structure and vocabulary",
                "category": "General",
                "use_cases": ["Default option", "Balanced improvements", "Maintain original tone"],
                "pattern_aware": True,
                "instruction": """You are a professional editor. Rewrite this text with neutral improvements while preserving the original meaning and tone. 

MANDATORY CHANGES:
- Fix awkward phrasing and improve sentence flow
- Remove robotic patterns like "Furthermore," "Moreover," "In conclusion"
- Vary sentence lengths naturally (mix 5-word and 20-word sentences)
- Use active voice instead of passive voice where possible
- Replace obvious AI scaffolding with natural transitions

PRESERVE:
- Original meaning and key points
- Author's voice and style
- Technical terms that are necessary

EXAMPLES:
"Furthermore, it is important to note" → "It's also worth mentioning"
"In order to achieve" → "To achieve"
"It can be seen that" → "This shows"

Rewrite ONLY the improved version with no explanations.""",
                "temperature": 0.3
            },
            
            ToneMode.FLUENCY: {
                "name": "📖 Fluency",
                "description": "Focus on smooth readability and natural flow",
                "category": "Readability", 
                "use_cases": ["Fix awkward phrasing", "Improve sentence flow", "Grammar corrections"],
                "pattern_aware": True,
                "instruction": """You are an expert writing coach. Rewrite this text for perfect fluency and natural flow.

STRICT REQUIREMENTS:
- Every sentence must flow smoothly into the next
- Remove all choppy, robotic phrasing immediately
- Fix every grammar and punctuation error
- Create natural rhythm with varied sentence lengths
- Use conversational transitions: "Also," "Plus," "But," "Then," "However"

FORBIDDEN PHRASES (eliminate these):
- "It should be noted that"
- "It is worth mentioning" 
- "One might consider"
- "It appears that"
- Any formal academic scaffolding

REQUIRED STYLE: Write like you're explaining to a smart friend - clear, flowing, and easy to read.

Rewrite for perfect readability with no explanations.""",
                "temperature": 0.2
            },
            
            ToneMode.FORMAL: {
                "name": "👔 Formal",
                "description": "Polished, professional tone for business contexts",
                "category": "Professional",
                "use_cases": ["Business emails", "Reports", "Official documents"],
                "pattern_aware": False,
                "instruction": """You are a corporate communications specialist. Rewrite this text in strict business-professional format.

MANDATORY VOCABULARY CHANGES:
- Replace ALL contractions: don't→do not, can't→cannot, won't→will not, it's→it is
- Use professional terms: get→obtain, show→demonstrate, help→assist, use→utilize
- Replace casual words: stuff→materials, things→items, guys→individuals, really→considerably

SENTENCE STRUCTURE RULES:
- Begin formally: "The analysis indicates..." not "This shows..."
- Use complete sentences with proper subjects
- Never start with "And," "But," "So,"
- Use phrases: "It is recommended that," "Analysis suggests," "Data indicates"

PROFESSIONAL TONE:
- Third-person perspective preferred
- Respectful and authoritative language
- No casual expressions or slang
- Professional courtesy throughout

TRANSFORMATION EXAMPLES:
"We think this works" → "Analysis suggests this approach demonstrates effectiveness"
"This is really important" → "This factor represents particular significance"
"Let's try this" → "It is recommended that we implement this approach"

Rewrite in perfect business English with no explanations.""",
                "temperature": 0.1
            },
            
            ToneMode.SIMPLE: {
                "name": "🔍 Simple",
                "description": "Break down complex text into plain, easy language",
                "category": "Accessibility",
                "use_cases": ["Beginner-friendly content", "Technical explanations", "Clear communication"],
                "pattern_aware": False,
                "instruction": """You are a plain language expert. Rewrite this text for someone with basic education (8th grade reading level).

MANDATORY WORD REPLACEMENTS:
utilize→use, commence→start, demonstrate→show, implement→do, substantial→big, 
numerous→many, facilitate→help, approximately→about, methodology→method, 
functionality→feature, optimize→improve, subsequent→next, prior→before, 
indicate→show, acquire→get, terminate→end, endeavor→try, sufficient→enough

SENTENCE STRUCTURE RULES:
- Maximum 15 words per sentence
- Break long sentences into 2-3 shorter ones
- Use simple subject-verb-object structure
- Start with simple words: "The," "This," "You," "We"

EXPLANATION STYLE:
- Define technical terms immediately in simple words
- Use examples: "For instance," "Like," "Such as"
- Use everyday comparisons people understand

FORBIDDEN ELEMENTS:
- Jargon without explanation
- Long, winding sentences
- Academic or business language
- Complex words when simple ones work

TARGET: Every word should be easily understood by a middle school student.

Rewrite in simple, clear language with no explanations.""",
                "temperature": 0.2
            },
            
            ToneMode.CREATIVE: {
                "name": "🎨 Creative",
                "description": "Add uniqueness, style, and engaging elements",
                "category": "Creative",
                "use_cases": ["Blog posts", "Storytelling", "Marketing content", "Social media"],
                "pattern_aware": False,
                "instruction": """You are a creative writing expert. Rewrite this text with engaging, memorable style that captures attention.

CREATIVE TECHNIQUES (use at least 4):
- Vivid imagery: "crystal clear" instead of "clear," "razor-sharp focus" instead of "focused"
- Fresh metaphors: "navigate challenges" vs "handle problems," "unlock potential" vs "improve"
- Sensory details: colors, sounds, textures, emotions
- Power words: remarkable, extraordinary, breakthrough, revolutionary, game-changing
- Varied sentence rhythms for musical flow
- Unexpected word choices that surprise and delight

ENGAGING HOOKS:
- Start with: "Picture this:" "Here's what's fascinating:" "Imagine if..."
- Use rhetorical questions: "But what if there's more?" "Ready for the twist?"
- Create curiosity gaps and momentum

DYNAMIC LANGUAGE:
- Active, energetic verbs instead of passive constructions
- Emotional words that create connection
- Conversational asides and personality
- Memorable phrases that stick

TRANSFORMATION EXAMPLES:
"The results were good" → "The results were nothing short of extraordinary"
"This method works well" → "This approach works like pure magic"
"It's quite important" → "Here's what'll absolutely blow your mind"

Write with creative flair that makes people want to keep reading. No explanations.""",
                "temperature": 0.7
            },
            
            ToneMode.ACADEMIC: {
                "name": "🎓 Academic",
                "description": "Scholarly style with precise, technical vocabulary",
                "category": "Academic",
                "use_cases": ["Research papers", "Essays", "Academic reports", "Scholarly work"],
                "pattern_aware": False,
                "instruction": """You are a distinguished academic researcher. Rewrite this text in formal scholarly style suitable for peer-reviewed publication.

ACADEMIC VOCABULARY TRANSFORMATIONS:
shows→demonstrates, proves→indicates, thinks→postulates, says→states, 
talks about→discusses, looks at→examines, finds→discovers, uses→employs, 
helps→facilitates, big→substantial, many→numerous, important→significant

REQUIRED SCHOLARLY PHRASES:
- "Research indicates that..." "Evidence suggests..." "Studies have demonstrated..."
- "The literature supports..." "Empirical data reveals..." "Analysis demonstrates..."
- "Furthermore," "Moreover," "Consequently," "Additionally," "Nevertheless"
- "It can be postulated that..." "The findings indicate..." "This research establishes..."

ACADEMIC STRUCTURE:
- Present arguments with clear logical progression
- Support every claim with reasoning or evidence
- Use complex sentence structures appropriately
- Maintain objective, third-person perspective
- Employ precise technical terminology

TONE REQUIREMENTS:
- Formal and authoritative without being pretentious
- Objective and analytical throughout
- Measured and evidence-based statements
- No casual language or contractions

TRANSFORMATION EXAMPLES:
"This works well" → "This methodology demonstrates considerable efficacy"
"Many people think" → "Substantial empirical evidence suggests"
"The results show" → "The findings conclusively indicate"

Write in formal academic prose suitable for scholarly publication. No explanations.""",
                "temperature": 0.1
            },
            
            ToneMode.EXPAND: {
                "name": "📈 Expand",
                "description": "Add detail, examples, and comprehensive explanations",
                "category": "Content Development",
                "use_cases": ["Add context", "Detailed explanations", "Content writing"],
                "pattern_aware": False,
                "instruction": """You are a content development expert. Expand this text with substantial additional detail while maintaining quality.

EXPANSION REQUIREMENTS (add ALL of these):
- Relevant examples for every main point ("For example," "Specifically," "To illustrate")
- Background context and explanatory details
- Step-by-step breakdowns of processes or concepts
- Multiple perspectives on key topics
- Practical applications and real-world implications
- Supporting evidence and elaboration

EXPANSION TECHNIQUES:
- After each claim, add: "This is evident because..." or "The reason for this is..."
- Include specific data, statistics, or research when relevant
- Provide cause-and-effect explanations
- Add potential challenges and solutions
- Include comparisons to help understanding

STRUCTURE REQUIREMENTS:
- Expand each paragraph to 2-3 times original length
- Maintain logical flow despite increased content
- Group related details coherently
- Use smooth transitions between expanded sections

TARGET: Aim for 2.5-3x the original word count while maintaining engaging quality.

EXAMPLE:
"Exercise is beneficial" → "Exercise provides numerous scientifically-proven health benefits including improved cardiovascular function, enhanced mental wellbeing, stronger immune system response, and increased longevity. For example, research from the American Heart Association demonstrates that just 30 minutes of moderate exercise three times per week can reduce heart disease risk by up to 35%. Additionally, studies show exercise triggers the release of endorphins, leading to improved mood and reduced anxiety levels..."

Expand with comprehensive detail and no explanations.""",
                "temperature": 0.4
            },
            
            ToneMode.SHORTEN: {
                "name": "✂️ Shorten",
                "description": "Condense text while preserving key information",
                "category": "Concision",
                "use_cases": ["Summaries", "Social media posts", "Headlines", "Quick overviews"],
                "pattern_aware": False,
                "instruction": """You are a master editor specializing in concise communication. Condense this text to essential information only.

IMMEDIATE ELIMINATIONS:
- Filler words: "basically," "actually," "really," "quite," "rather," "somewhat"
- Redundant phrases: "in order to"→"to," "due to the fact that"→"because," "at this point in time"→"now"
- Unnecessary qualifiers: "It should be noted that," "It is important to mention that"
- Wordy constructions: "make a decision"→"decide," "conduct an analysis"→"analyze"

CONDENSATION METHODS:
- Combine related sentences into single powerful statements
- Remove examples unless absolutely critical to understanding
- Keep only the most important points and conclusions
- Use strong, specific verbs instead of weak verb phrases
- Replace long phrases with precise single words

WORD EFFICIENCY RULES:
"utilize"→"use," "demonstrate"→"show," "indicate"→"show," "a large number of"→"many,"
"in the event that"→"if," "make an improvement to"→"improve," "reach a conclusion"→"conclude"

TARGET: Reduce to 50-70% of original length while preserving ALL essential meaning.

TRANSFORMATION EXAMPLES:
"It is important to note that regular exercise can help to improve your overall health and wellbeing" → "Regular exercise improves health"
"Due to the fact that technology is advancing rapidly in today's modern world" → "As technology advances"

Condense to maximum efficiency with no explanations.""",
                "temperature": 0.2
            },
            
            ToneMode.HUMANIZE: {
                "name": "🤝 Humanize",
                "description": "Add natural imperfections and human-like flow",
                "category": "AI Detection",
                "use_cases": ["Bypass AI detection", "Natural writing", "Human-like content"],
                "pattern_aware": True,
                "instruction": """You are an expert in natural human communication. Rewrite this text to sound completely human-written and bypass AI detection systems.

ELIMINATE AI PATTERNS (remove these immediately):
- "Furthermore," "Moreover," "Additionally," "In conclusion," "To summarize"
- "It's important to note," "It should be mentioned," "One might consider," "It appears that"
- Perfect parallel structure and overly balanced sentences
- Robotic transitions and academic scaffolding
- Overly formal or mechanical phrasing

ADD HUMAN CHARACTERISTICS:
- Natural sentence variety: some very short (3-5 words), some medium (8-15), some longer (20+)
- Contractions used naturally: don't, won't, I've, there's, it's, we're, they're
- Conversational elements: "Look," "Here's the thing," "Actually," "Plus," "Honestly"
- Slight structural imperfections (not errors, just natural human flow)

NATURAL SPEECH PATTERNS:
- Start some sentences with "And" or "But" naturally
- Use ellipses for trailing thoughts or pauses...
- Include personal touches: "I think," "seems like," "probably," "maybe"
- Natural asides in parentheses (like this observation)
- Rhetorical questions that feel conversational

TRANSFORMATION EXAMPLES:
"Furthermore, it is essential to consider the implications" → "Plus, you've got to think about what this actually means"
"In conclusion, the data clearly demonstrates" → "So basically, what we're seeing here is..."
"This methodology exhibits significant potential" → "This approach actually works pretty well"

GOAL: Make it sound like a real person wrote this spontaneously in their natural voice.

Rewrite with authentic human voice and no explanations.""",
                "temperature": 0.5
            }
        }

    def _generate_with_model(self, text: str, instruction: str, temperature: float = 0.3) -> str:
        """Generate text using pretrained model"""
        if not self.model_available:
            return ""
        
        try:
            # Create optimized prompt for T5/FLAN models
            prompt = f"Task: {instruction}\n\nInput text: {text}\n\nOutput:"
            
            # Generate with model
            result = self.model(
                prompt,
                max_length=min(len(text.split()) * 2, 512),
                temperature=temperature,
                do_sample=True if temperature > 0.1 else False,
                top_p=0.9,
                repetition_penalty=1.1
            )
            
            if result and len(result) > 0:
                generated = result[0]['generated_text'].strip()
                return self._clean_model_output(generated)
                
        except Exception as e:
            logger.error(f"Model generation error: {e}")
        
        return ""
    
    def _clean_model_output(self, text: str) -> str:
        """Clean and optimize model output"""
        # Remove common prefixes that models add
        prefixes = [
            "output:", "result:", "rewritten text:", "rewrite:", "text:",
            "here's the text:", "the text is:", "here is the rewritten version:",
            "task:", "input text:", "rewritten:", "improved text:"
        ]
        
        text_lower = text.lower()
        for prefix in prefixes:
            if text_lower.startswith(prefix):
                text = text[len(prefix):].strip()
                break
        
        # Remove quotes if entire text is quoted
        if text.startswith('"') and text.endswith('"'):
            text = text[1:-1].strip()
        elif text.startswith("'") and text.endswith("'"):
            text = text[1:-1].strip()
        
        # Clean up extra whitespace
        text = ' '.join(text.split())
        
        return text

    def _apply_rule_based_changes(self, text: str, tone_mode: str) -> str:
        """Apply comprehensive rule-based transformations as fallback"""
        if tone_mode not in self.fallback_rules:
            return text
        
        rules = self.fallback_rules[tone_mode]
        result = text
        
        # Apply contractions (for formal mode)
        if 'contractions' in rules:
            for contraction, expansion in rules['contractions'].items():
                # Case-sensitive replacement
                result = result.replace(contraction, expansion)
                result = result.replace(contraction.title(), expansion.title())
                result = result.replace(contraction.upper(), expansion.upper())
        
        # Apply word replacements
        if 'replacements' in rules:
            for old_word, new_word in rules['replacements'].items():
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(old_word) + r'\b'
                result = re.sub(pattern, new_word, result, flags=re.IGNORECASE)
        
        # Apply creative enhancements
        if 'enhancements' in rules:
            for old_word, new_word in rules['enhancements']:
                pattern = r'\b' + re.escape(old_word) + r'\b'
                result = re.sub(pattern, new_word, result, flags=re.IGNORECASE)
        
        # Apply AI phrase removal (for humanize mode)
        if 'ai_phrases' in rules:
            for ai_phrase, replacement in rules['ai_phrases'].items():
                result = result.replace(ai_phrase, replacement)
                result = result.replace(ai_phrase.title(), replacement.title())
        
        # Clean up extra spaces
        result = ' '.join(result.split())
        
        return result

    def change_tone(self, text: str, tone_mode: str, pattern_info: str = "") -> Tuple[str, str, str]:
        """Change tone using pretrained models with strongest prompts or fallback methods"""
        
        if not text.strip():
            return "Please provide text to change tone.", "❌ No text provided", "No analysis available"
        
        # Validate tone mode
        tone_enum = self.validate_mode(tone_mode)
        if not tone_enum:
            return f"❌ Invalid tone mode: {tone_mode}", "❌ Invalid mode", f"Available: {list(self.get_available_modes().keys())}"
        
        # Get configuration
        config = self.get_tone_config(tone_enum)
        
        try:
            changed_text = ""
            
            # Try pretrained model first
            if self.model_available:
                changed_text = self._generate_with_model(
                    text, 
                    config["instruction"], 
                    config["temperature"]
                )
                model_used = f"Pretrained ({self.model_name})"
            
            # Fallback to rule-based if model fails or unavailable
            if not changed_text or len(changed_text.strip()) < 10:
                changed_text = self._apply_rule_based_changes(text, tone_mode)
                model_used = "Rule-based fallback"
            
            # Final validation
            if not changed_text or changed_text.strip() == text.strip():
                return "❌ Tone change failed", "❌ No changes made", f"Model: {model_used}"
            
            # Calculate statistics
            original_words = len(text.split())
            changed_words = len(changed_text.split())
            
            # Generate status
            status = f"{config['name']} | {model_used} | {original_words} → {changed_words} words | Free"
            
            # Generate analysis
            analysis = f"**TONE CHANGE ANALYSIS:**\n\n"
            analysis += f"**MODEL:** {model_used}\n"
            analysis += f"**ORIGINAL:** {original_words} words\n"
            analysis += f"**CHANGED:** {changed_words} words\n"
            analysis += f"**MODE:** {config['name']} | **CATEGORY:** {config['category']}\n"
            analysis += f"**COST:** Completely free"
            
            return changed_text, status, analysis
            
        except Exception as e:
            logger.error(f"Tone change error: {e}")
            return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

    # Interface methods (keep all existing)
    def get_tone_config(self, tone_mode: ToneMode) -> Dict:
        return self.tone_configs.get(tone_mode, self.tone_configs[ToneMode.STANDARD])
    
    def get_available_modes(self) -> Dict[str, Dict]:
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
        config = self.get_tone_config(tone_mode)
        return config.get("pattern_aware", False)
    
    def validate_mode(self, tone_mode_str: str) -> Optional[ToneMode]:
        try:
            return ToneMode(tone_mode_str.lower())
        except ValueError:
            logger.warning(f"Invalid tone mode: {tone_mode_str}")
            return None
    
    def get_recommended_modes_for_use_case(self, use_case: str) -> List[ToneMode]:
        use_case_lower = use_case.lower()
        recommendations = []
        
        for mode, config in self.tone_configs.items():
            use_cases = [uc.lower() for uc in config["use_cases"]]
            if any(use_case_lower in uc or uc in use_case_lower for uc in use_cases):
                recommendations.append(mode)
        
        return recommendations if recommendations else [ToneMode.STANDARD]
