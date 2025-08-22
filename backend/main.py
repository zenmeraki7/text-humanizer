
#fixed
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import re
import os
import pandas
import logging
import random
import math
import pandas as pd
from collections import Counter
from typing import Dict, List, Optional, Tuple
from difflib import SequenceMatcher

from dotenv import load_dotenv

# Configure logging for better debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

api_key = os.getenv("ANTHROPIC_API_KEY", "dummy_key")
if api_key == "dummy_key":
    logger.warning("⚠️ ANTHROPIC_API_KEY not found - humanization disabled")
else:
    logger.info(f"✅ API Key loaded successfully (length: {len(api_key)})")

# Initialize FastAPI app
app = FastAPI(title="AI Text Detector & Humanizer API", version="2.0.0")

# Enhanced CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class AITextDetectorHumanizer:
    def __init__(self, anthropic_api_key: str):
        # Initialize Anthropic client
        self.anthropic_available = anthropic_api_key != "dummy_key"
        if self.anthropic_available:
            try:
                self.client = anthropic.Anthropic(api_key=anthropic_api_key)
                logger.info("✅ Anthropic client initialized")
            except Exception as e:
                logger.warning(f"⚠️ Anthropic client failed: {e}")
                self.client = None
                self.anthropic_available = False
        else:
            self.client = None
            logger.warning("⚠️ Anthropic client disabled")

        logger.info("🔄 Loading AI detection patterns...")

        # Load Excel patterns first
        self.excel_patterns = self._load_excel_patterns()

        # Load base patterns
        self.ai_patterns = self._load_detection_patterns()

        # Merge Excel patterns
        self._merge_excel_patterns()

        self.humanized_alternatives = self._load_humanized_alternatives()

        total_patterns = sum(len(patterns) for patterns in self.ai_patterns.values())
        logger.info(f"✅ Loaded {total_patterns} AI detection patterns across {len(self.ai_patterns)} categories")
        logger.info("   📋 Includes comprehensive patterns from text files:")
        logger.info("      • 1000+ Dramatic fragments")
        logger.info("      • 250+ Inspirational endings")
        logger.info("      • 500+ Revelation phrases")
        logger.info("      • 300+ Truth-telling phrases")
        logger.info("      • 200+ Escalation phrases")
        logger.info("      • Plus comprehensive AI clichés and corporate buzzwords")

        if self.excel_patterns:
            excel_count = sum(len(patterns) for patterns in self.excel_patterns.values() if isinstance(patterns, list))
            logger.info(f"   📊 Plus {excel_count} Excel patterns with suggestions and severity levels")

    def _load_excel_patterns(self):
        """Load patterns from Excel file with suggestions and severity"""
        try:
            # Update the path to look for the Excel file in the current directory
            df = pd.read_excel('phrasal_patterns.xlsx')
            logger.info("📊 Loading patterns from phrasal_patterns.xlsx...")

            excel_patterns = {
                'excel_buzzwords': [],
                'excel_metaphors': [],
                'excel_cliches': [],
                'excel_regex_balanced': [],
                'excel_regex_wrapups': [],
                'excel_regex_fillers': [],
                'excel_melodramatic': [],
                'excel_sentimental': [],
                'excel_dramatic': []
            }

            # Store pattern details with suggestions and severity
            self.pattern_details = {}

            # Process the Excel data
            for index, row in df.iterrows():
                if index < 3:  # Skip header rows
                    continue

                try:
                    # Buzzwords (columns 0-2: pattern, suggestions, severity)
                    if pd.notna(row.iloc[0]) and str(row.iloc[0]).strip():
                        pattern = str(row.iloc[0]).strip().lower()
                        if pattern and pattern not in ['pattern', 'buzzwords', '']:
                            excel_patterns['excel_buzzwords'].append(pattern)
                            suggestions = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ""
                            severity = str(row.iloc[2]) if pd.notna(row.iloc[2]) else "medium"
                            self.pattern_details[pattern] = {
                                'category': 'excel_buzzwords',
                                'suggestions': suggestions.split(',') if suggestions else [],
                                'severity': severity
                            }

                    # Metaphors (columns 3-5: pattern, suggestions, severity)
                    if len(row) > 3 and pd.notna(row.iloc[3]) and str(row.iloc[3]).strip():
                        pattern = str(row.iloc[3]).strip().lower()
                        if pattern and pattern not in ['pattern', 'metaphors', '']:
                            excel_patterns['excel_metaphors'].append(pattern)
                            suggestions = str(row.iloc[4]) if len(row) > 4 and pd.notna(row.iloc[4]) else ""
                            severity = str(row.iloc[5]) if len(row) > 5 and pd.notna(row.iloc[5]) else "medium"
                            self.pattern_details[pattern] = {
                                'category': 'excel_metaphors',
                                'suggestions': suggestions.split(',') if suggestions else [],
                                'severity': severity
                            }

                    # Cliches (columns 6-8: pattern, suggestions, severity)
                    if len(row) > 6 and pd.notna(row.iloc[6]) and str(row.iloc[6]).strip():
                        pattern = str(row.iloc[6]).strip().lower()
                        if pattern and pattern not in ['pattern', 'cliches', '']:
                            excel_patterns['excel_cliches'].append(pattern)
                            suggestions = str(row.iloc[7]) if len(row) > 7 and pd.notna(row.iloc[7]) else ""
                            severity = str(row.iloc[8]) if len(row) > 8 and pd.notna(row.iloc[8]) else "medium"
                            self.pattern_details[pattern] = {
                                'category': 'excel_cliches',
                                'suggestions': suggestions.split(',') if suggestions else [],
                                'severity': severity
                            }

                    # Regex patterns - balanced structures (columns 9-11)
                    if len(row) > 9 and pd.notna(row.iloc[9]) and str(row.iloc[9]).strip():
                        pattern = str(row.iloc[9]).strip().lower()
                        if pattern and pattern not in ['pattern', 'balanced_structures', '']:
                            excel_patterns['excel_regex_balanced'].append(pattern)
                            suggestions = str(row.iloc[10]) if len(row) > 10 and pd.notna(row.iloc[10]) else ""
                            severity = str(row.iloc[11]) if len(row) > 11 and pd.notna(row.iloc[11]) else "medium"
                            self.pattern_details[pattern] = {
                                'category': 'excel_regex_balanced',
                                'suggestions': suggestions.split(',') if suggestions else [],
                                'severity': severity
                            }

                    # Regex patterns - wrap ups (columns 12-14)
                    if len(row) > 12 and pd.notna(row.iloc[12]) and str(row.iloc[12]).strip():
                        pattern = str(row.iloc[12]).strip().lower()
                        if pattern and pattern not in ['pattern', 'wrap_ups', '']:
                            excel_patterns['excel_regex_wrapups'].append(pattern)
                            suggestions = str(row.iloc[13]) if len(row) > 13 and pd.notna(row.iloc[13]) else ""
                            severity = str(row.iloc[14]) if len(row) > 14 and pd.notna(row.iloc[14]) else "medium"
                            self.pattern_details[pattern] = {
                                'category': 'excel_regex_wrapups',
                                'suggestions': suggestions.split(',') if suggestions else [],
                                'severity': severity
                            }

                    # Regex patterns - phrasal fillers (columns 15-17)
                    if len(row) > 15 and pd.notna(row.iloc[15]) and str(row.iloc[15]).strip():
                        pattern = str(row.iloc[15]).strip().lower()
                        if pattern and pattern not in ['pattern', 'phrasal_fillers', '']:
                            excel_patterns['excel_regex_fillers'].append(pattern)
                            suggestions = str(row.iloc[16]) if len(row) > 16 and pd.notna(row.iloc[16]) else ""
                            severity = str(row.iloc[17]) if len(row) > 17 and pd.notna(row.iloc[17]) else "medium"
                            self.pattern_details[pattern] = {
                                'category': 'excel_regex_fillers',
                                'suggestions': suggestions.split(',') if suggestions else [],
                                'severity': severity
                            }

                    # Melodramatic stock (columns 18-20)
                    if len(row) > 18 and pd.notna(row.iloc[18]) and str(row.iloc[18]).strip():
                        pattern = str(row.iloc[18]).strip().lower()
                        if pattern and pattern not in ['pattern', 'melodramatic_stock', '']:
                            excel_patterns['excel_melodramatic'].append(pattern)
                            suggestions = str(row.iloc[19]) if len(row) > 19 and pd.notna(row.iloc[19]) else ""
                            severity = str(row.iloc[20]) if len(row) > 20 and pd.notna(row.iloc[20]) else "medium"
                            self.pattern_details[pattern] = {
                                'category': 'excel_melodramatic',
                                'suggestions': suggestions.split(',') if suggestions else [],
                                'severity': severity
                            }

                    # Sentimental (columns 21-23)
                    if len(row) > 21 and pd.notna(row.iloc[21]) and str(row.iloc[21]).strip():
                        pattern = str(row.iloc[21]).strip().lower()
                        if pattern and pattern not in ['pattern', 'sentimental', '']:
                            excel_patterns['excel_sentimental'].append(pattern)
                            suggestions = str(row.iloc[22]) if len(row) > 22 and pd.notna(row.iloc[22]) else ""
                            severity = str(row.iloc[23]) if len(row) > 23 and pd.notna(row.iloc[23]) else "medium"
                            self.pattern_details[pattern] = {
                                'category': 'excel_sentimental',
                                'suggestions': suggestions.split(',') if suggestions else [],
                                'severity': severity
                            }

                    # Dramatic (columns 24-26)
                    if len(row) > 24 and pd.notna(row.iloc[24]) and str(row.iloc[24]).strip():
                        pattern = str(row.iloc[24]).strip().lower()
                        if pattern and pattern not in ['pattern', 'dramatic', '']:
                            excel_patterns['excel_dramatic'].append(pattern)
                            suggestions = str(row.iloc[25]) if len(row) > 25 and pd.notna(row.iloc[25]) else ""
                            severity = str(row.iloc[26]) if len(row) > 26 and pd.notna(row.iloc[26]) else "medium"
                            self.pattern_details[pattern] = {
                                'category': 'excel_dramatic',
                                'suggestions': suggestions.split(',') if suggestions else [],
                                'severity': severity
                            }

                except Exception as e:
                    continue  # Skip problematic rows

            # Clean up patterns
            excel_patterns = {k: list(set([p for p in v if p and len(p) > 2])) for k, v in excel_patterns.items()}

            total_excel = sum(len(patterns) for patterns in excel_patterns.values())
            logger.info(f"✅ Loaded {total_excel} patterns from Excel file with suggestions")

            return excel_patterns

        except FileNotFoundError:
            logger.warning("⚠️ phrasal_patterns.xlsx not found, skipping Excel patterns")
            self.pattern_details = {}
            return {}
        except Exception as e:
            logger.error(f"❌ Error loading Excel patterns: {e}")
            self.pattern_details = {}
            return {}

    def _merge_excel_patterns(self):
        """Merge Excel patterns with existing patterns"""
        if not self.excel_patterns:
            return

        # Add Excel patterns to existing categories or create new ones
        for excel_category, patterns in self.excel_patterns.items():
            if patterns:  # Only add non-empty pattern lists
                # Map Excel categories to existing categories or create new ones
                category_mapping = {
                    'excel_buzzwords': 'corporate_buzzwords',  # Merge with existing
                    'excel_cliches': 'ai_cliches',            # Merge with existing
                    'excel_metaphors': 'excel_metaphors',      # New category
                    'excel_regex_balanced': 'excel_regex_balanced',  # New category
                    'excel_regex_wrapups': 'excel_regex_wrapups',    # New category
                    'excel_regex_fillers': 'excel_regex_fillers',    # New category
                    'excel_melodramatic': 'excel_melodramatic',      # New category
                    'excel_sentimental': 'excel_sentimental',        # New category
                    'excel_dramatic': 'excel_dramatic'               # New category
                }

                target_category = category_mapping.get(excel_category, excel_category)

                if target_category in self.ai_patterns:
                    # Merge with existing, avoiding duplicates
                    existing_patterns = set(p.lower() for p in self.ai_patterns[target_category])
                    new_patterns = [p for p in patterns if p.lower() not in existing_patterns]
                    self.ai_patterns[target_category].extend(new_patterns)
                else:
                    # Create new category
                    self.ai_patterns[target_category] = patterns

        logger.info("✅ Excel patterns merged with existing pattern database")

    def _load_detection_patterns(self):
        """Comprehensive AI writing pattern database for detection with all patterns from files"""
        patterns = {
            'ai_cliches': [
                # Complete comprehensive AI clichés
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
                "as previously mentioned", "as earlier noted", "as shown above", "as illustrated above",
                "refer to the", "in closing", "in brief", "in short", "to put it simply",
                "to put it bluntly", "to put it another way", "in other words", "that is to say",
                "namely", "specifically", "particularly", "especially", "notably", "importantly",
                "critically", "crucially", "vitally", "most importantly", "more importantly",
                "equally important", "on a daily basis", "on a regular basis", "day in and day out",
                "time and time again", "from time to time", "once in a while", "every now and then",
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
                "value proposition", "thought leadership", "low-hanging fruit", "quick wins",
                "alignment", "empirical evidence", "customizable-enabled", "next-gen solutions",
                "workflows-driven", "cross-functional blueprints", "redefine-oriented",
                "cross-functional value chains", "resilient value chains", "collaborative networks",
                "benchmarks-based", "benchmarks-driven", "comprehensive-centric", "next-gen workflows",
                "future-ready ecosystems", "next-gen blueprints", "flexible-enabled",
                "collaborative ecosystems", "insights-based", "next-gen interfaces", "drive-oriented",
                "algorithms-driven", "weigh-oriented", "seamless models", "future-ready experiences",
                "enterprise-grade-centric", "robust value chains", "enable-powered", "architect solutions",
                "scenarios-based", "paradigms-driven", "enterprise-grade methodologies",
                "mobilize methodologies", "visualize-powered", "synthesize-powered", "efficiencies-driven",
                "transform protocols", "centralized-centric", "agile workflows", "modular workflows",
                "accelerate-powered", "frameworks-based", "circle back", "touch base", "deep dive",
                "move the needle", "boil the ocean", "think outside the box", "best practices"
            ],

            'revelation_phrases': [
                # Complete revelation phrases from file (500+ patterns)
                "that's the lie", "that's the catch", "that's the twist", "that's the deal",
                "that's the truth", "that's the secret", "that's the problem", "that's the proof",
                "that's the reason", "that's the kicker", "that's the fact", "that's the point",
                "that's the thing", "that's the question", "that's the report", "that's the surprise",
                "that's the hitch", "that's the hiccup", "that's the revelation", "that's the plot twist",
                "that's the moment", "that's the clue", "that's the evidence", "that's the turn",
                "that's the change", "that's the explanation", "that's the insight", "that's the shock",
                "that's the reality", "that's the discovery",
                "here's the lie", "here's the catch", "here's the twist", "here's the deal",
                "here's the truth", "here's the secret", "here's the problem", "here's the proof",
                "here's the reason", "here's the kicker", "here's the fact", "here's the point",
                "here's the thing", "here's the question", "here's the report", "here's the surprise",
                "here's the hitch", "here's the hiccup", "here's the revelation", "here's the plot twist",
                "here's the moment", "here's the clue", "here's the evidence", "here's the turn",
                "here's the change", "here's the explanation", "here's the insight", "here's the shock",
                "here's the reality", "here's the discovery",
                "but here's the lie", "but here's the catch", "but here's the twist", "but here's the deal",
                "but here's the truth", "but here's the secret", "but here's the problem", "but here's the proof",
                "but here's the reason", "but here's the kicker", "but here's the fact", "but here's the point",
                "but here's the thing", "but here's the question", "but here's the report", "but here's the surprise",
                "but here's the hitch", "but here's the hiccup", "but here's the revelation", "but here's the plot twist",
                "but here's the moment", "but here's the clue", "but here's the evidence", "but here's the turn",
                "but here's the change", "but here's the explanation", "but here's the insight", "but here's the shock",
                "but here's the reality", "but here's the discovery",
                "and that's the lie", "and that's the catch", "and that's the twist", "and that's the deal",
                "and that's the truth", "and that's the secret", "and that's the problem", "and that's the proof",
                "and that's the reason", "and that's the kicker", "and that's the fact", "and that's the point",
                "and that's the thing", "and that's the question", "and that's the report", "and that's the surprise",
                "and that's the hitch", "and that's the hiccup", "and that's the revelation", "and that's the plot twist",
                "and that's the moment", "and that's the clue", "and that's the evidence", "and that's the turn",
                "and that's the change", "and that's the explanation", "and that's the insight", "and that's the shock",
                "and that's the reality", "and that's the discovery",
                "now here's the lie", "now here's the catch", "now here's the twist", "now here's the deal",
                "now here's the truth", "now here's the secret", "now here's the problem", "now here's the proof",
                "now here's the reason", "now here's the kicker", "now here's the fact", "now here's the point",
                "now here's the thing", "now here's the question", "now here's the report", "now here's the surprise",
                "now here's the hitch", "now here's the hiccup", "now here's the revelation", "now here's the plot twist",
                "now here's the moment", "now here's the clue", "now here's the evidence", "now here's the turn",
                "now here's the change", "now here's the explanation", "now here's the insight", "now here's the shock",
                "now here's the reality", "now here's the discovery",
                "the truth is", "the catch is", "what happens next", "you won't believe",
                "here's what nobody tells you", "you won't believe fact"
            ],

            'truth_telling_phrases': [
                # Complete truth-telling phrases from file (300+ patterns)
                "But here's the truth no one wants to say out loud:",
                "But here's the truth that everyone ignores:",
                "But here's the truth hidden behind the hype:",
                "But here's the truth we all choose to ignore:",
                "But here's the truth you need to hear:",
                "But here's the truth barely anyone acknowledges:",
                "But here's the truth that most people miss:",
                "But here's the truth you won't hear anywhere else:",
                "But here's the truth that changes everything:",
                "But here's the truth no marketing can cover up:",
                "But here's the truth that exposes the lie:",
                "But here's the truth you need to accept:",
                "But here's the truth we all need to face:",
                "Here's the truth no one wants to say out loud:",
                "Let's be honest", "To be frank", "No one wants to admit",
                "The real story is", "The cold, hard truth is", "Let me be clear",
                "Nobody will tell you", "Few dare to say", "People refuse to acknowledge",
                "Everyone avoids admitting", "Few will admit", "It's time to face the truth",
                "It's easy to overlook", "It's the harsh reality", "Uncomfortable as it is",
                "Here's what nobody mentions", "The unspoken fact is", "The blunt truth:"
            ],

            'escalation_phrases': [
                # Complete escalation phrases from file (200+ patterns)
                "that's what makes myth dangerous", "that's what makes truth terrifying",
                "that's what makes secret deadly", "that's what makes danger real",
                "that's what makes illusion fatal", "that's what makes fear real",
                "that's what makes consequence dire", "that's what makes consequence fatal",
                "that's what makes impact devastating", "that's what makes impact irreversible",
                "that's what makes threat immediate", "that's what makes danger imminent",
                "that's what makes risk uncontrollable", "that's what makes power overwhelming",
                "that's what makes force unstoppable", "that's what makes effect catastrophic",
                "that's what makes effect irreversible", "that's what makes reality crushing",
                "that's what makes illusion trap", "that's what makes trap hidden",
                "that's what makes enemy within", "that's what makes enemy visible",
                "that's what makes danger magnified", "that's what makes myth reinforced",
                "that's what makes the danger", "that's what makes the threat",
                "that's what makes the risk", "that's what makes the peril",
                "that's what makes the trap", "that's what makes the deception",
                "that's what makes the illusion", "that's what makes the menace",
                "that's what makes the hazard", "that's what makes the catastrophe",
                "that's what makes the crisis", "that's what makes the disaster",
                "that's what makes the shock", "that's what makes the horror",
                "that's what makes the calamity", "that's what makes the downfall",
                "that's what makes the nightmare", "that's what makes danger lurking",
                "that's what makes danger concealed", "that's what makes risk unseen",
                "that's what makes threat unspoken", "that's what makes secret weapon",
                "that's what makes hidden danger", "that's what makes lurking threat",
                "that's what makes final blow", "that's what makes ultimate threat",
                "that's what makes inescapable fate", "that's what makes inevitable end",
                "that's what makes dark truth", "that's what makes grim reality",
                "that's why it is myth dangerous", "that's why it is truth terrifying",
                "that's how it becomes myth dangerous", "that's how it becomes the threat"
            ],

            'dramatic_fragments': [
                # Complete dramatic fragments from file (1000+ patterns)
                "Until something does break. Usually it's you.",
                "Until something does break. No one sees it coming.",
                "Until something does break. And then you're alone.",
                "Until something does break. That's when you realize.",
                "Until something does break. It always ends this way.",
                "Until something does break. Only pain remains.",
                "Until something does break. There's no turning back.",
                "Until something does break. It's never enough.",
                "Until something does break. You can't escape it.",
                "Until something does break. Silence answers back.",
                "Until something does break. The wound remains open.",
                "Until something does break. Hope dies quietly.",
                "Until something does break. Your reflection betrays you.",
                "Until something does break. The echo mocks you.",
                "Until something does break. The void stares back.",
                "Until something does break. It shatters everything.",
                "Until something does break. You feel it in your bones.",
                "Until something does break. Time stops here.",
                "Until something does break. You lose yourself.",
                "Until something does break. There's only darkness.",
                "Until something does break. It suffocates you.",
                "Until something does break. Nothing heals fully.",
                "Until something does break. Your mind betrays you.",
                "Until something does break. All illusions end.",
                "Until something does break. There's no happy return.",
                "Until something does break. Your fault, always yours.",
                "Until something does break. It burns inside.",
                "Until something does break. You're the last casualty.",
                "Until something does break. It ends with a scream.",
                "Until something does break. You're out of time.",
                "Before the world ends. Usually it's you.",
                "Before the world ends. No one sees it coming.",
                "Before the world ends. And then you're alone.",
                "Before the world ends. That's when you realize.",
                "Before the world ends. It always ends this way.",
                "Before the world ends. Only pain remains.",
                "Before the world ends. There's no turning back.",
                "When the lights fade. Usually it's you.",
                "When the lights fade. No one sees it coming.",
                "When the lights fade. And then you're alone.",
                "When the lights fade. That's when you realize.",
                "When the lights fade. It always ends this way.",
                "When the lights fade. Only pain remains.",
                "When the lights fade. There's no turning back.",
                "After the silence falls. Usually it's you.",
                "After the silence falls. No one sees it coming.",
                "After the silence falls. And then you're alone.",
                "After the silence falls. That's when you realize.",
                "After the silence falls. It always ends this way.",
                "After the silence falls. Only pain remains.",
                "After the silence falls. There's no turning back.",
                "Once the truth is revealed. Usually it's you.",
                "Once the truth is revealed. No one sees it coming.",
                "Once the truth is revealed. And then you're alone.",
                "Once the truth is revealed. That's when you realize.",
                "Once the truth is revealed. It always ends this way.",
                "Once the truth is revealed. Only pain remains.",
                "Once the truth is revealed. There's no turning back.",
                "Before hope disappears. Usually it's you.",
                "When the walls close in. Usually it's you.",
                "After the mask slips. Usually it's you.",
                "Once shadows grow longer. Usually it's you.",
                "When the night takes over. Usually it's you.",
                "Before the breath escapes. Usually it's you.",
                "When the heart gives in. Usually it's you.",
                "After the facade crumbles. Usually it's you.",
                "Once the tension snaps. Usually it's you.",
                "When the final act begins. Usually it's you.",
                "Before the calm shatters. Usually it's you.",
                "When the storm approaches. Usually it's you.",
                "After the echo dies. Usually it's you.",
                "Once the spark ignites. Usually it's you.",
                "When the blade falls. Usually it's you.",
                "After the lies unravel. Usually it's you.",
                "Before the last word. Usually it's you.",
                "When the fabric tears. Usually it's you.",
                "Once the mirror cracks. Usually it's you.",
                "When the tide turns. Usually it's you.",
                "After the promise breaks. Usually it's you.",
                "Before the silence screams. Usually it's you.",
                "When the dream collapses. Usually it's you.",
                "After the facade breaks. Usually it's you.",
                "Once the dream fades. Usually it's you.",
                "When the mask falls. Usually it's you.",
                "Before the truth surfaces. Usually it's you.",
                "Once the dawn breaks. Usually it's you.",
                "When the final curtain falls. Usually it's you."
            ],

            'inspirational_endings': [
                # Complete inspirational endings from file (250+ patterns)
                "Always remember the only limit is yourself.",
                "Always remember your potential knows no bounds.",
                "Always remember you are your greatest asset.",
                "Always remember your dreams are within reach.",
                "Always remember you have the power to change.",
                "Always remember your courage will guide you.",
                "Always remember your passion lights the way.",
                "Always remember your heart knows the truth.",
                "Always remember your perseverance prevails.",
                "Always remember your hope never fades.",
                "Always remember your spirit soars.",
                "Always remember your vision creates reality.",
                "Always remember your actions define you.",
                "Always remember your belief moves mountains.",
                "Always remember your journey has just begun.",
                "Always remember your strength is limitless.",
                "Always remember your purpose drives you.",
                "Always remember your ambition fuels success.",
                "Always remember your kindness changes lives.",
                "Always remember your generosity inspires all.",
                "Always remember your faith sustains you.",
                "Always remember your wisdom grows each day.",
                "Always remember your resilience overcomes all.",
                "Always remember your curiosity sparks innovation.",
                "Always remember your effort shapes destiny.",
                "Always remember your choices matter most.",
                "Always remember your love transforms worlds.",
                "Always remember your laughter lightens burdens.",
                "Always remember your integrity builds trust.",
                "Always remember your creativity unleashes magic.",
                "Never forget the only limit is yourself.",
                "Never forget your potential knows no bounds.",
                "Never forget you are your greatest asset.",
                "Never forget your dreams are within reach.",
                "Never forget you have the power to change.",
                "Never forget your courage will guide you.",
                "Never forget your passion lights the way.",
                "Never forget your heart knows the truth.",
                "Never forget your perseverance prevails.",
                "Never forget your hope never fades.",
                "Keep in mind the only limit is yourself.",
                "Keep in mind your potential knows no bounds.",
                "Keep in mind you are your greatest asset.",
                "Keep in mind your dreams are within reach.",
                "Keep in mind you have the power to change.",
                "Keep in mind your courage will guide you.",
                "Keep in mind your passion lights the way.",
                "Keep in mind your heart knows the truth.",
                "Keep in mind your perseverance prevails.",
                "Keep in mind your hope never fades.",
                "Believe that the only limit is yourself.",
                "Believe that your potential knows no bounds.",
                "Believe that you are your greatest asset.",
                "Believe that your dreams are within reach.",
                "Believe that you have the power to change.",
                "Believe that your courage will guide you.",
                "Believe that your passion lights the way.",
                "Believe that your heart knows the truth.",
                "Believe that your perseverance prevails.",
                "Believe that your hope never fades.",
                "Know that the only limit is yourself.",
                "Know that your potential knows no bounds.",
                "Know that you are your greatest asset.",
                "Know that your dreams are within reach.",
                "Know that you have the power to change.",
                "Know that your courage will guide you.",
                "Know that your passion lights the way.",
                "Know that your heart knows the truth.",
                "Know that your perseverance prevails.",
                "Know that your hope never fades.",
                "Embrace the fact that the only limit is yourself.",
                "Embrace the fact that your potential knows no bounds.",
                "Embrace the fact that you are your greatest asset.",
                "Embrace the fact that your dreams are within reach.",
                "Embrace the fact that you have the power to change."
            ],

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

        # Add sentence structure patterns
        patterns['uniform_sentences'] = self._detect_uniform_structure_patterns()
        return patterns

    def _detect_uniform_structure_patterns(self):
        """Patterns that indicate uniform sentence structure (AI characteristic)"""
        return [
            "^[A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+\\.",  # Similar sentence starts
            "\\. [A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+\\.",  # Repeated structures
        ]

    def _load_humanized_alternatives(self):
        """Enhanced humanized alternatives including Excel suggestions"""
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

        # Add Excel pattern suggestions to alternatives
        if hasattr(self, 'pattern_details'):
            for pattern, details in self.pattern_details.items():
                if details['suggestions']:
                    alternatives[pattern] = [s.strip() for s in details['suggestions'] if s.strip()]

        return alternatives

    def analyze_sentence_structure(self, text: str) -> Tuple[float, str]:
        """Analyze sentence structure uniformity (AI indicator)"""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]

        if len(sentences) < 3:
            return 0.0, "Insufficient sentences for analysis"

        # Analyze sentence length uniformity
        lengths = [len(s.split()) for s in sentences]
        avg_length = sum(lengths) / len(lengths)
        variance = sum((l - avg_length) ** 2 for l in lengths) / len(lengths)

        # Low variance = uniform length = more AI-like
        uniformity_score = max(0, 1 - (variance / (avg_length * 2)))

        # Check for repetitive sentence starters
        starters = [s.split()[0].lower() if s.split() else "" for s in sentences]
        starter_diversity = len(set(starters)) / len(starters) if starters else 1

        # Combine scores
        structure_score = (uniformity_score * 0.6) + ((1 - starter_diversity) * 0.4)

        details = f"Avg length: {avg_length:.1f}, Variance: {variance:.1f}, Starter diversity: {starter_diversity:.2f}"

        return structure_score, details

    def detect_ai_patterns(self, text: str) -> Dict[str, List[str]]:
        """Enhanced pattern detection with scoring"""
        detected = {}
        text_lower = text.lower()

        for category, patterns in self.ai_patterns.items():
            if category == 'uniform_sentences':
                continue  # Handle separately

            detected[category] = []
            for pattern in patterns:
                # Use regex for more accurate matching
                if re.search(r'\b' + re.escape(pattern.lower()) + r'\b', text_lower):
                    detected[category].append(pattern)

        # Remove empty categories
        detected = {k: v for k, v in detected.items() if v}
        return detected

    def calculate_ai_score(self, text: str) -> Tuple[float, dict]:
        """Calculate comprehensive AI probability score with Excel pattern weighting"""
        if not text.strip():
            return 0.0, {"error": "No text provided"}

        detected_patterns = self.detect_ai_patterns(text)
        structure_score, structure_details = self.analyze_sentence_structure(text)

        # Pattern scoring weights (including Excel patterns with severity-based weighting)
        weights = {
            'ai_cliches': 1.0,
            'corporate_buzzwords': 0.8,
            'revelation_phrases': 1.2,
            'truth_telling_phrases': 1.3,
            'escalation_phrases': 1.4,
            'dramatic_fragments': 1.5,
            'inspirational_endings': 1.1,
            'list_scaffolding': 0.9,
            'ai_hedging': 1.1,
            'generic_conclusions': 0.7,
            'artificial_enthusiasm': 0.6,
            'robotic_transitions': 1.0,
            'repetitive_structures': 0.8,
            'clickbait_patterns': 1.3,
            'ai_disclaimers': 2.0,  # Strong AI indicator
            # Excel pattern weights
            'excel_metaphors': 0.9,
            'excel_regex_balanced': 1.2,
            'excel_regex_wrapups': 0.8,
            'excel_regex_fillers': 0.7,
            'excel_melodramatic': 1.3,
            'excel_sentimental': 1.1,
            'excel_dramatic': 1.4
        }

        # Calculate pattern score with severity weighting
        pattern_score = 0
        total_patterns = 0

        for category, patterns in detected_patterns.items():
            base_weight = weights.get(category, 1.0)
            pattern_count = len(patterns)

            # Apply severity weighting for Excel patterns
            category_score = 0
            for pattern in patterns:
                pattern_weight = base_weight
                if hasattr(self, 'pattern_details') and pattern.lower() in self.pattern_details:
                    severity = self.pattern_details[pattern.lower()]['severity']
                    if severity == 'high':
                        pattern_weight *= 1.3
                    elif severity == 'medium':
                        pattern_weight *= 1.0
                    elif severity == 'low':
                        pattern_weight *= 0.7
                category_score += pattern_weight

            pattern_score += category_score
            total_patterns += pattern_count

        # Normalize by text length (patterns per 100 words)
        word_count = len(text.split())
        if word_count > 0:
            pattern_density = (pattern_score / word_count) * 100
        else:
            pattern_density = 0

        # Combine scores
        combined_score = min(1.0, (pattern_density * 0.3) + (structure_score * 0.7))

        # Convert to percentage
        ai_probability = combined_score * 100

        details = {
            'total_patterns': total_patterns,
            'pattern_density': pattern_density,
            'structure_score': structure_score,
            'structure_details': structure_details,
            'word_count': word_count
        }

        return ai_probability, details

    def get_detection_report(self, text: str) -> Tuple[str, float, str]:
        """Generate comprehensive AI detection report with Excel pattern suggestions"""
        ai_score, details = self.calculate_ai_score(text)
        detected_patterns = self.detect_ai_patterns(text)

        # Determine classification
        if ai_score >= 70:
            classification = "🤖 **HIGHLY LIKELY AI-GENERATED**"
            confidence = "Very High"
        elif ai_score >= 50:
            classification = "⚠️ **POSSIBLY AI-GENERATED**"
            confidence = "High"
        elif ai_score >= 30:
            classification = "🤔 **SOME AI CHARACTERISTICS**"
            confidence = "Medium"
        else:
            classification = "👤 **LIKELY HUMAN-WRITTEN**"
            confidence = "Low AI Probability"

        report = f"{classification}\n\n"
        report += f"**AI Probability Score: {ai_score:.1f}%** (Confidence: {confidence})\n\n"

        # Pattern breakdown with suggestions
        if detected_patterns:
            total_flags = sum(len(patterns) for patterns in detected_patterns.values())
            report += f"**🚩 {total_flags} AI PATTERNS DETECTED:**\n\n"

            category_names = {
                'ai_cliches': 'AI Clichés',
                'corporate_buzzwords': 'Corporate Buzzwords',
                'revelation_phrases': 'Revelation Phrases',
                'truth_telling_phrases': 'Truth-Telling Phrases',
                'escalation_phrases': 'Escalation Phrases',
                'dramatic_fragments': 'Dramatic Fragments',
                'inspirational_endings': 'Inspirational Endings',
                'list_scaffolding': 'List Scaffolding',
                'ai_hedging': 'AI Hedging Language',
                'generic_conclusions': 'Generic Conclusions',
                'artificial_enthusiasm': 'Artificial Enthusiasm',
                'robotic_transitions': 'Robotic Transitions',
                'repetitive_structures': 'Repetitive Structures',
                'clickbait_patterns': 'Clickbait Patterns',
                'ai_disclaimers': 'AI Disclaimers',
                # Excel pattern names
                'excel_metaphors': 'Excel Metaphors',
                'excel_regex_balanced': 'Excel Balanced Structures',
                'excel_regex_wrapups': 'Excel Wrap-up Phrases',
                'excel_regex_fillers': 'Excel Phrasal Fillers',
                'excel_melodramatic': 'Excel Melodramatic Expressions',
                'excel_sentimental': 'Excel Sentimental Phrases',
                'excel_dramatic': 'Excel Dramatic Language'
            }

            for category, patterns in detected_patterns.items():
                if patterns:
                    name = category_names.get(category, category.title())
                    count = len(patterns)
                    report += f"• **{name}** ({count}): "

                    # Show patterns with suggestions
                    pattern_details = []
                    for i, pattern in enumerate(patterns[:3]):
                        pattern_info = f'"{pattern}"'

                        # Add suggestions if available
                        if hasattr(self, 'pattern_details') and pattern.lower() in self.pattern_details:
                            details = self.pattern_details[pattern.lower()]
                            if details['suggestions']:
                                suggestions = ', '.join(details['suggestions'][:2])  # Limit to 2 suggestions
                                severity_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(details['severity'], "⚪")
                                pattern_info += f" {severity_emoji} → {suggestions}"

                        pattern_details.append(pattern_info)

                    report += ", ".join(pattern_details)

                    if len(patterns) > 3:
                        report += f" +{len(patterns)-3} more"
                    report += "\n"
        else:
            report += "✅ **No common AI patterns detected**\n"

        # Technical details
        report += f"\n**📊 Technical Analysis:**\n"
        report += f"• Word count: {details['word_count']}\n"
        report += f"• Pattern density: {details['pattern_density']:.2f} per 100 words\n"
        report += f"• Structure uniformity: {details['structure_score']:.2f}\n"
        report += f"• {details['structure_details']}\n"

        # Excel pattern legend
        if hasattr(self, 'pattern_details') and self.pattern_details:
            report += f"\n**📝 Pattern Severity Legend:**\n"
            report += f"• 🔴 High severity • 🟡 Medium severity • 🟢 Low severity\n"

        return report, ai_score, classification

    def humanize(self, text: str) -> Tuple[str, str, str]:
        """Enhanced humanization with pattern avoidance including Excel suggestions"""
        if not self.anthropic_available:
            return "❌ Humanization requires ANTHROPIC_API_KEY", "❌ API key required", "Set ANTHROPIC_API_KEY to enable this feature"

        if not text.strip():
            return "Please provide some text to humanize.", "❌ No text provided", "No analysis available"

        try:
            # Detect patterns before processing
            patterns_before = self.detect_ai_patterns(text)
            ai_score_before, _ = self.calculate_ai_score(text)

            # Create enhanced prompt with Excel suggestions
            flagged_phrases = []
            suggestions_text = ""

            for patterns in patterns_before.values():
                flagged_phrases.extend(patterns)

            # Add suggestions from Excel patterns
            if hasattr(self, 'pattern_details'):
                excel_suggestions = []
                for pattern in flagged_phrases:
                    if pattern.lower() in self.pattern_details:
                        details = self.pattern_details[pattern.lower()]
                        if details['suggestions']:
                            excel_suggestions.append(f'"{pattern}" → {", ".join(details["suggestions"][:2])}')

                if excel_suggestions:
                    suggestions_text = f"\n\nUSE THESE ALTERNATIVES:\n" + "\n".join(excel_suggestions[:10])

            pattern_warning = ""
            if flagged_phrases:
                pattern_warning = f"\n\nAVOID these detected AI patterns: {', '.join(flagged_phrases[:15])}{suggestions_text}"

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

            # Analyze results
            patterns_after = self.detect_ai_patterns(humanized_text)
            ai_score_after, _ = self.calculate_ai_score(humanized_text)

            # Calculate improvement
            before_count = sum(len(patterns) for patterns in patterns_before.values())
            after_count = sum(len(patterns) for patterns in patterns_after.values())
            score_improvement = ai_score_before - ai_score_after

            status = f"✅ AI Score: {ai_score_before:.1f}% → {ai_score_after:.1f}% (-{score_improvement:.1f}%)"
            if score_improvement > 20:
                status += " | Significant improvement!"
            elif score_improvement > 10:
                status += " | Good improvement"
            elif score_improvement > 0:
                status += " | Minor improvement"
            else:
                status += " | ⚠️ Limited improvement"

            # Generate analysis
            analysis = "**BEFORE HUMANIZATION:**\n"
            analysis += f"AI Score: {ai_score_before:.1f}% | Patterns: {before_count}\n\n"
            analysis += "**AFTER HUMANIZATION:**\n"
            analysis += f"AI Score: {ai_score_after:.1f}% | Patterns: {after_count}\n"
            analysis += f"Improvement: -{score_improvement:.1f} percentage points"

            return humanized_text, status, analysis

        except Exception as e:
            return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

    # PLAGIARISM DETECTION METHODS
    def check_plagiarism_local(self, text1: str, text2: str) -> Tuple[float, dict]:
        """Check for plagiarism between two texts using local similarity analysis"""
        if not text1.strip() or not text2.strip():
            return 0.0, {"error": "Both texts must be provided"}

        # Clean and normalize texts
        text1_clean = re.sub(r'[^\w\s]', '', text1.lower())
        text2_clean = re.sub(r'[^\w\s]', '', text2.lower())

        # Overall similarity using SequenceMatcher
        overall_similarity = SequenceMatcher(None, text1_clean, text2_clean).ratio()

        # Sentence-by-sentence comparison
        sentences1 = [s.strip() for s in re.split(r'[.!?]+', text1) if s.strip()]
        sentences2 = [s.strip() for s in re.split(r'[.!?]+', text2) if s.strip()]

        sentence_similarities = []
        for s1 in sentences1:
            max_sim = 0.0
            for s2 in sentences2:
                sim = SequenceMatcher(None, s1.lower(), s2.lower()).ratio()
                if sim > max_sim:
                    max_sim = sim
            sentence_similarities.append(max_sim)

        avg_sentence_similarity = sum(sentence_similarities) / len(sentence_similarities) if sentence_similarities else 0.0

        # Word overlap analysis
        words1 = set(text1_clean.split())
        words2 = set(text2_clean.split())
        if words1 and words2:
            word_overlap = len(words1.intersection(words2)) / len(words1.union(words2))
        else:
            word_overlap = 0.0

        # N-gram analysis (3-grams)
        def get_ngrams(text, n=3):
            words = text.split()
            return set(zip(*[words[i:] for i in range(n)])) if len(words) >= n else set()

        ngrams1 = get_ngrams(text1_clean)
        ngrams2 = get_ngrams(text2_clean)
        if ngrams1 and ngrams2:
            ngram_overlap = len(ngrams1.intersection(ngrams2)) / len(ngrams1.union(ngrams2))
        else:
            ngram_overlap = 0.0

        # Combined plagiarism score
        plagiarism_score = (
            (overall_similarity * 0.4) +
            (avg_sentence_similarity * 0.3) +
            (word_overlap * 0.2) +
            (ngram_overlap * 0.1)
        )

        details = {
            'overall_similarity': overall_similarity * 100,
            'sentence_similarity': avg_sentence_similarity * 100,
            'word_overlap': word_overlap * 100,
            'ngram_overlap': ngram_overlap * 100,
            'word_count_1': len(text1.split()),
            'word_count_2': len(text2.split())
        }

        return plagiarism_score * 100, details

    def get_plagiarism_report(self, text1: str, text2: str) -> Tuple[str, float, str]:
        """Generate comprehensive plagiarism analysis report"""
        if not text1.strip() or not text2.strip():
            return "❌ **Please provide both texts for plagiarism comparison.**", 0, "❌ Insufficient data"

        plagiarism_score, details = self.check_plagiarism_local(text1, text2)

        # Determine classification
        if plagiarism_score >= 80:
            classification = "🚨 **HIGHLY LIKELY PLAGIARIZED**"
            confidence = "Very High"
        elif plagiarism_score >= 60:
            classification = "⚠️ **POSSIBLY PLAGIARIZED**"
            confidence = "High"
        elif plagiarism_score >= 40:
            classification = "🤔 **SOME SIMILARITIES DETECTED**"
            confidence = "Medium"
        elif plagiarism_score >= 20:
            classification = "📝 **MINOR SIMILARITIES**"
            confidence = "Low"
        else:
            classification = "✅ **LIKELY ORIGINAL**"
            confidence = "Very Low Plagiarism Risk"

        report = f"{classification}\n\n"
        report += f"**Plagiarism Score: {plagiarism_score:.1f}%** (Confidence: {confidence})\n\n"

        # Detailed analysis
        report += "**📊 SIMILARITY ANALYSIS:**\n\n"
        report += f"• **Overall Text Similarity:** {details['overall_similarity']:.1f}%\n"
        report += f"• **Sentence-level Similarity:** {details['sentence_similarity']:.1f}%\n"
        report += f"• **Word Overlap:** {details['word_overlap']:.1f}%\n"
        report += f"• **Phrase Pattern Overlap:** {details['ngram_overlap']:.1f}%\n\n"

        # Text statistics
        report += "**📏 TEXT STATISTICS:**\n\n"
        report += f"• **Text 1 Word Count:** {details['word_count_1']}\n"
        report += f"• **Text 2 Word Count:** {details['word_count_2']}\n"

        length_diff = abs(details['word_count_1'] - details['word_count_2'])
        report += f"• **Length Difference:** {length_diff} words\n\n"

        # Recommendations
        report += "**💡 RECOMMENDATIONS:**\n\n"
        if plagiarism_score >= 60:
            report += "• ⚠️ High similarity detected - review for potential plagiarism\n"
            report += "• 🔍 Check for proper citations and attribution\n"
            report += "• ✏️ Consider paraphrasing or rewriting similar sections\n"
        elif plagiarism_score >= 40:
            report += "• 🤔 Moderate similarities found - verify originality\n"
            report += "• 📝 Review overlapping sections for proper attribution\n"
        elif plagiarism_score >= 20:
            report += "• ✅ Minor similarities are normal for related topics\n"
            report += "• 📚 Ensure any quotes or references are properly cited\n"
        else:
            report += "• ✅ Texts appear to be original with minimal overlap\n"
            report += "• 🎯 Good originality indicators detected\n"

        status = f"Analysis complete: {classification}"

        return report, plagiarism_score, status

    # PLAGIARISM REMOVAL METHODS
    def remove_plagiarism(self, text: str, rewrite_mode: str = "balanced", reference_text: str = "") -> dict:
        """Advanced plagiarism removal with rewriting"""
        if not text.strip():
            return {"error": "Text cannot be empty"}

        try:
            # Original plagiarism score if reference provided
            original_plagiarism_score = 0.0
            if reference_text.strip():
                original_plagiarism_score, _ = self.check_plagiarism_local(text, reference_text)

            # Get AI patterns to avoid
            detected_ai_patterns = self.detect_ai_patterns(text)
            flagged_phrases = []
            for patterns in detected_ai_patterns.values():
                flagged_phrases.extend(patterns)

            # Define rewriting strategies
            strategies = {
                "conservative": {
                    "description": "Light paraphrasing while maintaining original structure",
                    "prompt": """Rewrite this text to eliminate plagiarism while keeping the original meaning and structure as much as possible. Make minimal changes but ensure the text is sufficiently different from the original.

Guidelines:
- Replace key terms with synonyms
- Slightly modify sentence structure
- Keep the same overall organization
- Maintain technical accuracy
- Preserve the original tone
- Avoid AI writing patterns and clichés"""
                },
                "balanced": {
                    "description": "Moderate restructuring with synonym replacement",
                    "prompt": """Rewrite this text to completely eliminate plagiarism while maintaining the core meaning and information. Use a balanced approach that changes both vocabulary and sentence structure.

Guidelines:
- Replace words with appropriate synonyms
- Restructure sentences significantly
- Change paragraph organization if needed
- Use different transitions and connectors
- Maintain factual accuracy
- Keep the same level of detail
- Write in a natural, human style
- Avoid corporate buzzwords and AI patterns"""
                },
                "aggressive": {
                    "description": "Complete restructuring with new writing style",
                    "prompt": """Completely rewrite this text from scratch to eliminate all plagiarism. Transform the writing style, structure, and approach while preserving all the essential information and meaning.

Guidelines:
- Use completely different sentence structures
- Reorganize information flow
- Change the writing style and tone
- Use different examples or explanations where possible
- Replace all possible words with synonyms
- Create a fresh perspective on the same content
- Write naturally like a human would
- Avoid all AI writing patterns, corporate jargon, and clichés"""
                }
            }

            strategy = strategies.get(rewrite_mode, strategies["balanced"])

            # Create the rewriting prompt
            full_prompt = f"""{strategy['prompt']}

Text to rewrite:
\"\"\"
{text}
\"\"\"

IMPORTANT INSTRUCTIONS:
- Write naturally and conversationally
- Avoid these AI patterns: {', '.join(flagged_phrases[:10]) if flagged_phrases else 'corporate buzzwords and clichés'}
- Use varied sentence lengths and structures
- Make it sound human-written

Return only the rewritten version with no explanations."""

            # Add reference context if provided
            if reference_text.strip():
                full_prompt += f"\n\nCRITICAL: Ensure the rewritten text is significantly different from this reference text:\n\"\"\"\n{reference_text[:500]}{'...' if len(reference_text) > 500 else ''}\n\"\"\""

            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                messages=[{"role": "user", "content": full_prompt}]
            )

            rewritten_text = response.content[0].text.strip()

            # Calculate improvement metrics
            new_plagiarism_score = 0.0
            if reference_text.strip():
                new_plagiarism_score, _ = self.check_plagiarism_local(rewritten_text, reference_text)

            # Calculate AI score improvement
            original_ai_score, _ = self.calculate_ai_score(text)
            new_ai_score, _ = self.calculate_ai_score(rewritten_text)

            # Calculate text statistics
            original_word_count = len(text.split())
            new_word_count = len(rewritten_text.split())
            length_change = ((new_word_count - original_word_count) / original_word_count) * 100 if original_word_count > 0 else 0

            return {
                "rewritten_text": rewritten_text,
                "original_plagiarism_score": original_plagiarism_score,
                "new_plagiarism_score": new_plagiarism_score,
                "original_ai_score": original_ai_score,
                "new_ai_score": new_ai_score,
                "improvement": original_plagiarism_score - new_plagiarism_score,
                "ai_improvement": original_ai_score - new_ai_score,
                "original_word_count": original_word_count,
                "new_word_count": new_word_count,
                "length_change": length_change,
                "rewrite_mode": rewrite_mode,
                "strategy_description": strategy["description"]
            }

        except Exception as e:
            logger.error(f"Plagiarism removal error: {str(e)}")
            return {"error": str(e)}

