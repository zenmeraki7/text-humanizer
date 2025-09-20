"""
Hugging Face Summarizer with Multiple Modes
Replaces Anthropic API with local Hugging Face models
"""

import logging
from enum import Enum
from typing import Tuple, Dict, List, Optional
import re
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch

logger = logging.getLogger(__name__)

class SummaryMode(Enum):
    """Available summary modes"""
    QUICK = "quick"
    DETAILED = "detailed"
    BULLETS = "bullets"
    EXECUTIVE = "executive"
    ABSTRACT = "abstract"
    TLDR = "tldr"
    OUTLINE = "outline"
    HIGHLIGHTS = "highlights"
    KEY_SENTENCES = "key_sentences"
    PARAGRAPH = "paragraph"
    SHORT = "short"

class SummaryLength(Enum):
    """Summary length options"""
    ULTRA_SHORT = "ultra_short"
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"

class HuggingFaceSummarizer:
    """Text summarizer using Hugging Face models with multiple modes"""
    
    def __init__(self, model_name="facebook/bart-large-cnn"):
        """
        Initialize with a Hugging Face model
        
        Popular models:
        - facebook/bart-large-cnn: Best quality, larger size
        - t5-small: Faster, smaller, decent quality
        - google/pegasus-xsum: Good for short summaries
        - microsoft/DialoGPT-medium: Conversational style
        """
        self.model_name = model_name
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        try:
            # Initialize the summarization pipeline
            self.summarizer = pipeline(
                "summarization", 
                model=model_name,
                device=0 if self.device == "cuda" else -1
            )
            
            # Load tokenizer for length calculations
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            
            logger.info(f"✅ Hugging Face summarizer initialized with {model_name} on {self.device}")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize model {model_name}: {e}")
            raise
        
        # Load configurations
        self.summary_configs = self._load_summary_configurations()
        self.length_configs = self._load_length_configurations()
        
        logger.info(f"✅ Summarizer ready with {len(self.summary_configs)} modes and {len(self.length_configs)} length options")

    def _load_summary_configurations(self) -> Dict[SummaryMode, Dict]:
        """Load configurations for different summary modes"""
        return {
            SummaryMode.QUICK: {
                "name": "⚡ Quick",
                "description": "Fast, brief overview of main points",
                "category": "General",
                "use_cases": ["Quick reading", "First impression"],
                "default_length": SummaryLength.SHORT,
                "prefix": "Summarize briefly: ",
                "postprocess": self._clean_basic_summary
            },
            
            SummaryMode.DETAILED: {
                "name": "📋 Detailed",
                "description": "Comprehensive summary covering important aspects",
                "category": "General", 
                "use_cases": ["Thorough understanding", "Research"],
                "default_length": SummaryLength.LONG,
                "prefix": "Provide a detailed summary: ",
                "postprocess": self._clean_basic_summary
            },
            
            SummaryMode.BULLETS: {
                "name": "🔹 Bullets",
                "description": "Clear bullet points for easy scanning",
                "category": "Structured",
                "use_cases": ["Quick reference", "Meeting notes"],
                "default_length": SummaryLength.MEDIUM,
                "prefix": "Create bullet points from: ",
                "postprocess": self._format_as_bullets
            },
            
            SummaryMode.EXECUTIVE: {
                "name": "👔 Executive",
                "description": "Professional executive summary style",
                "category": "Business",
                "use_cases": ["Business reports", "Executive briefings"],
                "default_length": SummaryLength.MEDIUM,
                "prefix": "Executive summary: ",
                "postprocess": self._format_executive_style
            },
            
            SummaryMode.ABSTRACT: {
                "name": "🎓 Abstract",
                "description": "Academic abstract format",
                "category": "Academic",
                "use_cases": ["Research papers", "Academic work"],
                "default_length": SummaryLength.MEDIUM,
                "prefix": "Academic abstract: ",
                "postprocess": self._format_academic_style
            },
            
            SummaryMode.TLDR: {
                "name": "📱 TL;DR",
                "description": "Social media style summary",
                "category": "Casual",
                "use_cases": ["Social media", "Quick shares"],
                "default_length": SummaryLength.SHORT,
                "prefix": "TL;DR: ",
                "postprocess": self._format_tldr_style
            },
            
            SummaryMode.OUTLINE: {
                "name": "📝 Outline",
                "description": "Hierarchical outline format",
                "category": "Structured",
                "use_cases": ["Study guides", "Content planning"],
                "default_length": SummaryLength.MEDIUM,
                "prefix": "Create an outline of: ",
                "postprocess": self._format_as_outline
            },
            
            SummaryMode.HIGHLIGHTS: {
                "name": "✨ Highlights",
                "description": "Key highlights and insights",
                "category": "Insights",
                "use_cases": ["Key takeaways", "Important points"],
                "default_length": SummaryLength.SHORT,
                "prefix": "Key highlights: ",
                "postprocess": self._format_as_highlights
            },
            
            SummaryMode.KEY_SENTENCES: {
                "name": "🎯 Key Sentences",
                "description": "Extract most important sentences",
                "category": "Extractive",
                "use_cases": ["Quick skim", "Preserve original phrasing"],
                "default_length": SummaryLength.MEDIUM,
                "prefix": "Key sentences: ",
                "postprocess": self._extract_key_sentences
            },
            
            SummaryMode.PARAGRAPH: {
                "name": "📄 Paragraph",
                "description": "Standard paragraph summary",
                "category": "General",
                "use_cases": ["General reading", "Standard summaries"],
                "default_length": SummaryLength.MEDIUM,
                "prefix": "Summarize: ",
                "postprocess": self._clean_basic_summary
            },
            
            SummaryMode.SHORT: {
                "name": "⚡ Short",
                "description": "Ultra-brief summary",
                "category": "Quick",
                "use_cases": ["Headlines", "Quick updates"],
                "default_length": SummaryLength.ULTRA_SHORT,
                "prefix": "One sentence summary: ",
                "postprocess": self._clean_basic_summary
            }
        }

    def _load_length_configurations(self) -> Dict[SummaryLength, Dict]:
        """Load configurations for different summary lengths"""
        return {
            SummaryLength.ULTRA_SHORT: {
                "name": "🎯 Ultra Short",
                "max_length": 50,
                "min_length": 10,
                "word_target": "20-40 words"
            },
            SummaryLength.SHORT: {
                "name": "📝 Short", 
                "max_length": 100,
                "min_length": 30,
                "word_target": "60-100 words"
            },
            SummaryLength.MEDIUM: {
                "name": "📄 Medium",
                "max_length": 200,
                "min_length": 80,
                "word_target": "100-180 words"
            },
            SummaryLength.LONG: {
                "name": "📚 Long",
                "max_length": 400,
                "min_length": 150,
                "word_target": "200-350 words"
            }
        }

    # Post-processing methods for different formats
    def _clean_basic_summary(self, text: str) -> str:
        """Basic cleaning for standard summaries"""
        # Remove any unwanted prefixes that models sometimes add
        text = re.sub(r'^(Summary:|TL;DR:|Abstract:)\s*', '', text, flags=re.IGNORECASE)
        return text.strip()

    def _format_as_bullets(self, text: str) -> str:
        """Convert summary to bullet points"""
        # Split into sentences and format as bullets
        sentences = re.split(r'[.!?]+', text)
        bullets = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence and len(sentence) > 10:  # Filter out very short fragments
                # Remove any existing bullet formatting
                sentence = re.sub(r'^[-•*]\s*', '', sentence)
                bullets.append(f"• {sentence}")
        
        return '\n'.join(bullets)

    def _format_executive_style(self, text: str) -> str:
        """Format in executive style"""
        # Add executive summary header and structure
        text = self._clean_basic_summary(text)
        
        # Try to identify key points and format professionally
        sentences = text.split('. ')
        if len(sentences) > 1:
            # First sentence as main point, rest as supporting details
            main_point = sentences[0] + '.'
            details = '. '.join(sentences[1:])
            return f"**Executive Summary:**\n\n{main_point}\n\n**Key Details:**\n{details}"
        
        return f"**Executive Summary:**\n\n{text}"

    def _format_academic_style(self, text: str) -> str:
        """Format in academic abstract style"""
        text = self._clean_basic_summary(text)
        return f"**Abstract:**\n\n{text}"

    def _format_tldr_style(self, text: str) -> str:
        """Format in TL;DR style"""
        text = self._clean_basic_summary(text)
        return f"**TL;DR:** {text}"

    def _format_as_outline(self, text: str) -> str:
        """Convert to outline format"""
        sentences = re.split(r'[.!?]+', text)
        outline_items = []
        
        for i, sentence in enumerate(sentences):
            sentence = sentence.strip()
            if sentence and len(sentence) > 10:
                outline_items.append(f"{i+1}. {sentence}")
        
        return '\n'.join(outline_items)

    def _format_as_highlights(self, text: str) -> str:
        """Format as highlights"""
        sentences = re.split(r'[.!?]+', text)
        highlights = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence and len(sentence) > 10:
                highlights.append(f"✨ {sentence}")
        
        return '\n'.join(highlights)

    def _extract_key_sentences(self, text: str) -> str:
        """Extract key sentences (this is a simplified version)"""
        # For true extractive summarization, we'd need the original text
        # Here we just clean the generated summary
        return self._clean_basic_summary(text)

    def _analyze_text_characteristics(self, text: str) -> Dict:
        """Analyze text to provide summarization context"""
        word_count = len(text.split())
        char_count = len(text)
        reading_time = max(1, round(word_count / 200))
        
        # Detect text type
        text_type = "general"
        if re.search(r'\b(abstract|methodology|results|conclusion)\b', text, re.IGNORECASE):
            text_type = "academic"
        elif re.search(r'\b(revenue|profit|quarterly|business|strategy)\b', text, re.IGNORECASE):
            text_type = "business"
        
        return {
            "word_count": word_count,
            "char_count": char_count,
            "reading_time": reading_time,
            "text_type": text_type,
            "complexity": "high" if word_count > 1000 else "medium" if word_count > 300 else "low"
        }

    def get_available_modes(self) -> Dict[str, Dict]:
        """Get all available summary modes"""
        return {
            mode.value: {
                "name": config["name"],
                "description": config["description"],
                "category": config["category"],
                "use_cases": config["use_cases"],
                "default_length": config["default_length"].value
            }
            for mode, config in self.summary_configs.items()
        }

    def get_available_lengths(self) -> Dict[str, Dict]:
        """Get all available length options"""
        return {
            length.value: {
                "name": config["name"],
                "word_target": config["word_target"]
            }
            for length, config in self.length_configs.items()
        }

    def summarize(self, text: str, mode: str = "quick", length: str = None) -> Tuple[str, str, str]:
        """
        Summarize text using specified mode and length
        
        Args:
            text: Text to summarize
            mode: Summary mode
            length: Summary length (uses mode default if None)
            
        Returns:
            Tuple of (summary, status, analysis)
        """
        if not text.strip():
            return "Please provide some text to summarize.", "❌ No text provided", "No analysis available"

        # Validate mode
        try:
            summary_mode = SummaryMode(mode.lower())
        except ValueError:
            return f"❌ Invalid summary mode: {mode}", "❌ Invalid mode", f"Available: {list(self.get_available_modes().keys())}"

        # Get configurations
        mode_config = self.summary_configs[summary_mode]
        
        if length is None:
            summary_length = mode_config["default_length"]
        else:
            try:
                summary_length = SummaryLength(length.lower())
            except ValueError:
                return f"❌ Invalid length: {length}", "❌ Invalid length", f"Available: {list(self.get_available_lengths().keys())}"

        length_config = self.length_configs[summary_length]

        try:
            # Analyze text
            text_analysis = self._analyze_text_characteristics(text)
            
            # Prepare input with mode-specific prefix
            input_text = mode_config["prefix"] + text
            
            # Check input length (most models have token limits)
            input_tokens = len(self.tokenizer.encode(input_text))
            max_input_tokens = 1024  # Common limit for many models
            
            if input_tokens > max_input_tokens:
                # Truncate input text
                tokens = self.tokenizer.encode(text)[:max_input_tokens-50]  # Leave room for prefix
                text = self.tokenizer.decode(tokens, skip_special_tokens=True)
                input_text = mode_config["prefix"] + text
                logger.warning(f"Input truncated to {max_input_tokens} tokens")

            # Generate summary
            result = self.summarizer(
                input_text,
                max_length=length_config["max_length"],
                min_length=length_config["min_length"],
                do_sample=False,
                truncation=True
            )
            
            # Extract and post-process summary
            raw_summary = result[0]['summary_text']
            processed_summary = mode_config["postprocess"](raw_summary)
            
            # Calculate statistics
            original_words = text_analysis["word_count"]
            summary_words = len(processed_summary.split())
            compression_ratio = round((1 - summary_words / original_words) * 100, 1) if original_words > 0 else 0
            
            # Generate status
            mode_name = mode_config["name"]
            length_name = length_config["name"]
            status = f"{mode_name} | {length_name} | {original_words}→{summary_words} words ({compression_ratio}% compression)"
            
            if compression_ratio > 80:
                status += " | 🎯 Excellent"
            elif compression_ratio > 60:
                status += " | ✅ Good"
            elif compression_ratio > 40:
                status += " | 📄 Moderate"
            else:
                status += " | 📝 Light"

            # Generate analysis
            analysis = f"**SUMMARIZATION ANALYSIS:**\n\n"
            analysis += f"**MODEL:** {self.model_name}\n"
            analysis += f"**ORIGINAL:** {original_words} words | {text_analysis['reading_time']} min read\n"
            analysis += f"**SUMMARY:** {summary_words} words | {length_config['word_target']} target\n"
            analysis += f"**COMPRESSION:** {compression_ratio}% reduction\n"
            analysis += f"**MODE:** {mode_config['name']} | **CATEGORY:** {mode_config['category']}"

            return processed_summary, status, analysis

        except Exception as e:
            logger.error(f"Summarization error: {str(e)}")
            return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

    # Convenience methods
    def quick_summary(self, text: str, length: str = "short") -> Tuple[str, str, str]:
        return self.summarize(text, "quick", length)
    
    def bullet_summary(self, text: str, length: str = "medium") -> Tuple[str, str, str]:
        return self.summarize(text, "bullets", length)
    
    def executive_summary(self, text: str, length: str = "medium") -> Tuple[str, str, str]:
        return self.summarize(text, "executive", length)

