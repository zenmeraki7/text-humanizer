# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import anthropic
# import re
# import random
# import math
# import os
# from collections import Counter
# from typing import Dict, List, Optional

# from dotenv import load_dotenv
# import os

# load_dotenv()  

# api_key = os.getenv("ANTHROPIC_API_KEY")
# if not api_key:
#     raise ValueError("ANTHROPIC_API_KEY environment variable is required")

# # Initialize FastAPI app


# app = FastAPI(title="AI Text Detector & Humanizer API", version="1.0.0")

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class AITextDetectorHumanizer:
#     def __init__(self, ANTHROPIC_API_KEY: str):
#         self.client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
#         self.ai_patterns = self._load_detection_patterns()
#         self.humanized_alternatives = self._load_humanized_alternatives()

#     def _load_detection_patterns(self):
#         """Comprehensive AI writing pattern database for detection"""
#         patterns = {
#             'ai_cliches': [
#                 "in today's fast-paced world", "with that being said", "at the end of the day",
#                 "ultimately", "below is a", "there is no doubt", "it goes without saying",
#                 "in this article", "this article will", "moving forward", "as such",
#                 "in order to", "due to the fact", "based on the", "when it comes to",
#                 "as a matter of fact", "it is important to note", "from a standpoint",
#                 "under the circumstances", "going forward", "needless to say", "in light of",
#                 "in conclusion", "to summarize", "to wrap up", "ultimately speaking",
#                 "at the same time", "in addition", "furthermore", "moreover", "additionally",
#                 "on the other hand", "conversely", "in contrast", "nevertheless", "nonetheless",
#                 "however", "therefore", "hence", "thus", "consequently", "as a result",
#                 "for example", "for instance", "take for example", "to illustrate",
#                 "in summary", "basically", "essentially", "significantly", "fundamentally",
#                 "broadly speaking", "generally speaking", "in general", "overall",
#                 "predominantly", "typically", "commonly", "often times", "sometimes",
#                 "frequently", "rarely", "invariably", "unequivocally", "truly", "definitely",
#                 "absolutely", "certainly", "obviously", "clearly", "evidently", "surprisingly",
#                 "unexpectedly", "as we all know", "it's worth noting", "it should be noted",
#                 "one could argue", "some might say", "experts agree", "studies show",
#                 "research indicates", "it is widely believed", "it is commonly believed",
#                 "take into consideration", "bear in mind", "keep in mind", "it stands to reason",
#                 "needless to mention", "to begin with", "firstly", "secondly", "thirdly",
#                 "lastly", "finally", "on the whole", "in the meantime", "meanwhile",
#                 "simultaneously", "at the present time", "at this point in time", "at this stage",
#                 "in the near future", "soon enough", "shortly after", "immediately",
#                 "momentarily", "as soon as possible", "without further ado", "moving on",
#                 "turning to", "regarding", "concerning", "with respect to", "in terms of",
#                 "in relation to", "as far as ... is concerned", "regarding the", "as outlined above",
#                 "as discussed", "as mentioned", "as noted", "as highlighted", "as emphasized",
#                 "it should not be overlooked", "it cannot be denied", "one thing is clear",
#                 "it begs the question", "the fact of the matter is", "as previously stated",
#                 "as previously mentioned", "as earlier noted", "as shown above",
#                 "as illustrated above", "refer to the", "in closing", "in brief", "in short",
#                 "to put it simply", "to put it bluntly", "to put it another way",
#                 "in other words", "that is to say", "namely", "specifically", "particularly",
#                 "especially", "notably", "importantly", "critically", "crucially", "vitally",
#                 "most importantly", "more importantly", "equally important", "on a daily basis",
#                 "on a regular basis", "day in and day out", "time and time again",
#                 "from time to time", "once in a while", "every now and then",
#                 "at any given moment", "at all times", "to a large extent", "to a great extent",
#                 "to some extent", "to a certain extent", "more or less", "for the most part",
#                 "by and large", "in most cases", "in certain cases", "in rare instances"
#             ],

#             'corporate_buzzwords': [
#                 "cutting-edge", "state-of-the-art", "leveraging", "synergy", "paradigm",
#                 "holistic", "scalable", "robust", "end-to-end", "turnkey", "streamline",
#                 "optimize", "empower", "unprecedented", "game-changer", "next-generation",
#                 "revolutionary", "innovative", "disruptive", "groundbreaking", "best-in-class",
#                 "value-added", "actionable", "data-driven", "insightful", "transformative",
#                 "strategic", "mission-critical", "core competencies", "key takeaways", "win-win",
#                 "low-hanging fruit", "circle back", "touch base", "deep dive", "move the needle",
#                 "boil the ocean", "think outside the box", "best practices", "thought leadership",
#                 "value proposition", "customizable-enabled", "next-gen solutions",
#                 "workflows-driven", "cross-functional blueprints", "redefine-oriented",
#                 "cross-functional value chains", "resilient value chains", "collaborative networks",
#                 "benchmarks-based", "benchmarks-driven", "comprehensive-centric",
#                 "next-gen workflows", "future-ready ecosystems", "next-gen blueprints",
#                 "flexible-enabled", "collaborative ecosystems", "insights-based",
#                 "next-gen interfaces", "drive-oriented", "algorithms-driven", "weigh-oriented",
#                 "seamless models", "future-ready experiences", "enterprise-grade-centric",
#                 "robust value chains", "enable-powered", "architect solutions",
#                 "scenarios-based", "paradigms-driven", "enterprise-grade methodologies",
#                 "mobilize methodologies", "visualize-powered", "synthesize-powered",
#                 "efficiencies-driven", "transform protocols", "centralized-centric",
#                 "agile workflows", "modular workflows", "accelerate-powered", "frameworks-based"
#             ],

#             'revelation_phrases': self._load_revelation_phrases(),

#             'escalation_phrases': self._load_escalation_phrases(),

#             'truth_telling_phrases': self._load_truth_telling_phrases(),

#             'dramatic_fragments': self._load_dramatic_fragments(),

#             'inspirational_endings': self._load_inspirational_endings(),