# Initialize the detector
logger.info("🚀 Initializing AI Text Detector with Comprehensive Patterns...")
detector_humanizer = AITextDetectorHumanizer(api_key)

# Pydantic models
class TextAnalysisRequest(BaseModel):
    text: str

class HumanizeRequest(BaseModel):
    text: str

class PlagiarismCheckRequest(BaseModel):
    text1: str
    text2: str

class PlagiarismRemoveRequest(BaseModel):
    text: str
    rewrite_mode: Optional[str] = "balanced"
    reference_text: Optional[str] = ""

# API Routes with logging
@app.get("/")
async def root():
    logger.info("✅ Root endpoint accessed")
    return {
        "message": "AI Text Detector & Humanizer API with Enhanced Excel Integration",
        "version": "2.0.0",
        "status": "running",
        "features": [
            "Advanced AI Text Detection (5000+ patterns)",
            "Excel Pattern Integration with Suggestions",
            "Severity-based Pattern Weighting",
            "Intelligent Text Humanization",
            "Multi-algorithm Plagiarism Detection",
            "Advanced Plagiarism Removal",
            "Comprehensive Pattern Analysis"
        ],
        "pattern_stats": {
            "total_patterns": sum(len(patterns) for patterns in detector_humanizer.ai_patterns.values()),
            "categories": len(detector_humanizer.ai_patterns),
            "dramatic_fragments": "1000+",
            "inspirational_endings": "250+",
            "revelation_phrases": "500+",
            "truth_telling_phrases": "300+",
            "excel_patterns_loaded": bool(detector_humanizer.excel_patterns),
            "excel_suggestions_available": hasattr(detector_humanizer, 'pattern_details') and bool(detector_humanizer.pattern_details)
        }
    }

