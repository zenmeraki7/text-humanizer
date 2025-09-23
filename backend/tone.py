"""
Enhanced Tone Modes Module
Uses lightweight Hugging Face models with rule-based fallbacks.
Compatible with free-tier deployments.
"""

from enum import Enum
from typing import Dict, List, Optional, Tuple
import logging
import re

logger = logging.getLogger(__name__)

# Try to import transformers
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("Transformers not available. Using rule-based fallback only.")


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
    def __init__(self, model_name="google/flan-t5-small"):
        self.model_name = model_name
        self.tone_configs = self._load_tone_configurations()
        self.model_available = False
        self.model = None
        if TRANSFORMERS_AVAILABLE:
            self._init_pretrained_model()
        self._init_fallback_rules()
        logger.info(f"ToneManager initialized. Model available: {self.model_available}")

    def _init_pretrained_model(self):
        try:
            self.model = pipeline(
                "text2text-generation",
                model=self.model_name,
                device=-1,  # CPU
                max_length=512
            )
            self.model_available = True
        except Exception as e:
            logger.error(f"Failed to load {self.model_name}: {e}")
            self.model_available = False

    def _init_fallback_rules(self):
        self.fallback_rules = {
            "formal": {
                "contractions": {
                    "don't": "do not", "won't": "will not", "can't": "cannot",
                    "isn't": "is not", "aren't": "are not", "I'm": "I am",
                    "you're": "you are"
                },
                "replacements": {
                    "stuff": "materials", "things": "items", "guy": "individual"
                }
            },
            "simple": {
                "replacements": {
                    "utilize": "use", "commence": "start", "demonstrate": "show"
                }
            },
            "creative": {
                "enhancements": [
                    ("good", "remarkable"), ("nice", "delightful"), ("big", "massive")
                ]
            },
            "humanize": {
                "ai_phrases": {
                    "furthermore": "plus", "moreover": "also", "in conclusion": "so"
                }
            }
        }

    def _load_tone_configurations(self) -> Dict[ToneMode, Dict]:
        return {mode: {"name": mode.value.capitalize(), "description": "", "category": "General",
                       "use_cases": [], "pattern_aware": True, "instruction": ""} for mode in ToneMode}

    def _generate_with_model(self, text: str, instruction: str, temperature: float = 0.3) -> str:
        if not self.model_available:
            return ""
        try:
            prompt = f"Task: {instruction}\n\nInput text: {text}\n\nOutput:"
            result = self.model(prompt, max_length=min(len(text.split())*2, 512),
                                temperature=temperature,
                                do_sample=True if temperature > 0.1 else False,
                                top_p=0.9,
                                repetition_penalty=1.1)
            if result:
                return self._clean_model_output(result[0]['generated_text'])
        except Exception as e:
            logger.error(f"Model generation error: {e}")
        return ""

    def _clean_model_output(self, text: str) -> str:
        prefixes = ["output:", "result:", "rewritten text:", "rewrite:", "text:"]
        text_lower = text.lower()
        for prefix in prefixes:
            if text_lower.startswith(prefix):
                text = text[len(prefix):].strip()
        if text.startswith('"') and text.endswith('"'):
            text = text[1:-1].strip()
        text = ' '.join(text.split())
        return text

    def _apply_rule_based_changes(self, text: str, tone_mode: str) -> str:
        if tone_mode not in self.fallback_rules:
            return text
        rules = self.fallback_rules[tone_mode]
        result = text
        if 'contractions' in rules:
            for k, v in rules['contractions'].items():
                result = re.sub(rf'\b{k}\b', v, result, flags=re.IGNORECASE)
        if 'replacements' in rules:
            for k, v in rules['replacements'].items():
                result = re.sub(rf'\b{k}\b', v, result, flags=re.IGNORECASE)
        if 'enhancements' in rules:
            for k, v in rules['enhancements']:
                result = re.sub(rf'\b{k}\b', v, result, flags=re.IGNORECASE)
        if 'ai_phrases' in rules:
            for k, v in rules['ai_phrases'].items():
                result = re.sub(rf'\b{k}\b', v, result, flags=re.IGNORECASE)
        return ' '.join(result.split())

    def change_tone(self, text: str, tone_mode: str) -> Tuple[str, str, str]:
        if not text.strip():
            return "No text provided.", "❌ No text", "No analysis"
        tone_enum = self.validate_mode(tone_mode)
        if not tone_enum:
            return f"Invalid tone mode: {tone_mode}", "❌ Invalid", f"Available: {list(self.get_available_modes().keys())}"
        config = self.get_tone_config(tone_enum)
        try:
            changed_text = ""
            model_used = ""
            if self.model_available:
                changed_text = self._generate_with_model(text, config["instruction"], config["temperature"])
                model_used = f"Pretrained ({self.model_name})"
            if not changed_text or len(changed_text.strip()) < 10:
                changed_text = self._apply_rule_based_changes(text, tone_mode)
                model_used = "Rule-based fallback"
            if not changed_text or changed_text.strip() == text.strip():
                return "❌ Tone change failed", "❌ No changes made", f"Model: {model_used}"
            original_words = len(text.split())
            changed_words = len(changed_text.split())
            status = f"{config['name']} | {model_used} | {original_words} → {changed_words} words | Free"
            analysis = f"**MODEL:** {model_used}\n**ORIGINAL:** {original_words} words\n**CHANGED:** {changed_words} words"
            return changed_text, status, analysis
        except Exception as e:
            logger.error(f"Tone change error: {e}")
            return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

    # Interface
    def get_tone_config(self, tone_mode: ToneMode) -> Dict:
        return self.tone_configs.get(tone_mode, self.tone_configs[ToneMode.STANDARD])

    def get_available_modes(self) -> Dict[str, Dict]:
        return {mode.value: {"name": cfg["name"], "description": cfg["description"], "category": cfg["category"]}
                for mode, cfg in self.tone_configs.items()}

    def validate_mode(self, tone_mode_str: str) -> Optional[ToneMode]:
        try:
            return ToneMode(tone_mode_str.lower())
        except ValueError:
            return None