#             'list_scaffolding': [
#                 "here are the key points", "let's break this down", "there are several factors",
#                 "consider the following", "here's what you need to know", "the main benefits include",
#                 "key considerations include", "important factors to consider", "let's explore",
#                 "we'll cover", "in this guide", "step-by-step process", "comprehensive overview"
#             ],

#             'ai_hedging': [
#                 "it's worth noting that", "it's important to remember", "keep in mind that",
#                 "it should be noted", "one might argue", "it could be argued", "some may say",
#                 "it's possible that", "potentially", "arguably", "presumably", "conceivably",
#                 "in many cases", "typically", "generally", "often", "frequently", "commonly",
#                 "tends to", "may result in", "could lead to", "might cause", "has the potential"
#             ],

#             'generic_conclusions': [
#                 "in conclusion", "to conclude", "in summary", "to sum up", "overall",
#                 "all things considered", "taking everything into account", "when all is said and done",
#                 "in the final analysis", "ultimately", "in the end", "as we've seen",
#                 "as demonstrated", "as shown", "clearly", "evidently", "obviously"
#             ],

#             'artificial_enthusiasm': [
#                 "exciting opportunity", "tremendous potential", "incredible benefits",
#                 "amazing results", "fantastic solution", "outstanding performance",
#                 "remarkable achievement", "exceptional quality", "extraordinary value",
#                 "incredible impact", "amazing possibilities", "fantastic opportunity"
#             ],

#             'robotic_transitions': [
#                 "moving on to", "turning our attention to", "shifting focus to", "proceeding to",
#                 "continuing with", "advancing to", "progressing to", "transitioning to",
#                 "next, we'll examine", "now, let's consider", "subsequently", "thereafter"
#             ],

#             'repetitive_structures': [
#                 "not only... but also", "both... and", "either... or", "neither... nor",
#                 "on one hand... on the other hand", "while... also", "although... however",
#                 "despite... nevertheless", "even though... still", "whereas... conversely"
#             ],

#             'clickbait_patterns': [
#                 "you won't believe", "this will shock you", "doctors hate this", "number will surprise you",
#                 "this changes everything", "mind-blowing", "life-changing", "game-changing revelation",
#                 "industry secret", "hidden truth", "what they don't want you to know"
#             ],

#             'ai_disclaimers': [
#                 "as an ai", "i'm an ai", "as a language model", "i don't have personal experience",
#                 "i can't", "i'm not able to", "i don't have access", "i can't browse the internet",
#                 "i should note", "it's important to note", "please note", "disclaimer"
#             ]
#         }

#         patterns['uniform_sentences'] = self._detect_uniform_structure_patterns()
#         return patterns

#     def _load_revelation_phrases(self):
#         """Load revelation phrase patterns"""
#         return [
#             "that's the lie", "that's the catch", "that's the twist", "that's the deal",
#             "that's the truth", "that's the secret", "that's the problem", "that's the proof",
#             "that's the reason", "that's the kicker", "that's the fact", "that's the point",
#             "that's the thing", "that's the question", "that's the report", "that's the surprise",
#             "that's the hitch", "that's the hiccup", "that's the revelation", "that's the plot twist",
#             "here's the lie", "here's the catch", "here's the twist", "here's the deal",
#             "here's the truth", "here's the secret", "here's the problem", "here's the proof",
#             "here's the reason", "here's the kicker", "here's the fact", "here's the point",
#             "here's the thing", "here's the question", "here's the report", "here's the surprise",
#             "but here's the catch", "but here's the twist", "but here's the truth",
#             "and that's the catch", "now here's the catch", "the truth is", "the catch is",
#             "what happens next", "you won't believe", "here's what nobody tells you"
#         ]

#     def _load_escalation_phrases(self):
#         """Load escalation phrase patterns"""
#         return [
#             "that's what makes myth dangerous", "that's what makes truth terrifying",
#             "that's what makes secret deadly", "that's what makes danger real",
#             "that's what makes illusion fatal", "that's what makes fear real",
#             "that's what makes consequence dire", "that's what makes consequence fatal",
#             "that's what makes impact devastating", "that's what makes impact irreversible",
#             "that's what makes threat immediate", "that's what makes danger imminent",
#             "that's what makes risk uncontrollable", "that's what makes power overwhelming",
#             "that's what makes the danger", "that's what makes the threat",
#             "that's what makes the risk", "that's what makes the peril",
#             "that's why it is myth dangerous", "that's why it is truth terrifying",
#             "that's why it is secret deadly", "that's why it is danger real",
#             "that's how it becomes myth dangerous", "that's how it becomes truth terrifying",
#             "that's how it becomes secret deadly", "that's how it becomes danger real"
#         ]

#     def _load_truth_telling_phrases(self):
#         """Load truth-telling phrase patterns"""
#         return [
#             "but here's the truth no one wants to say out loud",
#             "but here's the truth that everyone ignores",
#             "but here's the truth hidden behind the hype",
#             "but here's the truth we all choose to ignore",
#             "but here's the truth you need to hear",
#             "here's the truth no one wants to say out loud",
#             "here's the truth that everyone ignores",
#             "here's the truth hidden behind the hype",
#             "let's be honest no one wants to say out loud",
#             "to be frank no one wants to say out loud",
#             "no one wants to admit no one wants to say out loud",
#             "the real story is no one wants to say out loud",
#             "the cold, hard truth is no one wants to say out loud",
#             "let me be clear no one wants to say out loud",
#             "nobody will tell you no one wants to say out loud",
#             "few dare to say no one wants to say out loud",
#             "it's time to face the truth no one wants to say out loud",
#             "uncomfortable as it is no one wants to say out loud",
#             "here's what nobody mentions no one wants to say out loud",
#             "the unspoken fact is no one wants to say out loud"
#         ]