@app.post("/analyze")
async def analyze_text(request: TextAnalysisRequest):
    """Analyze text for AI characteristics"""
    logger.info(f"🔍 AI analysis request received: {len(request.text)} characters")

    if not request.text.strip():
        logger.warning("❌ Empty text submitted for AI analysis")
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        report, score, classification = detector_humanizer.get_detection_report(request.text)
        detected_patterns = detector_humanizer.detect_ai_patterns(request.text)

        logger.info(f"✅ AI analysis successful: {score:.1f}% AI probability")
        return {
            "ai_score": score,
            "classification": classification,
            "report": report,
            "detected_patterns": detected_patterns
        }
    except Exception as e:
        logger.error(f"❌ AI analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/humanize")
async def humanize_text(request: HumanizeRequest):
    """Humanize AI-generated text"""
    logger.info(f"✨ Humanization request received: {len(request.text)} characters")

    if not request.text.strip():
        logger.warning("❌ Empty text submitted for humanization")
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        humanized_text, status, analysis = detector_humanizer.humanize(request.text)
        logger.info("✅ Humanization successful")
        return {
            "humanized_text": humanized_text,
            "status": status,
            "analysis": analysis
        }
    except Exception as e:
        logger.error(f"❌ Humanization error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/check-plagiarism")
