"""
AI Text Detection Module
Contains all AI pattern detection and scoring functionality
"""

import json
import re
import pandas as pd
import logging
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)

class AITextDetector:
    def __init__(self):
        self.ai_patterns = {}
        self.excel_patterns = {}
        self.pattern_details = {}
        
        # Load patterns
        self._load_detection_patterns()
        self._load_excel_patterns()
        self._merge_excel_patterns()
        
        logger.info(f"✅ AI Detector initialized with {sum(len(p) for p in self.ai_patterns.values())} patterns")

    def _load_detection_patterns(self):
        """Load AI writing patterns from JSON file"""
        try:
            with open('ai_patterns.json', 'r', encoding='utf-8') as file:
                self.ai_patterns = json.load(file)
                logger.info(f"✅ Successfully loaded patterns from ai_patterns.json")
        except FileNotFoundError:
            logger.error("❌ ai_patterns.json not found! Using minimal fallback patterns.")
            # Minimal fallback patterns if JSON file is missing
            self.ai_patterns = {
                'ai_cliches': [
                    "in today's fast-paced world", "with that being said", "at the end of the day",
                    "ultimately", "moving forward", "as such", "in conclusion"
                ],
                'corporate_buzzwords': [
                    "cutting-edge", "state-of-the-art", "leveraging", "synergy", "paradigm",
                    "holistic", "scalable", "robust", "optimize", "streamline"
                ],
                'ai_disclaimers': [
                    "as an ai", "i'm an ai", "as a language model", "i don't have personal experience"
                ]
            }
        except json.JSONDecodeError as e:
            logger.error(f"❌ Error parsing ai_patterns.json: {e}")
            self.ai_patterns = {}
        except Exception as e:
            logger.error(f"❌ Error loading patterns from JSON: {e}")
            self.ai_patterns = {}

    def _load_excel_patterns(self):
        """Load patterns from Excel file with suggestions and severity"""
        try:
            df = pd.read_excel('phrasal_patterns.xlsx')
            logger.info("📊 Loading patterns from phrasal_patterns.xlsx...")

            self.excel_patterns = {
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

            # Process the Excel data
            for index, row in df.iterrows():
                if index < 3:  # Skip header rows
                    continue

                try:
                    # Process each column group (pattern, suggestions, severity)
                    column_mappings = [
                        (0, 1, 2, 'excel_buzzwords'),
                        (3, 4, 5, 'excel_metaphors'),
                        (6, 7, 8, 'excel_cliches'),
                        (9, 10, 11, 'excel_regex_balanced'),
                        (12, 13, 14, 'excel_regex_wrapups'),
                        (15, 16, 17, 'excel_regex_fillers'),
                        (18, 19, 20, 'excel_melodramatic'),
                        (21, 22, 23, 'excel_sentimental'),
                        (24, 25, 26, 'excel_dramatic')
                    ]

                    for pattern_col, suggestion_col, severity_col, category in column_mappings:
                        if len(row) > pattern_col and pd.notna(row.iloc[pattern_col]) and str(row.iloc[pattern_col]).strip():
                            pattern = str(row.iloc[pattern_col]).strip().lower()
                            if pattern and pattern not in ['pattern', category.split('_')[1], '']:
                                self.excel_patterns[category].append(pattern)
                                suggestions = str(row.iloc[suggestion_col]) if len(row) > suggestion_col and pd.notna(row.iloc[suggestion_col]) else ""
                                severity = str(row.iloc[severity_col]) if len(row) > severity_col and pd.notna(row.iloc[severity_col]) else "medium"
                                self.pattern_details[pattern] = {
                                    'category': category,
                                    'suggestions': suggestions.split(',') if suggestions else [],
                                    'severity': severity
                                }

                except Exception as e:
                    continue  # Skip problematic rows

            # Clean up patterns
            self.excel_patterns = {k: list(set([p for p in v if p and len(p) > 2])) for k, v in self.excel_patterns.items()}

            total_excel = sum(len(patterns) for patterns in self.excel_patterns.values())
            logger.info(f"✅ Loaded {total_excel} patterns from Excel file with suggestions")

        except FileNotFoundError:
            logger.warning("⚠️ phrasal_patterns.xlsx not found, skipping Excel patterns")
            self.pattern_details = {}
            self.excel_patterns = {}
        except Exception as e:
            logger.error(f"❌ Error loading Excel patterns: {e}")
            self.pattern_details = {}
            self.excel_patterns = {}

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