#     def _load_dramatic_fragments(self):
#         """Load dramatic fragment patterns"""
#         return [
#             "until something does break. usually it's you.",
#             "until something does break. no one sees it coming.",
#             "until something does break. and then you're alone.",
#             "until something does break. that's when you realize.",
#             "until something does break. it always ends this way.",
#             "before the world ends. usually it's you.",
#             "before the world ends. no one sees it coming.",
#             "when the lights fade. usually it's you.",
#             "when the lights fade. no one sees it coming.",
#             "after the silence falls. usually it's you.",
#             "once the truth is revealed. usually it's you.",
#             "before hope disappears. usually it's you.",
#             "when the walls close in. usually it's you.",
#             "after the mask slips. usually it's you.",
#             "once shadows grow longer. usually it's you.",
#             "when the night takes over. usually it's you.",
#             "before the breath escapes. usually it's you.",
#             "when the heart gives in. usually it's you.",
#             "after the facade crumbles. usually it's you.",
#             "once the tension snaps. usually it's you.",
#             "when the final act begins. usually it's you.",
#             "before the calm shatters. usually it's you.",
#             "when the storm approaches. usually it's you.",
#             "after the echo dies. usually it's you.",
#             "once the spark ignites. usually it's you.",
#             "when the blade falls. usually it's you.",
#             "after the lies unravel. usually it's you.",
#             "before the last word. usually it's you.",
#             "when the fabric tears. usually it's you.",
#             "once the mirror cracks. usually it's you."
#         ]

#     def _load_inspirational_endings(self):
#         """Load inspirational ending patterns"""
#         return [
#             "always remember the only limit is yourself",
#             "always remember your potential knows no bounds",
#             "always remember you are your greatest asset",
#             "always remember your dreams are within reach",
#             "always remember you have the power to change",
#             "never forget the only limit is yourself",
#             "never forget your potential knows no bounds",
#             "never forget you are your greatest asset",
#             "never forget your dreams are within reach",
#             "never forget you have the power to change",
#             "keep in mind the only limit is yourself",
#             "keep in mind your potential knows no bounds",
#             "keep in mind you are your greatest asset",
#             "believe that the only limit is yourself",
#             "believe that your potential knows no bounds",
#             "believe that you are your greatest asset",
#             "know that the only limit is yourself",
#             "know that your potential knows no bounds",
#             "know that you are your greatest asset",
#             "embrace the fact that the only limit is yourself",
#             "embrace the fact that your potential knows no bounds",
#             "embrace the fact that you are your greatest asset"
#         ]

#     def _detect_uniform_structure_patterns(self):
#         """Patterns that indicate uniform sentence structure (AI characteristic)"""
#         return [
#             "^[A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+\\.",
#             "\\. [A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+\\.",
#         ]

#     def _load_humanized_alternatives(self):
#         """Enhanced humanized alternatives"""
#         alternatives = {
#             "in today's fast-paced world": [
#                 "these days", "nowadays", "right now", "with everything moving so quickly", "lately"
#             ],
#             "with that being said": [
#                 "but", "however", "though", "that said", "still", "even so"
#             ],
#             "at the end of the day": [
#                 "ultimately", "in the end", "when it comes down to it", "what matters most", "bottom line"
#             ],
#             "it goes without saying": [
#                 "obviously", "clearly", "naturally", "of course", "everyone knows"
#             ],
#             "leverage": [
#                 "use", "tap into", "make use of", "take advantage of", "work with"
#             ],
#             "optimize": [
#                 "improve", "make better", "fine-tune", "enhance", "perfect"
#             ],
#             "cutting-edge": [
#                 "latest", "newest", "advanced", "modern", "up-to-date", "fresh"
#             ],
#             "furthermore": [
#                 "plus", "also", "and", "what's more", "on top of that", "besides"
#             ],
#             "however": [
#                 "but", "though", "yet", "still", "on the flip side", "that said"
#             ],
#             "therefore": [
#                 "so", "that's why", "which means", "as a result", "because of this"
#             ]
#         }
#         return alternatives

#     def analyze_sentence_structure(self, text):
#         """Analyze sentence structure uniformity (AI indicator)"""
#         sentences = re.split(r'[.!?]+', text)
#         sentences = [s.strip() for s in sentences if s.strip()]

#         if len(sentences) < 3:
#             return 0, "Insufficient sentences for analysis"

#         lengths = [len(s.split()) for s in sentences]
#         avg_length = sum(lengths) / len(lengths)
#         variance = sum((l - avg_length) ** 2 for l in lengths) / len(lengths)

#         uniformity_score = max(0, 1 - (variance / (avg_length * 2)))

#         starters = [s.split()[0].lower() if s.split() else "" for s in sentences]
#         starter_diversity = len(set(starters)) / len(starters) if starters else 1

#         structure_score = (uniformity_score * 0.6) + ((1 - starter_diversity) * 0.4)

#         details = f"Avg length: {avg_length:.1f}, Variance: {variance:.1f}, Starter diversity: {starter_diversity:.2f}"

#         return structure_score, details

#     def detect_ai_patterns(self, text):
#         """Enhanced pattern detection with scoring"""
#         detected = {}
#         text_lower = text.lower()

#         for category, patterns in self.ai_patterns.items():
#             if category == 'uniform_sentences':
#                 continue

#             detected[category] = []
#             for pattern in patterns:
#                 if re.search(r'\b' + re.escape(pattern.lower()) + r'\b', text_lower):
#                     detected[category].append(pattern)

#         detected = {k: v for k, v in detected.items() if v}
#         return detected

#     def calculate_ai_score(self, text):
#         """Calculate comprehensive AI probability score"""
#         if not text.strip():
#             return 0, "No text provided"

#         detected_patterns = self.detect_ai_patterns(text)
#         structure_score, structure_details = self.analyze_sentence_structure(text)

#         weights = {
#             'ai_cliches': 1.0,
#             'corporate_buzzwords': 0.8,
#             'revelation_phrases': 1.2,
#             'escalation_phrases': 1.3,
#             'truth_telling_phrases': 1.4,
#             'dramatic_fragments': 1.5,
#             'inspirational_endings': 0.9,
#             'list_scaffolding': 0.9,
#             'ai_hedging': 1.1,
#             'generic_conclusions': 0.7,
#             'artificial_enthusiasm': 0.6,
#             'robotic_transitions': 1.0,
#             'repetitive_structures': 0.8,
#             'clickbait_patterns': 1.3,
#             'ai_disclaimers': 2.0
#         }