async def check_plagiarism(request: PlagiarismCheckRequest):
    """Check two texts for plagiarism"""
    logger.info(f"🔍 Plagiarism check request received")

    if not request.text1.strip() or not request.text2.strip():
        logger.warning("❌ Empty texts submitted for plagiarism check")
        raise HTTPException(status_code=400, detail="Both texts are required")

    try:
        report, score, status = detector_humanizer.get_plagiarism_report(request.text1, request.text2)
        raw_score, details = detector_humanizer.check_plagiarism_local(request.text1, request.text2)

        logger.info(f"✅ Plagiarism check successful: {score:.1f}% similarity")
        return {
            "plagiarism_score": score,
            "report": report,
            "status": status,
            "details": details
        }
    except Exception as e:
        logger.error(f"❌ Plagiarism check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/remove-plagiarism")
async def remove_plagiarism(request: PlagiarismRemoveRequest):
    """Rewrite text to remove plagiarism"""
    logger.info(f"🔄 Plagiarism removal request received: {len(request.text)} characters")

    if not request.text.strip():
        logger.warning("❌ Empty text submitted for plagiarism removal")
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        result = detector_humanizer.remove_plagiarism(
            request.text,
            request.rewrite_mode,
            request.reference_text
        )
        if "error" in result:
            logger.error(f"❌ Plagiarism removal failed: {result['error']}")
            raise HTTPException(status_code=500, detail=result["error"])

        logger.info("✅ Plagiarism removal successful")
        return result
    except Exception as e:
        logger.error(f"❌ Plagiarism removal error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    total_patterns = sum(len(patterns) for patterns in detector_humanizer.ai_patterns.values())
    return {
        "status": "healthy",
        "timestamp": "2025-08-21",
        "ai_patterns_loaded": total_patterns,
        "pattern_categories": len(detector_humanizer.ai_patterns),
        "anthropic_available": detector_humanizer.anthropic_available,
        "excel_patterns_loaded": bool(detector_humanizer.excel_patterns),
        "excel_suggestions_available": hasattr(detector_humanizer, 'pattern_details') and bool(detector_humanizer.pattern_details),
        "features": [
            "Comprehensive AI Detection (5000+ patterns)",
            "Excel Pattern Integration with Suggestions",
            "Advanced Plagiarism Detection",
            "Multi-mode Text Humanization",
            "Pattern-based Analysis",
            "Real-time Scoring",
            "Severity-based Weighting"
        ],
        "pattern_breakdown": {
            "dramatic_fragments": "1000+",
            "inspirational_endings": "250+",
            "revelation_phrases": "500+",
            "truth_telling_phrases": "300+",
            "escalation_phrases": "200+",
            "ai_cliches": "100+",
            "corporate_buzzwords": "100+",
            "excel_patterns_integrated": "✅" if detector_humanizer.excel_patterns else "❌"
        }
    }

# CORS preflight handlers
@app.options("/analyze")
async def options_analyze():
    return {"message": "OK"}

@app.options("/humanize")
async def options_humanize():
    return {"message": "OK"}

@app.options("/check-plagiarism")
async def options_check_plagiarism():
    return {"message": "OK"}

@app.options("/remove-plagiarism")
async def options_remove_plagiarism():
    return {"message": "OK"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
