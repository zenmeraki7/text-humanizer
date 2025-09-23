"""
Lightweight ToneManager for humanization
Memory-efficient for free deployments
"""

from enum import Enum
from typing import Dict, List, Optional, Tuple
import logging
import re

logger = logging.getLogger(__name__)

# Try importing transformers, fallback gracefully
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("Transformers not available, using fallback only.")

class ToneMode(Enum):
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
    """Memory-efficient ToneManager with lazy loading and fallback rules"""
    
    def __init__(self, model_name="google/flan-t5-small"):
        self.model_name = model_name
        self.tone_configs = self._load_tone_configurations()
        self.model = None
        self.model_available = False
        self.fallback_rules = {}
        self._init_fallback_rules()
        logger.info(f"ToneManager initialized (model available: {self.model_available})")

    def _load_model_lazy(self):
        """Load Hugging Face model only when needed"""
        if not self.model and TRANSFORMERS_AVAILABLE:
            try:
                logger.info(f"Loading {self.model_name} for tone changes...")
                self.model = pipeline(
                    "text2text-generation",
                    model=self.model_name,
                    device=-1,  # CPU-only for free deployment
                    max_length=512
                )
                self.model_available = True
                logger.info(f"Loaded {self.model_name}")
            except Exception as e:
                logger.error(f"Failed to load model: {e}")
                self.model_available = False

    def _init_fallback_rules(self):
        """Minimal rule-based transformations"""
        self.fallback_rules = {
            'formal': {
                'contractions': {"don't": "do not", "can't": "cannot", "I'm": "I am"},
                'replacements': {"stuff": "materials", "things": "items", "really": "considerably"}
            },
            'simple': {
                'replacements': {"utilize": "use", "commence": "start", "demonstrate": "show"}
            },
            'humanize': {
                'ai_phrases': {"furthermore": "plus", "moreover": "also", "in conclusion": "so"}
            }
        }

    def _load_tone_configurations(self) -> Dict[ToneMode, Dict]:
        """Load strongest prompts (simplified for memory)"""
        return {
            ToneMode.STANDARD: {
                "name": "Standard",
                "instruction": "Rewrite the text with neutral improvements, keep meaning.",
                "temperature": 0.3
            },
            ToneMode.FLUENCY: {
                "name": "Fluency",
                "instruction": "Rewrite the text for perfect readability and flow.",
                "temperature": 0.2
            },
            ToneMode.FORMAL: {
                "name": "Formal",
                "instruction": "Rewrite in strict professional business English.",
                "temperature": 0.1
            },
            ToneMode.SIMPLE: {
                "name": "Simple",
                "instruction": "Rewrite in plain, easy language (8th grade level).",
                "temperature": 0.2
            },
            ToneMode.CREATIVE: {
                "name": "Creative",
                "instruction": "Rewrite with unique, engaging style.",
                "temperature": 0.7
            },
            ToneMode.HUMANIZE: {
                "name": "Humanize",
                "instruction": "Rewrite to sound human, natural, and spontaneous.",
                "temperature": 0.5
            }
        }

    def _apply_rule_based_changes(self, text: str, tone_mode: str) -> str:
        """Fallback transformations"""
        rules = self.fallback_rules.get(tone_mode, {})
        result = text

        # Contractions
        for k, v in rules.get('contractions', {}).items():
            result = re.sub(rf"\b{k}\b", v, result, flags=re.IGNORECASE)
        
        # Replacements
        for k, v in rules.get('replacements', {}).items():
            result = re.sub(rf"\b{k}\b", v, result, flags=re.IGNORECASE)
        
        # AI phrase removal
        for k, v in rules.get('ai_phrases', {}).items():
            result = re.sub(rf"\b{k}\b", v, result, flags=re.IGNORECASE)
        
        return result

    def _generate_with_model(self, text: str, instruction: str, temperature: float) -> str:
        """Generate using model if available"""
        if not self.model_available:
            self._load_model_lazy()
            if not self.model_available:
                return ""
        
        try:
            prompt = f"Task: {instruction}\n\nInput: {text}\n\nOutput:"
            result = self.model(prompt, max_length=min(len(text.split())*2, 512),
                                temperature=temperature, do_sample=temperature>0.1)
            if result:
                return result[0]['generated_text'].strip()
        except Exception as e:
            logger.error(f"Model generation failed: {e}")
        return ""

    def change_tone(self, text: str, tone_mode: str) -> Tuple[str, str, str]:
        if not text.strip():
            return "No text provided", "❌", ""
        
        # Validate mode
        try:
            tone_enum = ToneMode(tone_mode.lower())
        except ValueError:
            return f"Invalid tone mode: {tone_mode}", "❌", ""

        config = self.tone_configs.get(tone_enum)
        changed_text = self._generate_with_model(text, config["instruction"], config["temperature"])
        model_used = f"Pretrained ({self.model_name})"

        if not changed_text or len(changed_text.strip()) < 5:
            changed_text = self._apply_rule_based_changes(text, tone_mode)
            model_used = "Rule-based fallback"

        status = f"{config['name']} | {model_used} | Original: {len(text.split())} → Changed: {len(changed_text.split())} words"
        analysis = f"Mode: {config['name']} | Model: {model_used} | Words changed: {len(changed_text.split()) - len(text.split())}"
        return changed_text, status, analysis

# Example usage:
if __name__ == "__main__":
    tm = ToneManager()
    text = "I don't like how complicated this stuff is."
    changed, status, analysis = tm.change_tone(text, "formal")
    print(changed)
    print(status)
    print(analysis)