#         pattern_score = 0
#         total_patterns = 0

#         for category, patterns in detected_patterns.items():
#             weight = weights.get(category, 1.0)
#             pattern_count = len(patterns)
#             pattern_score += pattern_count * weight
#             total_patterns += pattern_count

#         word_count = len(text.split())
#         if word_count > 0:
#             pattern_density = (pattern_score / word_count) * 100
#         else:
#             pattern_density = 0

#         combined_score = min(1.0, (pattern_density * 0.3) + (structure_score * 0.7))
#         ai_probability = combined_score * 100

#         details = {
#             'total_patterns': total_patterns,
#             'pattern_density': pattern_density,
#             'structure_score': structure_score,
#             'structure_details': structure_details,
#             'word_count': word_count
#         }

#         return ai_probability, details

#     def get_detection_report(self, text):
#         """Generate comprehensive AI detection report"""
#         ai_score, details = self.calculate_ai_score(text)
#         detected_patterns = self.detect_ai_patterns(text)

#         if ai_score >= 70:
#             classification = "HIGHLY LIKELY AI-GENERATED"
#             confidence = "Very High"
#         elif ai_score >= 50:
#             classification = "POSSIBLY AI-GENERATED"
#             confidence = "High"
#         elif ai_score >= 30:
#             classification = "SOME AI CHARACTERISTICS"
#             confidence = "Medium"
#         else:
#             classification = "LIKELY HUMAN-WRITTEN"
#             confidence = "Low AI Probability"

#         category_names = {
#             'ai_cliches': 'AI Clichés',
#             'corporate_buzzwords': 'Corporate Buzzwords',
#             'revelation_phrases': 'Revelation Phrases',
#             'escalation_phrases': 'Escalation Phrases',
#             'truth_telling_phrases': 'Truth-Telling Phrases',
#             'dramatic_fragments': 'Dramatic Fragments',
#             'inspirational_endings': 'Inspirational Endings',
#             'list_scaffolding': 'List Scaffolding',
#             'ai_hedging': 'AI Hedging Language',
#             'generic_conclusions': 'Generic Conclusions',
#             'artificial_enthusiasm': 'Artificial Enthusiasm',
#             'robotic_transitions': 'Robotic Transitions',
#             'repetitive_structures': 'Repetitive Structures',
#             'clickbait_patterns': 'Clickbait Patterns',
#             'ai_disclaimers': 'AI Disclaimers'
#         }

#         pattern_breakdown = {}
#         for category, patterns in detected_patterns.items():
#             if patterns:
#                 pattern_breakdown[category_names.get(category, category.title())] = patterns

#         return {
#             'ai_score': ai_score,
#             'classification': classification,
#             'confidence': confidence,
#             'detected_patterns': pattern_breakdown,
#             'technical_details': details
#         }

#     def humanize(self, text):
#         """Enhanced humanization with pattern avoidance"""
#         if not text.strip():
#             return None, "No text provided", "No analysis available"

#         try:
#             patterns_before = self.detect_ai_patterns(text)
#             ai_score_before, _ = self.calculate_ai_score(text)

#             flagged_phrases = []
#             for patterns in patterns_before.values():
#                 flagged_phrases.extend(patterns)

#             pattern_warning = ""
#             if flagged_phrases:
#                 pattern_warning = f"\n\nAVOID these detected AI patterns: {', '.join(flagged_phrases[:15])}"

#             prompt = f"""Rewrite this text to sound completely human-written. Remove all AI writing patterns and corporate jargon.

# Guidelines:
# - Use varied sentence lengths and structures
# - Remove robotic scaffolds and transitions
# - Add natural personality and voice
# - Use contractions and conversational tone
# - Remove buzzwords and replace with simple language
# - Make it feel like a real person wrote it spontaneously{pattern_warning}

# Text to rewrite:
# \"\"\"
# {text}
# \"\"\"

# Return only the rewritten version with no explanations."""

#             response = self.client.messages.create(
#                 model="claude-3-5-sonnet-20241022",
#                 max_tokens=4000,
#                 messages=[{"role": "user", "content": prompt}]
#             )

#             humanized_text = response.content[0].text

#             patterns_after = self.detect_ai_patterns(humanized_text)
#             ai_score_after, _ = self.calculate_ai_score(humanized_text)

#             before_count = sum(len(patterns) for patterns in patterns_before.values())
#             after_count = sum(len(patterns) for patterns in patterns_after.values())
#             score_improvement = ai_score_before - ai_score_after

#             return {
#                 'humanized_text': humanized_text,
#                 'ai_score_before': ai_score_before,
#                 'ai_score_after': ai_score_after,
#                 'score_improvement': score_improvement,
#                 'patterns_before': before_count,
#                 'patterns_after': after_count
#             }

#         except Exception as e:
#             raise HTTPException(status_code=500, detail=str(e))

# # Initialize the detector
# API_KEY = os.getenv('ANTHROPIC_API_KEY')
# if not API_KEY:
#     raise ValueError("ANTHROPIC_API_KEY environment variable is required")

# detector_humanizer = AITextDetectorHumanizer(API_KEY)

# # Pydantic models
# class TextAnalysisRequest(BaseModel):
#     text: str

# class HumanizeRequest(BaseModel):
#     text: str

# class DetectionResponse(BaseModel):
#     ai_score: float
#     classification: str
#     confidence: str
#     detected_patterns: Dict[str, List[str]]
#     technical_details: Dict

# class HumanizeResponse(BaseModel):
#     humanized_text: str
#     ai_score_before: float
#     ai_score_after: float
#     score_improvement: float
#     patterns_before: int
#     patterns_after: int

# # API Routes
# @app.get("/")
# async def root():
#     return {"message": "AI Text Detector & Humanizer API", "version": "1.0.0"}

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy", "api_key_configured": bool(API_KEY)}

# @app.post("/analyze", response_model=DetectionResponse)
# async def analyze_text(request: TextAnalysisRequest):
#     """Analyze text for AI characteristics"""
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
#     try:
#         result = detector_humanizer.get_detection_report(request.text)
#         return DetectionResponse(**result)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/humanize", response_model=HumanizeResponse)
# async def humanize_text(request: HumanizeRequest):
#     """Humanize AI-generated text"""
#     if not request.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")
    
