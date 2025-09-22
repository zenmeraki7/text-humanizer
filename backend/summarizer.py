"""
Llama-Based Summarizer with Multiple Modes
Replaces Hugging Face models with local Llama through Ollama
"""

import logging
from enum import Enum
from typing import Tuple, Dict, List, Optional
import re
import requests
import json

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

class LlamaSummarizer:
    """Text summarizer using Llama models through Ollama"""
    
    def __init__(self, model_name="llama2", ollama_base_url="http://localhost:11434"):
        """
        Initialize with Llama model through Ollama
        
        Popular models:
        - llama2: General purpose, good quality
        - llama2:7b-chat: Better for conversational tasks
        - codellama: Good for technical content
        - mistral: Alternative high-quality model
        """
        self.model_name = model_name
        self.ollama_base_url = ollama_base_url
        
        # Check if Ollama is available
        self.ollama_available = self._check_ollama()
        
        if not self.ollama_available:
            logger.warning("❌ Ollama not available. Falling back to extractive summarization.")
            self._init_fallback_summarizer()
        else:
            logger.info(f"✅ Llama summarizer initialized with {model_name}")
        
        # Load configurations
        self.summary_configs = self._load_summary_configurations()
        self.length_configs = self._load_length_configurations()
        
        logger.info(f"✅ Summarizer ready with {len(self.summary_configs)} modes and {len(self.length_configs)} length options")

    def _check_ollama(self) -> bool:
        """Check if Ollama is running and model is available"""
        try:
            # Check if Ollama is running
            response = requests.get(f"{self.ollama_base_url}/api/tags", timeout=3)
            if response.status_code != 200:
                return False
            
            # Check if our model is available
            models = response.json().get('models', [])
            model_names = [model['name'] for model in models]
            
            # Check if exact model or base model exists
            available = any(self.model_name in name for name in model_names)
            
            if not available:
                logger.warning(f"Model {self.model_name} not found. Available: {model_names}")
                # Try to pull the model
                logger.info(f"Attempting to pull {self.model_name}...")
                pull_response = requests.post(
                    f"{self.ollama_base_url}/api/pull",
                    json={"name": self.model_name},
                    timeout=300  # 5 minutes timeout for model download
                )
                return pull_response.status_code == 200
            
            return True
            
        except Exception as e:
            logger.error(f"Ollama check failed: {e}")
            return False

    def _init_fallback_summarizer(self):
        """Initialize simple extractive summarization as fallback"""
        try:
            import nltk
            from collections import Counter
            
            # Download required NLTK data
            try:
                nltk.data.find('tokenizers/punkt')
            except LookupError:
                nltk.download('punkt')
            
            self.fallback_available = True
            logger.info("✅ Fallback extractive summarizer ready")
            
        except Exception as e:
            logger.error(f"Failed to initialize fallback: {e}")
            self.fallback_available = False

    def _load_summary_configurations(self) -> Dict[SummaryMode, Dict]:
        """Load configurations optimized for Llama models"""
        return {
            SummaryMode.QUICK: {
                "name": "⚡ Quick",
                "description": "Fast, brief overview of main points",
                "category": "General",
                "use_cases": ["Quick reading", "First impression"],
                "default_length": SummaryLength.SHORT,
                "prompt": self._get_quick_prompt(),
                "temperature": 0.2
            },
            
            SummaryMode.DETAILED: {
                "name": "📋 Detailed",
                "description": "Comprehensive summary covering important aspects",
                "category": "General", 
                "use_cases": ["Thorough understanding", "Research"],
                "default_length": SummaryLength.LONG,
                "prompt": self._get_detailed_prompt(),
                "temperature": 0.1
            },
            
            SummaryMode.BULLETS: {
                "name": "🔹 Bullets",
                "description": "Clear bullet points for easy scanning",
                "category": "Structured",
                "use_cases": ["Quick reference", "Meeting notes"],
                "default_length": SummaryLength.MEDIUM,
                "prompt": self._get_bullets_prompt(),
                "temperature": 0.2
            },
            
            SummaryMode.EXECUTIVE: {
                "name": "👔 Executive",
                "description": "Professional executive summary style",
                "category": "Business",
                "use_cases": ["Business reports", "Executive briefings"],
                "default_length": SummaryLength.MEDIUM,
                "prompt": self._get_executive_prompt(),
                "temperature": 0.1
            },
            
            SummaryMode.ABSTRACT: {
                "name": "🎓 Abstract",
                "description": "Academic abstract format",
                "category": "Academic",
                "use_cases": ["Research papers", "Academic work"],
                "default_length": SummaryLength.MEDIUM,
                "prompt": self._get_abstract_prompt(),
                "temperature": 0.1
            },
            
            SummaryMode.TLDR: {
                "name": "📱 TL;DR",
                "description": "Social media style summary",
                "category": "Casual",
                "use_cases": ["Social media", "Quick shares"],
                "default_length": SummaryLength.SHORT,
                "prompt": self._get_tldr_prompt(),
                "temperature": 0.3
            },
            
            SummaryMode.OUTLINE: {
                "name": "📝 Outline",
                "description": "Hierarchical outline format",
                "category": "Structured",
                "use_cases": ["Study guides", "Content planning"],
                "default_length": SummaryLength.MEDIUM,
                "prompt": self._get_outline_prompt(),
                "temperature": 0.2
            },
            
            SummaryMode.HIGHLIGHTS: {
                "name": "✨ Highlights",
                "description": "Key highlights and insights",
                "category": "Insights",
                "use_cases": ["Key takeaways", "Important points"],
                "default_length": SummaryLength.SHORT,
                "prompt": self._get_highlights_prompt(),
                "temperature": 0.2
            },
            
            SummaryMode.KEY_SENTENCES: {
                "name": "🎯 Key Sentences",
                "description": "Extract most important sentences",
                "category": "Extractive",
                "use_cases": ["Quick skim", "Preserve original phrasing"],
                "default_length": SummaryLength.MEDIUM,
                "prompt": self._get_key_sentences_prompt(),
                "temperature": 0.1
            },
            
            SummaryMode.PARAGRAPH: {
                "name": "📄 Paragraph",
                "description": "Standard paragraph summary",
                "category": "General",
                "use_cases": ["General reading", "Standard summaries"],
                "default_length": SummaryLength.MEDIUM,
                "prompt": self._get_paragraph_prompt(),
                "temperature": 0.2
            },
            
            SummaryMode.SHORT: {
                "name": "⚡ Short",
                "description": "Ultra-brief summary",
                "category": "Quick",
                "use_cases": ["Headlines", "Quick updates"],
                "default_length": SummaryLength.ULTRA_SHORT,
                "prompt": self._get_short_prompt(),
                "temperature": 0.1
            }
        }

    def _load_length_configurations(self) -> Dict[SummaryLength, Dict]:
        """Load length configurations with word targets"""
        return {
            SummaryLength.ULTRA_SHORT: {
                "name": "🎯 Ultra Short",
                "word_target": "20-40 words",
                "instruction": "Summarize in exactly 1-2 sentences (20-40 words maximum)"
            },
            SummaryLength.SHORT: {
                "name": "📝 Short", 
                "word_target": "60-100 words",
                "instruction": "Summarize in 3-5 sentences (60-100 words)"
            },
            SummaryLength.MEDIUM: {
                "name": "📄 Medium",
                "word_target": "100-180 words",
                "instruction": "Summarize in 1-2 paragraphs (100-180 words)"
            },
            SummaryLength.LONG: {
                "name": "📚 Long",
                "word_target": "200-350 words",
                "instruction": "Summarize in 2-3 paragraphs (200-350 words)"
            }
        }

    # Strong prompts optimized for Llama
    def _get_quick_prompt(self) -> str:
        return """You must create a quick summary focusing on the main points only. Follow these rules:

REQUIREMENTS:
- Capture the primary message and key facts
- Include only the most important information
- Use clear, direct language
- Focus on outcomes and conclusions
- Skip minor details and examples

STYLE: Write like you're giving someone the essential points in a hurry."""

    def _get_detailed_prompt(self) -> str:
        return """You must create a comprehensive summary covering all important aspects. Follow these rules:

REQUIREMENTS:
- Include all major points and key supporting details
- Cover main arguments and evidence
- Maintain logical structure and flow
- Include important context and background
- Preserve relationships between concepts

STYLE: Thorough but concise, like a detailed briefing document."""

    def _get_bullets_prompt(self) -> str:
        return """You must create a bullet-point summary. Follow this exact format:

FORMAT REQUIREMENTS:
- Use bullet points (•) for each main point
- Each bullet should be one complete idea
- Keep bullets parallel in structure
- Order by importance or logical sequence
- Make each bullet scannable and clear

EXAMPLE FORMAT:
• First main point with key details
• Second important finding or argument
• Third significant outcome or conclusion

Write ONLY the bullet points, nothing else."""

    def _get_executive_prompt(self) -> str:
        return """You must create an executive summary for business leadership. Follow these requirements:

STRUCTURE (Use this exact format):
**Executive Summary:**

[Start with the bottom line or key recommendation]

**Key Findings:**
- [Most important finding]
- [Critical business impact]
- [Strategic implications]

**Recommendations:**
- [Primary action items]

TONE: Professional, strategic, action-oriented. Focus on business value and decisions."""

    def _get_abstract_prompt(self) -> str:
        return """You must create an academic abstract. Follow this structure:

REQUIRED SECTIONS:
- Objective: What was studied or analyzed
- Methods: How it was approached (if applicable)
- Results: Key findings and outcomes
- Conclusions: Significance and implications

STYLE: Objective, scholarly tone using precise academic language. Structure arguments logically."""

    def _get_tldr_prompt(self) -> str:
        return """You must create a casual TL;DR summary. Follow these rules:

STYLE REQUIREMENTS:
- Start with "TL;DR:"
- Use conversational, approachable language
- Focus on the most interesting or surprising points
- Make it engaging and shareable
- Explain why someone should care

TONE: Casual but informative, like explaining to a friend."""

    def _get_outline_prompt(self) -> str:
        return """You must create a structured outline. Use this exact format:

OUTLINE FORMAT:
1. [Main topic/section]
   - [Key subtopic]
   - [Important detail]
2. [Second main topic]
   - [Related subtopic]
   - [Supporting point]
3. [Third main topic]
   - [Final key points]

Use numbers for main topics, dashes for subtopics. Keep hierarchy clear and logical."""

    def _get_highlights_prompt(self) -> str:
        return """You must extract and present the most important highlights. Follow these rules:

HIGHLIGHT CRITERIA:
- Most significant insights or revelations
- Surprising or counterintuitive findings
- Key statistics or important data
- Critical recommendations or conclusions
- Memorable quotes or statements

FORMAT: Present each highlight clearly, leading with the most impactful information."""

    def _get_key_sentences_prompt(self) -> str:
        return """You must identify and extract the most important sentences from the text. Follow these rules:

SELECTION CRITERIA:
- Choose sentences that contain main ideas
- Select sentences with key facts or conclusions
- Pick sentences that can stand alone
- Maintain the author's original wording when possible
- Focus on the most informative content

Present the key sentences in logical order."""

    def _get_paragraph_prompt(self) -> str:
        return """You must create a standard paragraph summary. Follow these requirements:

PARAGRAPH STRUCTURE:
- Start with the main idea or conclusion
- Include supporting details in logical order
- Use natural, flowing language
- Maintain coherent paragraph structure
- End with significance or implications

STYLE: Clear, readable prose that flows naturally from sentence to sentence."""

    def _get_short_prompt(self) -> str:
        return """You must create an ultra-brief summary in exactly 1-2 sentences. Follow these strict rules:

REQUIREMENTS:
- Capture only the absolute core message
- Use exactly 1-2 sentences (no more)
- Include the most essential information only
- Make every word count
- Be direct and punchy

Focus on what readers absolutely need to know."""

    def _generate_with_llama(self, prompt: str, temperature: float = 0.2) -> str:
        """Generate summary using Llama through Ollama"""
        try:
            response = requests.post(
                f"{self.ollama_base_url}/api/generate",
                json={
                    "model": self.model_name,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "top_p": 0.9,
                        "max_tokens": 512,
                        "stop": ["\\n\\n\\n", "---"]  # Stop on triple newlines or separators
                    }
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()["response"].strip()
                return self._clean_llama_response(result)
            else:
                logger.error(f"Ollama request failed: {response.status_code}")
                return ""
                
        except Exception as e:
            logger.error(f"Llama generation failed: {e}")
            return ""

    def _clean_llama_response(self, response: str) -> str:
        """Clean up Llama's response"""
        # Remove common prefixes
        prefixes_to_remove = [
            "Here's a summary:",
            "Here is the summary:",
            "Summary:",
            "The summary is:",
            "Here's the",
            "This is a"
        ]
        
        response = response.strip()
        for prefix in prefixes_to_remove:
            if response.lower().startswith(prefix.lower()):
                response = response[len(prefix):].strip()
        
        # Remove quotes if entire response is quoted
        if response.startswith('"') and response.endswith('"'):
            response = response[1:-1].strip()
        
        # Clean up excessive newlines
        response = re.sub(r'\n{3,}', '\n\n', response)
        
        return response

    def _extractive_fallback(self, text: str, target_sentences: int = 3) -> str:
        """Simple extractive summarization fallback"""
        try:
            import nltk
            from collections import Counter
            
            sentences = nltk.sent_tokenize(text)
            if len(sentences) <= target_sentences:
                return ' '.join(sentences)
            
            # Simple frequency-based ranking
            words = nltk.word_tokenize(text.lower())
            word_freq = Counter(word for word in words if word.isalnum())
            
            sentence_scores = {}
            for sentence in sentences:
                words_in_sentence = nltk.word_tokenize(sentence.lower())
                score = sum(word_freq.get(word, 0) for word in words_in_sentence if word.isalnum())
                sentence_scores[sentence] = score / len(words_in_sentence) if words_in_sentence else 0
            
            top_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:target_sentences]
            
            # Maintain original order
            result = []
            for sentence in sentences:
                if any(sentence == s[0] for s in top_sentences):
                    result.append(sentence)
                    if len(result) == target_sentences:
                        break
            
            return ' '.join(result)
            
        except Exception:
            # Ultimate fallback - return first few sentences
            sentences = text.split('. ')
            return '. '.join(sentences[:target_sentences]) + '.'

    def _analyze_text_characteristics(self, text: str) -> Dict:
        """Analyze text characteristics"""
        word_count = len(text.split())
        char_count = len(text)
        reading_time = max(1, round(word_count / 200))
        
        text_type = "general"
        if re.search(r'\b(abstract|methodology|results|conclusion)\b', text, re.IGNORECASE):
            text_type = "academic"
        elif re.search(r'\b(revenue|profit|quarterly|business|strategy)\b', text, re.IGNORECASE):
            text_type = "business"
        elif re.search(r'\b(once upon|story|character|narrative)\b', text, re.IGNORECASE):
            text_type = "narrative"
        
        return {
            "word_count": word_count,
            "char_count": char_count,
            "reading_time": reading_time,
            "text_type": text_type,
            "complexity": "high" if word_count > 1000 else "medium" if word_count > 300 else "low"
        }

    # Public interface methods
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
        Summarize text using Llama models
        
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
            
            # Build prompt for Llama
            base_prompt = mode_config["prompt"]
            length_instruction = length_config["instruction"]
            
            llama_prompt = f"""You are an expert summarizer. {base_prompt}

LENGTH REQUIREMENT: {length_instruction}

Text to summarize:
\"\"\"
{text}
\"\"\"

Summary:"""

            # Generate summary
            if self.ollama_available:
                summary = self._generate_with_llama(llama_prompt, mode_config["temperature"])
                model_used = f"Llama ({self.model_name})"
            else:
                # Use extractive fallback
                target_sentences = {
                    SummaryLength.ULTRA_SHORT: 1,
                    SummaryLength.SHORT: 2,
                    SummaryLength.MEDIUM: 4,
                    SummaryLength.LONG: 6
                }.get(summary_length, 3)
                summary = self._extractive_fallback(text, target_sentences)
                model_used = "Extractive fallback"
            
            # Validate result
            if not summary:
                return "❌ Summarization failed", "❌ No summary generated", f"Model: {model_used}"
            
            # Calculate statistics
            original_words = text_analysis["word_count"]
            summary_words = len(summary.split())
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
            analysis += f"**MODEL:** {model_used}\n"
            analysis += f"**ORIGINAL:** {original_words} words | {text_analysis['reading_time']} min read | {text_analysis['complexity']} complexity\n"
            analysis += f"**SUMMARY:** {summary_words} words | {length_config['word_target']} target\n"
            analysis += f"**COMPRESSION:** {compression_ratio}% reduction | {mode_config['name']} style\n"
            analysis += f"**TEXT TYPE:** {text_analysis['text_type'].title()} | **COST:** Free"

            return summary, status, analysis

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
def demo_llama_summarizer():
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
        summarizer = LlamaSummarizer("llama2")
        
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
        print(f"Error: {e}")
        print("Make sure Ollama is installed and running with llama2 model")

if __name__ == "__main__":
    demo_llama_summarizer()