# Usage example
def demo_huggingface_summarizer():
    # Initialize with different models
    models_to_try = [
        "t5-small",  # Faster, smaller
        "facebook/bart-large-cnn",  # Better quality
    ]
    
    sample_text = """
    Artificial intelligence has transformed business operations in the 21st century. 
    From automated customer service to data analysis algorithms, AI technologies are 
    integrated across industries. Companies adopting AI report efficiency improvements, 
    cost reduction, and better customer satisfaction. However, implementation challenges 
    include substantial investment, employee training, and job displacement concerns. 
    Market research shows AI-investing businesses gain competitive advantages. 
    Success requires strategic planning, gradual integration, and continuous evaluation.
    """
    
    try:
        summarizer = HuggingFaceSummarizer("t5-small")  # Start with faster model
        
        print("Available modes:", list(summarizer.get_available_modes().keys()))
        print("Available lengths:", list(summarizer.get_available_lengths().keys()))
        
        # Test different modes
        modes = ["quick", "bullets", "executive", "tldr"]
        
        for mode in modes:
            summary, status, analysis = summarizer.summarize(sample_text, mode=mode)
            print(f"\n{mode.upper()} MODE:")
            print(f"Status: {status}")
            print(f"Summary: {summary}")
            print("-" * 50)
            
    except Exception as e:
        print(f"Error initializing summarizer: {e}")
        print("Make sure to install: pip install transformers torch")

if __name__ == "__main__":
    demo_huggingface_summarizer()