#     try:
#         result = detector_humanizer.humanize(request.text)
#         if result is None:
#             raise HTTPException(status_code=400, detail="Failed to humanize text")
#         return HumanizeResponse(**result)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(app, host="0.0.0.0", port=8000)
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)
#     # or alternatively:
#     # uvicorn.run(app, host="localhost", port=8000)


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import re
import random
import math
import os
import logging
from collections import Counter
from typing import Dict, List, Optional

from dotenv import load_dotenv

# Configure logging for better debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()  

api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    logger.error("❌ ANTHROPIC_API_KEY environment variable is required")
    raise ValueError("ANTHROPIC_API_KEY environment variable is required")

logger.info(f"✅ API Key loaded successfully (length: {len(api_key)})")

# Initialize FastAPI app
app = FastAPI(title="AI Text Detector & Humanizer API", version="1.0.0")

# Enhanced CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Explicitly include OPTIONS
    allow_headers=["*"],
)

class AITextDetectorHumanizer:
    def __init__(self, ANTHROPIC_API_KEY: str):
        self.client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        logger.info("🔄 Loading AI detection patterns...")
        self.ai_patterns = self._load_detection_patterns()
        self.humanized_alternatives = self._load_humanized_alternatives()
        total_patterns = sum(len(patterns) for patterns in self.ai_patterns.values())
        logger.info(f"✅ Loaded {total_patterns} AI detection patterns across {len(self.ai_patterns)} categories")

    def _load_detection_patterns(self):
        """Comprehensive AI writing pattern database for detection"""
        patterns = {
            'ai_cliches': [
                "in today's fast-paced world", "with that being said", "at the end of the day",
                "ultimately", "below is a", "there is no doubt", "it goes without saying",
                "in this article", "this article will", "moving forward", "as such",
                "in order to", "due to the fact", "based on the", "when it comes to",
                "as a matter of fact", "it is important to note", "from a standpoint",
                "under the circumstances", "going forward", "needless to say", "in light of",
                "in conclusion", "to summarize", "to wrap up", "ultimately speaking",
                "at the same time", "in addition", "furthermore", "moreover", "additionally",
                "on the other hand", "conversely", "in contrast", "nevertheless", "nonetheless",
                "however", "therefore", "hence", "thus", "consequently", "as a result",
                "for example", "for instance", "take for example", "to illustrate",
                "in summary", "basically", "essentially", "significantly", "fundamentally",
                "broadly speaking", "generally speaking", "in general", "overall",
                "predominantly", "typically", "commonly", "often times", "sometimes",
                "frequently", "rarely", "invariably", "unequivocally", "truly", "definitely",
                "absolutely", "certainly", "obviously", "clearly", "evidently", "surprisingly",
                "unexpectedly", "as we all know", "it's worth noting", "it should be noted",
                "one could argue", "some might say", "experts agree", "studies show",
                "research indicates", "it is widely believed", "it is commonly believed",
                "take into consideration", "bear in mind", "keep in mind", "it stands to reason",
                "needless to mention", "to begin with", "firstly", "secondly", "thirdly",
                "lastly", "finally", "on the whole", "in the meantime", "meanwhile",
                "simultaneously", "at the present time", "at this point in time", "at this stage",
                "in the near future", "soon enough", "shortly after", "immediately",
                "momentarily", "as soon as possible", "without further ado", "moving on",
                "turning to", "regarding", "concerning", "with respect to", "in terms of",
                "in relation to", "as far as ... is concerned", "regarding the", "as outlined above",
                "as discussed", "as mentioned", "as noted", "as highlighted", "as emphasized",
                "it should not be overlooked", "it cannot be denied", "one thing is clear",
                "it begs the question", "the fact of the matter is", "as previously stated",
                "as previously mentioned", "as earlier noted", "as shown above",
                "as illustrated above", "refer to the", "in closing", "in brief", "in short",
                "to put it simply", "to put it bluntly", "to put it another way",
                "in other words", "that is to say", "namely", "specifically", "particularly",
                "especially", "notably", "importantly", "critically", "crucially", "vitally",
                "most importantly", "more importantly", "equally important", "on a daily basis",
                "on a regular basis", "day in and day out", "time and time again",
                "from time to time", "once in a while", "every now and then",
                "at any given moment", "at all times", "to a large extent", "to a great extent",
                "to some extent", "to a certain extent", "more or less", "for the most part",
                "by and large", "in most cases", "in certain cases", "in rare instances"
            ],

            'corporate_buzzwords': [
                "cutting-edge", "state-of-the-art", "leveraging", "synergy", "paradigm",
                "holistic", "scalable", "robust", "end-to-end", "turnkey", "streamline",
                "optimize", "empower", "unprecedented", "game-changer", "next-generation",
                "revolutionary", "innovative", "disruptive", "groundbreaking", "best-in-class",
                "value-added", "actionable", "data-driven", "insightful", "transformative",
                "strategic", "mission-critical", "core competencies", "key takeaways", "win-win",
                "low-hanging fruit", "circle back", "touch base", "deep dive", "move the needle",
                "boil the ocean", "think outside the box", "best practices", "thought leadership",
                "value proposition", "customizable-enabled", "next-gen solutions",
                "workflows-driven", "cross-functional blueprints", "redefine-oriented",
                "cross-functional value chains", "resilient value chains", "collaborative networks",
                "benchmarks-based", "benchmarks-driven", "comprehensive-centric",
                "next-gen workflows", "future-ready ecosystems", "next-gen blueprints",
                "flexible-enabled", "collaborative ecosystems", "insights-based",
                "next-gen interfaces", "drive-oriented", "algorithms-driven", "weigh-oriented",
                "seamless models", "future-ready experiences", "enterprise-grade-centric",
                "robust value chains", "enable-powered", "architect solutions",
                "scenarios-based", "paradigms-driven", "enterprise-grade methodologies",
                "mobilize methodologies", "visualize-powered", "synthesize-powered",
                "efficiencies-driven", "transform protocols", "centralized-centric",
                "agile workflows", "modular workflows", "accelerate-powered", "frameworks-based"
            ],

            'revelation_phrases': self._load_revelation_phrases(),
            'escalation_phrases': self._load_escalation_phrases(),
            'truth_telling_phrases': self._load_truth_telling_phrases(),
            'dramatic_fragments': self._load_dramatic_fragments(),
            'inspirational_endings': self._load_inspirational_endings(),

            'list_scaffolding': [
                "here are the key points", "let's break this down", "there are several factors",
                "consider the following", "here's what you need to know", "the main benefits include",
                "key considerations include", "important factors to consider", "let's explore",
                "we'll cover", "in this guide", "step-by-step process", "comprehensive overview"
            ],

            'ai_hedging': [
                "it's worth noting that", "it's important to remember", "keep in mind that",
                "it should be noted", "one might argue", "it could be argued", "some may say",
                "it's possible that", "potentially", "arguably", "presumably", "conceivably",
                "in many cases", "typically", "generally", "often", "frequently", "commonly",
                "tends to", "may result in", "could lead to", "might cause", "has the potential"
            ],

            'generic_conclusions': [
                "in conclusion", "to conclude", "in summary", "to sum up", "overall",
                "all things considered", "taking everything into account", "when all is said and done",
                "in the final analysis", "ultimately", "in the end", "as we've seen",
                "as demonstrated", "as shown", "clearly", "evidently", "obviously"
            ],

            'artificial_enthusiasm': [
                "exciting opportunity", "tremendous potential", "incredible benefits",
                "amazing results", "fantastic solution", "outstanding performance",
                "remarkable achievement", "exceptional quality", "extraordinary value",
                "incredible impact", "amazing possibilities", "fantastic opportunity"
            ],

            'robotic_transitions': [
                "moving on to", "turning our attention to", "shifting focus to", "proceeding to",
                "continuing with", "advancing to", "progressing to", "transitioning to",
                "next, we'll examine", "now, let's consider", "subsequently", "thereafter"
            ],

            'repetitive_structures': [
                "not only... but also", "both... and", "either... or", "neither... nor",
                "on one hand... on the other hand", "while... also", "although... however",
                "despite... nevertheless", "even though... still", "whereas... conversely"
            ],

            'clickbait_patterns': [
                "you won't believe", "this will shock you", "doctors hate this", "number will surprise you",
                "this changes everything", "mind-blowing", "life-changing", "game-changing revelation",
                "industry secret", "hidden truth", "what they don't want you to know"
            ],

            'ai_disclaimers': [
                "as an ai", "i'm an ai", "as a language model", "i don't have personal experience",
                "i can't", "i'm not able to", "i don't have access", "i can't browse the internet",
                "i should note", "it's important to note", "please note", "disclaimer"
            ]
        }

        patterns['uniform_sentences'] = self._detect_uniform_structure_patterns()
        return patterns

    def _load_revelation_phrases(self):
        """Load revelation phrase patterns"""
        return [
            "that's the lie", "that's the catch", "that's the twist", "that's the deal",
            "that's the truth", "that's the secret", "that's the problem", "that's the proof",
            "that's the reason", "that's the kicker", "that's the fact", "that's the point",
            "that's the thing", "that's the question", "that's the report", "that's the surprise",
            "that's the hitch", "that's the hiccup", "that's the revelation", "that's the plot twist",
            "here's the lie", "here's the catch", "here's the twist", "here's the deal",
            "here's the truth", "here's the secret", "here's the problem", "here's the proof",
            "here's the reason", "here's the kicker", "here's the fact", "here's the point",
            "here's the thing", "here's the question", "here's the report", "here's the surprise",
            "but here's the catch", "but here's the twist", "but here's the truth",
            "and that's the catch", "now here's the catch", "the truth is", "the catch is",
            "what happens next", "you won't believe", "here's what nobody tells you"
        ]

    def _load_escalation_phrases(self):
        """Load escalation phrase patterns"""
        return [
            "that's what makes myth dangerous", "that's what makes truth terrifying",
            "that's what makes secret deadly", "that's what makes danger real",
            "that's what makes illusion fatal", "that's what makes fear real",
            "that's what makes consequence dire", "that's what makes consequence fatal",
            "that's what makes impact devastating", "that's what makes impact irreversible",
            "that's what makes threat immediate", "that's what makes danger imminent",
            "that's what makes risk uncontrollable", "that's what makes power overwhelming",
            "that's what makes the danger", "that's what makes the threat",
            "that's what makes the risk", "that's what makes the peril",
            "that's why it is myth dangerous", "that's why it is truth terrifying",
            "that's why it is secret deadly", "that's why it is danger real",
            "that's how it becomes myth dangerous", "that's how it becomes truth terrifying",
            "that's how it becomes secret deadly", "that's how it becomes danger real"
        ]

    def _load_truth_telling_phrases(self):
        """Load truth-telling phrase patterns"""
        return [
            "but here's the truth no one wants to say out loud",
            "but here's the truth that everyone ignores",
            "but here's the truth hidden behind the hype",
            "but here's the truth we all choose to ignore",
            "but here's the truth you need to hear",
            "here's the truth no one wants to say out loud",
            "here's the truth that everyone ignores",
            "here's the truth hidden behind the hype",
            "let's be honest no one wants to say out loud",
            "to be frank no one wants to say out loud",
            "no one wants to admit no one wants to say out loud",
            "the real story is no one wants to say out loud",
            "the cold, hard truth is no one wants to say out loud",
            "let me be clear no one wants to say out loud",
            "nobody will tell you no one wants to say out loud",
            "few dare to say no one wants to say out loud",
            "it's time to face the truth no one wants to say out loud",
            "uncomfortable as it is no one wants to say out loud",
            "here's what nobody mentions no one wants to say out loud",
            "the unspoken fact is no one wants to say out loud"
        ]

    def _load_dramatic_fragments(self):
        """Load dramatic fragment patterns"""
        return [
            "until something does break. usually it's you.",
            "until something does break. no one sees it coming.",
            "until something does break. and then you're alone.",
            "until something does break. that's when you realize.",
            "until something does break. it always ends this way.",
            "before the world ends. usually it's you.",
            "before the world ends. no one sees it coming.",
            "when the lights fade. usually it's you.",
            "when the lights fade. no one sees it coming.",
            "after the silence falls. usually it's you.",
            "once the truth is revealed. usually it's you.",
            "before hope disappears. usually it's you.",
            "when the walls close in. usually it's you.",
            "after the mask slips. usually it's you.",
            "once shadows grow longer. usually it's you.",
            "when the night takes over. usually it's you.",
            "before the breath escapes. usually it's you.",
            "when the heart gives in. usually it's you.",
            "after the facade crumbles. usually it's you.",
            "once the tension snaps. usually it's you.",
            "when the final act begins. usually it's you.",
            "before the calm shatters. usually it's you.",
            "when the storm approaches. usually it's you.",
            "after the echo dies. usually it's you.",
            "once the spark ignites. usually it's you.",
            "when the blade falls. usually it's you.",
            "after the lies unravel. usually it's you.",
            "before the last word. usually it's you.",
            "when the fabric tears. usually it's you.",
            "once the mirror cracks. usually it's you."
        ]

    def _load_inspirational_endings(self):
        """Load inspirational ending patterns"""
        return [
            "always remember the only limit is yourself",
            "always remember your potential knows no bounds",
            "always remember you are your greatest asset",
            "always remember your dreams are within reach",
            "always remember you have the power to change",
            "never forget the only limit is yourself",
            "never forget your potential knows no bounds",
            "never forget you are your greatest asset",
            "never forget your dreams are within reach",
            "never forget you have the power to change",
            "keep in mind the only limit is yourself",
            "keep in mind your potential knows no bounds",
            "keep in mind you are your greatest asset",
            "believe that the only limit is yourself",
            "believe that your potential knows no bounds",
            "believe that you are your greatest asset",
            "know that the only limit is yourself",
            "know that your potential knows no bounds",
            "know that you are your greatest asset",
            "embrace the fact that the only limit is yourself",
            "embrace the fact that your potential knows no bounds",
            "embrace the fact that you are your greatest asset"
        ]

    def _detect_uniform_structure_patterns(self):
        """Patterns that indicate uniform sentence structure (AI characteristic)"""
        return [
            "^[A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+\\.",
            "\\. [A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+\\.",
        ]

    def _load_humanized_alternatives(self):
        """Enhanced humanized alternatives"""
        alternatives = {
            "in today's fast-paced world": [
                "these days", "nowadays", "right now", "with everything moving so quickly", "lately"
            ],
            "with that being said": [
                "but", "however", "though", "that said", "still", "even so"
            ],
            "at the end of the day": [
                "ultimately", "in the end", "when it comes down to it", "what matters most", "bottom line"
            ],
            "it goes without saying": [
                "obviously", "clearly", "naturally", "of course", "everyone knows"
            ],
            "leverage": [
                "use", "tap into", "make use of", "take advantage of", "work with"
            ],
            "optimize": [
                "improve", "make better", "fine-tune", "enhance", "perfect"
            ],
            "cutting-edge": [
                "latest", "newest", "advanced", "modern", "up-to-date", "fresh"
            ],
            "furthermore": [
                "plus", "also", "and", "what's more", "on top of that", "besides"
            ],
            "however": [
                "but", "though", "yet", "still", "on the flip side", "that said"
            ],
            "therefore": [
                "so", "that's why", "which means", "as a result", "because of this"
            ]
        }
        return alternatives

    def analyze_sentence_structure(self, text):
        """Analyze sentence structure uniformity (AI indicator)"""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]

        if len(sentences) < 3:
            return 0, "Insufficient sentences for analysis"

        lengths = [len(s.split()) for s in sentences]
        avg_length = sum(lengths) / len(lengths)
        variance = sum((l - avg_length) ** 2 for l in lengths) / len(lengths)

        uniformity_score = max(0, 1 - (variance / (avg_length * 2)))

        starters = [s.split()[0].lower() if s.split() else "" for s in sentences]
        starter_diversity = len(set(starters)) / len(starters) if starters else 1

        structure_score = (uniformity_score * 0.6) + ((1 - starter_diversity) * 0.4)

        details = f"Avg length: {avg_length:.1f}, Variance: {variance:.1f}, Starter diversity: {starter_diversity:.2f}"

        return structure_score, details

    def detect_ai_patterns(self, text):
        """Enhanced pattern detection with scoring"""
        detected = {}
        text_lower = text.lower()

        for category, patterns in self.ai_patterns.items():
            if category == 'uniform_sentences':
                continue

            detected[category] = []
            for pattern in patterns:
                if re.search(r'\b' + re.escape(pattern.lower()) + r'\b', text_lower):
                    detected[category].append(pattern)

        detected = {k: v for k, v in detected.items() if v}
        return detected

    def calculate_ai_score(self, text):
        """Calculate comprehensive AI probability score"""
        if not text.strip():
            return 0, "No text provided"

        detected_patterns = self.detect_ai_patterns(text)
        structure_score, structure_details = self.analyze_sentence_structure(text)

        weights = {
            'ai_cliches': 1.0,
            'corporate_buzzwords': 0.8,
            'revelation_phrases': 1.2,
            'escalation_phrases': 1.3,
            'truth_telling_phrases': 1.4,
            'dramatic_fragments': 1.5,
            'inspirational_endings': 0.9,
            'list_scaffolding': 0.9,
            'ai_hedging': 1.1,
            'generic_conclusions': 0.7,
            'artificial_enthusiasm': 0.6,
            'robotic_transitions': 1.0,
            'repetitive_structures': 0.8,
            'clickbait_patterns': 1.3,
            'ai_disclaimers': 2.0
        }

        pattern_score = 0
        total_patterns = 0

        for category, patterns in detected_patterns.items():
            weight = weights.get(category, 1.0)
            pattern_count = len(patterns)
            pattern_score += pattern_count * weight
            total_patterns += pattern_count

        word_count = len(text.split())
        if word_count > 0:
            pattern_density = (pattern_score / word_count) * 100
        else:
            pattern_density = 0

        combined_score = min(1.0, (pattern_density * 0.3) + (structure_score * 0.7))
        ai_probability = combined_score * 100

        details = {
            'total_patterns': total_patterns,
            'pattern_density': pattern_density,
            'structure_score': structure_score,
            'structure_details': structure_details,
            'word_count': word_count
        }

        return ai_probability, details

    def get_detection_report(self, text):
        """Generate comprehensive AI detection report"""
        logger.info(f"📝 Analyzing text with {len(text)} characters")
        
        ai_score, details = self.calculate_ai_score(text)
        detected_patterns = self.detect_ai_patterns(text)

        if ai_score >= 70:
            classification = "HIGHLY LIKELY AI-GENERATED"
            confidence = "Very High"
        elif ai_score >= 50:
            classification = "POSSIBLY AI-GENERATED"
            confidence = "High"
        elif ai_score >= 30:
            classification = "SOME AI CHARACTERISTICS"
            confidence = "Medium"
        else:
            classification = "LIKELY HUMAN-WRITTEN"
            confidence = "Low AI Probability"

        # Format patterns for frontend display
        patterns_with_scores = {}
        for category, patterns in detected_patterns.items():
            if patterns:
                patterns_with_scores[category] = {
                    'score': len(patterns) * 15,  # Simple scoring
                    'indicators': patterns[:5]  # Limit to 5 for display
                }

        result = {
            'ai_score': round(ai_score, 1),
            'classification': classification,
            'confidence': confidence,
            'patterns': patterns_with_scores,  # This matches frontend expectations
            'technical_details': details
        }
        
        logger.info(f"✅ Analysis complete: {ai_score:.1f}% - {classification}")
        return result

    def humanize(self, text):
        """Enhanced humanization with pattern avoidance"""
        if not text.strip():
            return None

        try:
            patterns_before = self.detect_ai_patterns(text)
            ai_score_before, _ = self.calculate_ai_score(text)

            flagged_phrases = []
            for patterns in patterns_before.values():
                flagged_phrases.extend(patterns)

            pattern_warning = ""
            if flagged_phrases:
                pattern_warning = f"\n\nAVOID these detected AI patterns: {', '.join(flagged_phrases[:15])}"

            prompt = f"""Rewrite this text to sound completely human-written. Remove all AI writing patterns and corporate jargon.

Guidelines:
- Use varied sentence lengths and structures
- Remove robotic scaffolds and transitions
- Add natural personality and voice
- Use contractions and conversational tone
- Remove buzzwords and replace with simple language
- Make it feel like a real person wrote it spontaneously{pattern_warning}

Text to rewrite:
\"\"\"
{text}
\"\"\"

Return only the rewritten version with no explanations."""

            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )

            humanized_text = response.content[0].text

            patterns_after = self.detect_ai_patterns(humanized_text)
            ai_score_after, _ = self.calculate_ai_score(humanized_text)

            before_count = sum(len(patterns) for patterns in patterns_before.values())
            after_count = sum(len(patterns) for patterns in patterns_after.values())
            score_improvement = ai_score_before - ai_score_after

            return {
                'humanized_text': humanized_text,
                'ai_score_before': ai_score_before,
                'ai_score_after': ai_score_after,
                'score_improvement': score_improvement,
                'patterns_before': before_count,
                'patterns_after': after_count
            }

        except Exception as e:
            logger.error(f"❌ Humanization error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

# Initialize the detector
logger.info("🚀 Initializing AI Text Detector...")
detector_humanizer = AITextDetectorHumanizer(api_key)

# Pydantic models
class TextAnalysisRequest(BaseModel):
    text: str

class HumanizeRequest(BaseModel):
    text: str

# API Routes with logging
@app.get("/")
async def root():
    logger.info("✅ Root endpoint accessed")
    return {
        "message": "AI Text Detector & Humanizer API", 
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    logger.info("✅ Health check accessed")
    return {
        "status": "healthy", 
        "api_key_configured": bool(api_key),
        "cors_enabled": True
    }

@app.post("/analyze")
async def analyze_text(request: TextAnalysisRequest):
    """Analyze text for AI characteristics"""
    logger.info(f"📝 Analyze request received: {len(request.text)} characters")
    
    if not request.text.strip():
        logger.warning("❌ Empty text submitted")
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        result = detector_humanizer.get_detection_report(request.text)
        logger.info(f"✅ Analysis successful: {result['ai_score']}%")
        return result
    except Exception as e:
        logger.error(f"❌ Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/humanize")
async def humanize_text(request: HumanizeRequest):
    """Humanize AI-generated text"""
    logger.info(f"🔄 Humanize request received: {len(request.text)} characters")
    
    if not request.text.strip():
        logger.warning("❌ Empty text submitted for humanization")
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        result = detector_humanizer.humanize(request.text)
        if result is None:
            raise HTTPException(status_code=400, detail="Failed to humanize text")
        logger.info("✅ Humanization successful")
        return result
    except Exception as e:
        logger.error(f"❌ Humanization error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# CORS preflight handlers
@app.options("/analyze")
async def options_analyze():
    return {"message": "OK"}

@app.options("/humanize")
async def options_humanize():
    return {"message": "OK"}

# Server startup/shutdown events
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 AI Text Detector API is starting up")
    logger.info("   ✅ CORS enabled for frontend connections")
    logger.info("   ✅ Comprehensive pattern database loaded")
    logger.info("   🌐 Ready to analyze text!")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 AI Text Detector API is shutting down")

# Fixed server configuration to stay running
if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Starting AI Text Detector API")
    print("📡 Server URL: http://localhost:8000")
    print("📚 Documentation: http://localhost:8000/docs")
    print("🔧 Health Check: http://localhost:8000/health")
    print()
    print("✅ Server will stay running until you press Ctrl+C")
    print("🌐 Frontend can connect to: http://localhost:8000")
    print()
    
    # This configuration ensures the server stays running
    uvicorn.run(
        app,
        host="0.0.0.0",  # Accept connections from any IP
        port=8000,
        log_level="info",
        access_log=True,
        reload=False  # Disable reload to prevent auto-shutdown
    )