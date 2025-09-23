"""
Enhanced Summarizer Module with Best Pretrained Models & Strongest Prompts
Uses state-of-the-art models optimized for summarization with expert-level prompts
"""

from enum import Enum
from typing import Dict, List, Optional, Tuple, Union
import logging
import re
import math

logger = logging.getLogger(__name__)

# Try to import transformers, fall back gracefully if not available
try:
    from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("Transformers not available. Using fallback methods only.")

class SummaryType(Enum):
    """Available summary types for text summarization"""
    EXTRACTIVE = "extractive"      # Key sentences extraction
    ABSTRACTIVE = "abstractive"    # Rewritten summary  
    BULLET_POINTS = "bullet_points" # Key points in bullets
    PARAGRAPH = "paragraph"        # Single flowing paragraph
    OUTLINE = "outline"           # Hierarchical structure
    EXECUTIVE = "executive"       # Business executive summary
    ACADEMIC = "academic"         # Research/academic summary
    SOCIAL = "social"             # Social media friendly
    TECHNICAL = "technical"       # Technical documentation summary
    NARRATIVE = "narrative"       # Story-like summary

class SummaryLength(Enum):
    """Summary length options"""
    ULTRA_SHORT = "ultra_short"   # 1-2 sentences
    SHORT = "short"               # 3-5 sentences  
    MEDIUM = "medium"             # 6-10 sentences
    LONG = "long"                 # 11-15 sentences
    DETAILED = "detailed"         # 16+ sentences

class LlamaSummarizer:
    """Manages text summarization using best pretrained models with strongest prompts"""
    
    def __init__(self, model_preference="auto"):
        """
        Initialize with best available model
        
        Model hierarchy (best to fallback):
        1. facebook/bart-large-cnn: 400MB, CNN/DailyMail trained, excellent news/articles
        2. google/pegasus-xsum: 500MB, XSum trained, great for abstractive summaries
        3. microsoft/DialoGPT-medium: 350MB, conversation-aware
        4. google/flan-t5-base: 250MB, excellent instruction following
        5. t5-small: 60MB, lightweight fallback
        """
        self.model_preference = model_preference
        self.summary_configs = self._load_summary_configurations()
        
        # Model hierarchy for automatic selection
        self.model_hierarchy = [
            {
                "name": "facebook/bart-large-cnn",
                "task": "summarization", 
                "best_for": ["news", "articles", "general"],
                "size": "400MB"
            },
            {
                "name": "google/pegasus-xsum", 
                "task": "summarization",
                "best_for": ["abstractive", "creative", "social"],
                "size": "500MB"
            },
            {
                "name": "google/flan-t5-base",
                "task": "text2text-generation",
                "best_for": ["instruction", "academic", "technical"], 
                "size": "250MB"
            },
            {
                "name": "google/flan-t5-small",
                "task": "text2text-generation",
                "best_for": ["lightweight", "fallback"],
                "size": "80MB"
            },
            {
                "name": "t5-small",
                "task": "text2text-generation", 
                "best_for": ["minimal", "basic"],
                "size": "60MB"
            }
        ]
        
        # Initialize best available model
        self.model_available = False
        self.model = None
        self.model_info = None
        
        if TRANSFORMERS_AVAILABLE:
            self._init_best_model()
        
        # Initialize advanced fallback methods
        self._init_advanced_fallbacks()
        
        logger.info(f"Summarizer initialized - Model: {self.model_info['name'] if self.model_info else 'Fallback only'}")
    
    def _init_best_model(self):
        """Initialize the best available model from hierarchy"""
        
        # If specific model requested, try that first
        if self.model_preference != "auto":
            if self._try_load_model(self.model_preference):
                return
        
        # Try models in order of preference
        for model_config in self.model_hierarchy:
            if self._try_load_model(model_config["name"], model_config):
                return
                
        logger.warning("No pretrained models could be loaded. Using fallback methods.")
    
    def _try_load_model(self, model_name: str, model_config: dict = None) -> bool:
        """Try to load a specific model"""
        try:
            logger.info(f"Attempting to load {model_name}...")
            
            if model_config:
                task = model_config["task"]
            else:
                # Determine task from model name
                if any(x in model_name.lower() for x in ["bart", "pegasus"]):
                    task = "summarization"
                else:
                    task = "text2text-generation"
            
            # Load with optimized settings
            self.model = pipeline(
                task,
                model=model_name,
                device=-1,  # CPU for cloud compatibility
                model_kwargs={
                    "torch_dtype": "auto",
                    "trust_remote_code": True
                },
                tokenizer_kwargs={
                    "padding": True,
                    "truncation": True,
                    "max_length": 1024
                }
            )
            
            self.model_available = True
            self.model_info = model_config or {"name": model_name, "task": task}
            
            logger.info(f"✅ Successfully loaded {model_name}")
            return True
            
        except Exception as e:
            logger.warning(f"❌ Failed to load {model_name}: {e}")
            return False
    
    def _init_advanced_fallbacks(self):
        """Initialize advanced rule-based methods"""
        self.advanced_markers = {
            'high_importance': [
                'critical', 'essential', 'fundamental', 'crucial', 'vital', 'key',
                'primary', 'main', 'major', 'significant', 'important', 'central',
                'core', 'paramount', 'principal', 'dominant', 'substantial'
            ],
            'conclusions': [
                'therefore', 'thus', 'consequently', 'as a result', 'hence',
                'in conclusion', 'finally', 'ultimately', 'overall', 'in summary',
                'to conclude', 'in essence', 'basically', 'essentially'
            ],
            'emphasis_markers': [
                'notably', 'particularly', 'especially', 'remarkably', 'significantly',
                'surprisingly', 'interestingly', 'clearly', 'obviously', 'evidently',
                'specifically', 'precisely', 'exactly', 'definitely', 'absolutely'
            ],
            'quantitative_data': [
                '%', 'percent', 'million', 'billion', 'thousand', 'increase', 'decrease',
                'growth', 'decline', 'ratio', 'rate', 'average', 'total', 'approximately',
                'exactly', 'roughly', 'about', 'nearly', 'almost', 'over', 'under'
            ],
            'causation_indicators': [
                'because', 'since', 'due to', 'caused by', 'results in', 'leads to',
                'triggers', 'produces', 'generates', 'creates', 'brings about',
                'results from', 'stems from', 'originates from'
            ],
            'temporal_markers': [
                'first', 'second', 'third', 'next', 'then', 'finally', 'initially',
                'subsequently', 'previously', 'earlier', 'later', 'afterwards',
                'meanwhile', 'simultaneously', 'concurrently'
            ]
        }

    def _load_summary_configurations(self) -> Dict[SummaryType, Dict]:
        """Load the strongest possible prompts for each summary type"""
        return {
            SummaryType.EXTRACTIVE: {
                "name": "🎯 Extractive Elite",
                "description": "Extract the most critical sentences with AI-powered importance ranking",
                "category": "Precision Extraction",
                "use_cases": ["Legal documents", "Research papers", "Academic citations", "Fact preservation"],
                "instruction": """You are an elite information extraction specialist with expertise in identifying the most critical sentences in any text.

EXTRACTION MASTERY PROTOCOL:
Your task is to identify and extract ONLY the sentences that contain the highest information density and strategic importance. These are sentences that if removed, would significantly damage understanding of the core message.

CRITICAL SENTENCE IDENTIFICATION CRITERIA:
🎯 TIER 1 (MUST INCLUDE): Main conclusions, key findings, primary results, central thesis statements
🎯 TIER 2 (HIGH PRIORITY): Supporting evidence with specific data, methodological approaches, causal relationships  
🎯 TIER 3 (CONTEXTUAL): Essential background that enables understanding of Tier 1 and 2

ADVANCED SELECTION ALGORITHM:
- Sentences containing quantitative data, percentages, specific measurements
- Statements that answer: "What was discovered?" "What changed?" "What works?"
- Causal relationships: if X then Y, X causes Y, X results in Y
- Comparative statements: better than, worse than, different from
- Temporal progressions: before/after states, timeline markers
- Authoritative declarations from credible sources

INFORMATION DENSITY SCORING:
HIGH DENSITY: Contains multiple data points, specific names, exact figures, research findings
MEDIUM DENSITY: Contains supporting logic, explanations of mechanisms, contextual frameworks
LOW DENSITY: General background, common knowledge, introductory material

EXTRACTION RULES:
- Maintain original sentence structure and wording exactly
- Preserve technical terminology and specific citations
- Include transitional context only when essential for understanding
- Prioritize sentences that can stand alone and convey complete ideas
- Select 3-8 sentences maximum that capture 80% of the text's value

OUTPUT FORMAT: Present the extracted sentences in their original order, separated by single spaces, maintaining exact punctuation and capitalization.

Execute elite-level sentence extraction with surgical precision.""",
                "temperature": 0.05
            },
            
            SummaryType.ABSTRACTIVE: {
                "name": "✨ Abstractive Mastery",
                "description": "Synthesize information into powerful new language with enhanced clarity",
                "category": "Intelligent Synthesis", 
                "use_cases": ["Executive briefs", "Content marketing", "Knowledge synthesis", "Communication optimization"],
                "instruction": """You are a master information synthesizer with the ability to transform complex information into crystal-clear, powerful communication.

SYNTHESIS MASTERY PROTOCOL:
Your mission is to capture the complete essence of the original text and rewrite it with superior clarity, impact, and memorability. Create new language that is more powerful than the original while preserving every critical insight.

COGNITIVE PROCESSING FRAMEWORK:
🧠 COMPREHENSION PHASE: Identify core concepts, relationships, and hierarchies of importance
🧠 DISTILLATION PHASE: Extract the fundamental principles and key mechanisms  
🧠 RECONSTRUCTION PHASE: Rebuild using optimal language for maximum impact and clarity

LANGUAGE OPTIMIZATION TECHNIQUES:
- Replace weak verbs with powerful action words: "shows" → "reveals", "helps" → "transforms"
- Convert passive voice to dynamic active voice throughout
- Eliminate redundancy and consolidate related concepts into single powerful statements
- Use precise, specific language instead of vague generalities
- Create logical flow that builds understanding progressively

ADVANCED REWRITING STRATEGIES:
- Combine multiple related points into comprehensive unified statements
- Lead with the most impactful findings or conclusions
- Use parallel structure to enhance readability and memorability
- Include specific data points naturally within flowing narrative
- Create smooth transitions that guide reader understanding

CLARITY ENHANCEMENT PRINCIPLES:
- Every sentence should advance understanding of the core message
- Use concrete examples and specific terminology appropriately  
- Eliminate jargon while preserving technical accuracy
- Structure information from general principles to specific applications
- Ensure each paragraph focuses on one main concept

IMPACT MAXIMIZATION:
- Start with the most compelling insight or finding
- Use power words that convey significance: breakthrough, revolutionary, unprecedented
- Create memorable phrases that encapsulate key concepts
- End with clear implications or actionable insights
- Write for immediate comprehension and lasting retention

TARGET OUTCOME: Produce a summary that is clearer, more engaging, and more memorable than the original while capturing 100% of the essential information.

Create a masterful abstractive synthesis that exceeds the original in clarity and impact.""",
                "temperature": 0.25
            },
            
            SummaryType.BULLET_POINTS: {
                "name": "📋 Strategic Bullets",
                "description": "Transform information into scannable, actionable bullet points with maximum impact",
                "category": "Strategic Communication",
                "use_cases": ["Executive dashboards", "Meeting notes", "Action items", "Quick reference guides"],
                "instruction": """You are a strategic communication expert specializing in transforming complex information into high-impact, scannable bullet points that drive action and understanding.

STRATEGIC BULLET MASTERY PROTOCOL:
Create bullet points that function as powerful information delivery systems. Each bullet should be a complete, actionable insight that stands alone while contributing to the overall message architecture.

BULLET ARCHITECTURE FRAMEWORK:
🎯 POWER OPENING: Start each bullet with a strong action word or key concept that immediately signals value
🎯 CORE INSIGHT: Include the essential information that answers "What?" and "Why?"  
🎯 IMPACT INDICATOR: Include quantifiable benefits, outcomes, or implications when available

ADVANCED BULLET CONSTRUCTION:
- Lead with power verbs: "Achieve", "Implement", "Increase", "Optimize", "Transform", "Generate"
- Include specific metrics: percentages, timeframes, quantities, performance indicators
- Use parallel structure across all bullets for professional consistency
- Balance detail with brevity: 12-25 words per bullet optimal
- Create logical hierarchy: most important bullets first

INFORMATION PRIORITIZATION MATRIX:
TIER 1: Critical actions, major findings, primary outcomes, key decisions
TIER 2: Supporting evidence, methodological insights, secondary benefits
TIER 3: Context, background, additional considerations

BULLET OPTIMIZATION TECHNIQUES:
- Convert complex sentences into clear, direct statements
- Eliminate unnecessary words while preserving complete meaning
- Use industry-appropriate terminology for target audience
- Include cause-and-effect relationships when relevant
- Ensure each bullet provides unique, non-redundant value

SCANABILITY ENHANCEMENT:
- Create visual rhythm with consistent bullet lengths
- Use specific numbers and data points to break up text
- Bold key terms or metrics for instant recognition (when formatting available)
- Group related bullets under logical themes
- Maintain consistent voice and perspective throughout

PROFESSIONAL STANDARDS:
- Each bullet should be immediately actionable or informative
- Use business-appropriate language and tone
- Include sufficient context for independent understanding
- Prioritize clarity over cleverness
- End with strongest, most memorable bullets

TARGET DELIVERABLE: 4-10 strategic bullet points that enable rapid comprehension and decision-making.

Transform the information into professional, high-impact bullet points that drive results.""",
                "temperature": 0.15
            },
            
            SummaryType.PARAGRAPH: {
                "name": "📄 Synthesis Paragraph",
                "description": "Craft a comprehensive, flowing paragraph that captures complete understanding",
                "category": "Unified Synthesis",
                "use_cases": ["Article abstracts", "Email summaries", "Report introductions", "Academic overviews"],
                "instruction": """You are a master synthesizer capable of weaving complex information into a single, powerful paragraph that flows like expert prose while capturing every essential insight.

SYNTHESIS PARAGRAPH MASTERY PROTOCOL:
Create a unified paragraph that functions as a complete, standalone summary. Your paragraph should read like expertly crafted prose that guides the reader through a logical journey from context to conclusions.

ARCHITECTURAL FLOW DESIGN:
🌊 OPENING ANCHOR: Begin with the central theme or most important finding
🌊 DEVELOPMENT CURRENT: Present supporting information in logical sequence
🌊 EVIDENCE STREAM: Weave in specific data, examples, and key insights naturally
🌊 CONCLUSION SYNTHESIS: End with implications, outcomes, or future directions

ADVANCED PARAGRAPH CONSTRUCTION:
- Use sophisticated transitional phrases to create seamless flow: "Furthermore," "Additionally," "Consequently," "This development leads to," "As a result of these findings"
- Vary sentence lengths strategically: short impact sentences mixed with comprehensive explanatory ones
- Build complexity gradually from accessible concepts to more detailed insights
- Create rhythm through balanced clause structures and parallel constructions

COHERENCE MASTERY TECHNIQUES:
- Establish clear topic progression with logical bridges between ideas
- Use pronoun references and echo words to maintain continuity
- Repeat key terms strategically to reinforce central themes
- Employ cause-and-effect sequences to demonstrate relationships
- Balance breadth of coverage with depth of insight

LANGUAGE SOPHISTICATION:
- Use precise, field-appropriate vocabulary that demonstrates expertise
- Employ varied sentence structures: simple, compound, complex combinations
- Include specific data points and evidence naturally within narrative flow
- Maintain consistent voice and perspective throughout
- Create memorable phrases that encapsulate key concepts

INFORMATION INTEGRATION:
- Synthesize related concepts into unified statements rather than listing separately
- Prioritize information by importance while maintaining chronological or logical order
- Include quantitative data smoothly within qualitative descriptions
- Balance detail with accessibility for intended audience
- Ensure every sentence advances the overall understanding

PROFESSIONAL POLISH:
- Write at appropriate sophistication level for academic or business contexts
- Maintain formal yet engaging tone throughout
- Use active voice predominantly for energy and clarity
- Create conclusion that provides clear takeaway or call to action
- Ensure paragraph could serve as standalone summary for busy executives

TARGET LENGTH: 150-250 words of expertly crafted, flowing prose that captures complete understanding.

Create a masterful synthesis paragraph that demonstrates both comprehensive understanding and sophisticated communication.""",
                "temperature": 0.20
            },
            
            SummaryType.OUTLINE: {
                "name": "📊 Strategic Outline",
                "description": "Structure information into a logical hierarchy that reveals relationships and priorities",
                "category": "Information Architecture",
                "use_cases": ["Study guides", "Report frameworks", "Project plans", "Knowledge organization"],
                "instruction": """You are an information architect with expertise in creating logical hierarchies that reveal the underlying structure and relationships within complex information.

STRATEGIC OUTLINE MASTERY PROTOCOL:
Design a hierarchical structure that not only organizes information but reveals insights about relationships, priorities, and logical connections. Your outline should function as both a roadmap and an analytical tool.

HIERARCHICAL INTELLIGENCE FRAMEWORK:
🏗️ LEVEL I (MAJOR THEMES): Broad categorical divisions that capture primary subject areas
🏗️ LEVEL II (KEY CONCEPTS): Central ideas, processes, or findings within each theme
🏗️ LEVEL III (SPECIFIC DETAILS): Supporting evidence, examples, data points, implementation steps

ADVANCED STRUCTURAL DESIGN:
- Use Roman numerals (I, II, III) for major thematic divisions
- Apply capital letters (A, B, C) for primary supporting concepts
- Employ Arabic numerals (1, 2, 3) for specific details and evidence
- Create parallel structure at each hierarchical level
- Ensure logical progression from general to specific

INFORMATION ARCHITECTURE PRINCIPLES:
- Group related concepts under appropriate thematic umbrellas
- Sequence topics in order of importance or logical development
- Balance breadth of coverage with depth of insight at appropriate levels
- Use consistent grammatical structures within each hierarchical level
- Include quantitative data and specific examples at detailed levels

COGNITIVE ORGANIZATION STRATEGIES:
- Start with most important or foundational concepts
- Show cause-and-effect relationships through hierarchical placement
- Group complementary ideas under shared major headings
- Use temporal sequences when chronology matters
- Highlight contrasts and comparisons through parallel structure

OUTLINE OPTIMIZATION TECHNIQUES:
- Create descriptive headings that immediately convey content value
- Use noun phrases or complete sentences consistently within levels
- Include sufficient detail for independent understanding
- Balance conciseness with completeness at each level
- Ensure outline could function as study guide or reference document

PROFESSIONAL FORMATTING STANDARDS:
- Maintain consistent indentation and numbering systems
- Use parallel grammatical structure within each hierarchical level
- Include specific data points and metrics where relevant
- Create logical transitions between major sections
- End sections with implementation steps or action items when appropriate

ANALYTICAL DEPTH:
- Reveal underlying patterns and relationships through organization
- Show how details support broader themes and conclusions
- Include contrasting viewpoints or alternative approaches when relevant
- Demonstrate progression from problems to solutions
- Highlight practical applications and real-world implications

TARGET STRUCTURE: 3-6 major sections with 2-4 sub-points each, creating comprehensive yet manageable reference tool.

Create a strategic outline that reveals both content and structure with professional precision.""",
                "temperature": 0.10
            },
            
            SummaryType.EXECUTIVE: {
                "name": "💼 Executive Intelligence",
                "description": "Business-focused synthesis optimized for C-level decision making and strategic planning",
                "category": "Strategic Leadership",
                "use_cases": ["Board presentations", "Strategic planning", "Investment decisions", "Performance reviews"],
                "instruction": """You are a senior strategic consultant providing executive-level intelligence for C-suite decision makers who need maximum insight in minimum time.

EXECUTIVE INTELLIGENCE PROTOCOL:
Create a summary that enables rapid strategic decision-making by focusing exclusively on business impact, competitive advantage, and actionable outcomes. Write for leaders who measure success in market position and bottom-line results.

C-SUITE DECISION FRAMEWORK:
💰 FINANCIAL IMPACT: Revenue implications, cost structures, ROI potential, budget requirements
📈 STRATEGIC ADVANTAGE: Market positioning, competitive differentiation, growth opportunities
⚡ OPERATIONAL EXCELLENCE: Efficiency gains, process improvements, scalability factors
🎯 RISK MANAGEMENT: Threat assessment, mitigation strategies, compliance considerations
🚀 INNOVATION POTENTIAL: Technology advantages, market disruption opportunities, future positioning

EXECUTIVE COMMUNICATION STANDARDS:
- Lead with bottom-line impact and quantifiable business outcomes
- Include specific financial metrics: revenue impact, cost savings, market share implications
- Focus on strategic implications rather than operational details
- Provide clear risk/reward assessment with confidence levels
- End with specific, actionable recommendations with timelines

BUSINESS INTELLIGENCE INTEGRATION:
- Connect findings to broader market trends and competitive landscape
- Include benchmarking data and industry comparisons when available
- Highlight opportunities for competitive advantage and market leadership
- Address scalability and long-term strategic implications
- Consider stakeholder impact: shareholders, customers, partners, employees

DECISION SUPPORT OPTIMIZATION:
- Structure information to support go/no-go decision making
- Include resource requirements and implementation complexity assessment
- Provide timeline considerations and critical path dependencies
- Address regulatory, legal, and compliance implications
- Include contingency planning and alternative scenario considerations

EXECUTIVE LANGUAGE MASTERY:
- Use confident, authoritative business terminology
- Include industry-specific metrics and KPIs relevant to the sector
- Balance optimism with realistic risk assessment
- Write with urgency appropriate to competitive business environment
- Demonstrate deep understanding of business strategy and market dynamics

STRATEGIC RECOMMENDATION FRAMEWORK:
- Provide 2-3 clear, prioritized action items with business justification
- Include estimated timelines and resource allocation requirements
- Address implementation challenges and success factors
- Consider phase-gate approach for complex initiatives
- Connect recommendations to broader corporate strategy and vision

TARGET OUTCOME: Enable confident, data-driven decision making that advances competitive position and business objectives.

Create executive-level intelligence that drives strategic action and business results.""",
                "temperature": 0.05
            },
            
            SummaryType.ACADEMIC: {
                "name": "🎓 Scholarly Synthesis",
                "description": "Rigorous academic summary following scholarly conventions with theoretical depth",
                "category": "Academic Excellence",
                "use_cases": ["Literature reviews", "Research synthesis", "Academic papers", "Thesis development"],
                "instruction": """You are a distinguished academic researcher creating a scholarly synthesis that meets the highest standards of academic rigor and intellectual depth.

SCHOLARLY SYNTHESIS PROTOCOL:
Produce an academic summary that demonstrates sophisticated understanding of the subject matter while following strict scholarly conventions. Your synthesis should contribute to academic discourse and advance theoretical understanding.

ACADEMIC RIGOR FRAMEWORK:
🎓 THEORETICAL FOUNDATION: Establish conceptual frameworks and theoretical contexts
🎓 METHODOLOGICAL ANALYSIS: Evaluate approaches, methodologies, and analytical techniques
🎓 EMPIRICAL SYNTHESIS: Integrate findings, evidence, and data with appropriate interpretation
🎓 CRITICAL EVALUATION: Assess strengths, limitations, and areas for further investigation
🎓 SCHOLARLY CONTRIBUTION: Identify implications for theory, practice, and future research

ACADEMIC WRITING STANDARDS:
- Employ sophisticated academic vocabulary: "demonstrate," "elucidate," "substantiate," "corroborate"
- Use third-person perspective consistently throughout
- Include appropriate transitional phrases: "Furthermore," "Moreover," "Consequently," "Nevertheless"
- Maintain objective, analytical tone with evidence-based conclusions
- Follow formal academic sentence structure and paragraph organization

INTELLECTUAL DEPTH REQUIREMENTS:
- Situate findings within broader theoretical and conceptual frameworks
- Analyze methodological approaches and their implications for validity
- Evaluate the strength and quality of evidence presented
- Consider alternative interpretations and competing theoretical perspectives
- Address limitations and identify areas requiring further investigation

SCHOLARLY DISCOURSE INTEGRATION:
- Connect findings to established academic literature and theoretical traditions
- Use precise academic terminology appropriate to the field
- Demonstrate understanding of complex theoretical relationships
- Include implications for both theory development and practical application
- Address methodological innovations and their contributions to the field

CRITICAL ANALYSIS STANDARDS:
- Evaluate the validity and reliability of findings and conclusions
- Consider potential biases, limitations, and confounding factors
- Assess the generalizability and transferability of results
- Examine the coherence and internal consistency of arguments
- Identify gaps in knowledge and opportunities for future research

ACADEMIC CONTRIBUTION FRAMEWORK:
- Articulate the significance of findings for theoretical advancement
- Consider implications for policy, practice, and professional development
- Evaluate the methodology's contribution to research approaches in the field
- Address ethical considerations and social implications when relevant
- Suggest specific directions for future research and investigation

TARGET STANDARD: Publication-ready academic prose suitable for peer review and scholarly citation.

Create a distinguished scholarly synthesis that advances academic understanding and demonstrates intellectual rigor.""",
                "temperature": 0.05
            },
            
            SummaryType.SOCIAL: {
                "name": "📱 Viral Synthesis", 
                "description": "Engaging, shareable content optimized for social media virality and audience engagement",
                "category": "Digital Engagement",
                "use_cases": ["Social media campaigns", "Content marketing", "Viral content", "Audience engagement"],
                "instruction": """You are a viral content strategist with expertise in creating irresistibly shareable content that captures attention, drives engagement, and spreads rapidly across social networks.

VIRAL CONTENT MASTERY PROTOCOL:
Transform information into content that people can't help but share. Create psychological hooks that trigger emotional responses and social sharing behaviors while delivering genuine value.

ENGAGEMENT PSYCHOLOGY FRAMEWORK:
🔥 ATTENTION CAPTURE: Open with surprising statistics, controversial insights, or bold statements
🔥 EMOTIONAL RESONANCE: Create content that makes people feel smart, inspired, shocked, or entertained
🔥 SOCIAL CURRENCY: Include insights that make sharers look knowledgeable and well-informed
🔥 PRACTICAL VALUE: Provide actionable takeaways people can immediately apply
🔥 SHAREABILITY FACTOR: Design content that begs to be shared with specific communities

VIRAL TRIGGERS ACTIVATION:
- Start with mind-blowing statistics or counterintuitive findings
- Use power words that create emotional intensity: "revolutionary," "shocking," "game-changing"
- Include specific numbers that create concrete impact: "73% more effective," "saves 2 hours daily"
- Create "aha moments" that shift perspective or reveal hidden truths
- Design quotable phrases perfect for social media sharing

PLATFORM OPTIMIZATION STRATEGIES:
- Twitter: Punchy insights with specific data points in tweetable format
- LinkedIn: Professional insights with career and business relevance
- Facebook: Story-driven content with personal connection and broad appeal
- Instagram: Visual concepts and lifestyle applications with aesthetic appeal
- TikTok: Trend-worthy insights with surprising or educational value

SOCIAL PROOF INTEGRATION:
- Include authority signals: "Harvard study reveals," "Fortune 500 companies use"
- Reference popular culture and current trends for immediate relevance
- Create FOMO (fear of missing out) through exclusive or cutting-edge insights
- Use inclusive language that makes readers feel part of an insider community
- Include success stories and transformation examples

ENGAGEMENT AMPLIFICATION TECHNIQUES:
- End with conversation starters: questions, polls, or debate topics
- Include multiple shareable quotes within the content
- Create content that solves common problems or answers burning questions
- Use formatting that's mobile-optimized and easy to scan
- Include call-to-action that encourages sharing and tagging

AUDIENCE CONNECTION MASTERY:
- Write in conversational, relatable tone that feels like talking to a friend
- Include personal touches and human interest elements
- Use humor, surprise, or inspiration appropriately for the content
- Create emotional journey from curiosity to satisfaction to desire to share
- Balance entertainment value with genuine educational content

VIRAL VELOCITY OPTIMIZATION:
- Create multiple shareable moments throughout the content
- Include contrarian viewpoints that spark healthy debate
- Use specific examples and case studies people can relate to
- Design content that appeals to both experts and general audience
- Include practical tips that provide immediate gratification

TARGET OUTCOME: Content that achieves organic reach amplification through voluntary sharing and engagement.

Create viral-ready content that people actively want to share with their networks.""",
                "temperature": 0.50
            },
            
            SummaryType.TECHNICAL: {
                "name": "⚙️ Technical Mastery",
                "description": "Comprehensive technical documentation preserving all critical specifications and implementation details",
                "category": "Technical Excellence", 
                "use_cases": ["API documentation", "System specifications", "Implementation guides", "Technical reports"],
                "instruction": """You are a senior technical documentation specialist creating comprehensive summaries that preserve every critical detail required for successful implementation and understanding.

TECHNICAL MASTERY PROTOCOL:
Create documentation-grade summaries that technical professionals can rely on for accurate implementation. Preserve all specifications, requirements, and procedural details while organizing information for maximum technical utility.

TECHNICAL PRECISION FRAMEWORK:
⚙️ SPECIFICATION ACCURACY: Exact measurements, tolerances, version numbers, model identifiers
⚙️ PROCEDURAL COMPLETENESS: Step-by-step processes with dependencies and prerequisites
⚙️ SYSTEM INTEGRATION: Interface requirements, compatibility matrices, dependency mapping
⚙️ PERFORMANCE METRICS: Benchmarks, thresholds, optimization parameters, testing criteria
⚙️ TROUBLESHOOTING INTELLIGENCE: Error conditions, diagnostic procedures, resolution protocols

IMPLEMENTATION-READY DOCUMENTATION:
- Include exact version numbers, build specifications, and compatibility requirements
- Preserve all quantitative data: measurements, tolerances, performance specifications
- Maintain technical terminology and industry-standard nomenclature
- Document dependencies, prerequisites, and environmental requirements
- Include configuration parameters and optimization settings

TECHNICAL COMMUNICATION STANDARDS:
- Use precise, unambiguous language throughout
- Include specific tools, software versions, and hardware requirements
- Document both normal operations and exception handling procedures
- Provide performance benchmarks and success criteria
- Include security considerations and compliance requirements

SYSTEM ARCHITECTURE INTEGRATION:
- Document integration points and interface specifications
- Include data flow diagrams and communication protocols conceptually
- Specify API endpoints, data formats, and communication standards
- Address scalability considerations and capacity planning
- Include backup, recovery, and disaster planning elements

OPERATIONAL EXCELLENCE DOCUMENTATION:
- Include monitoring requirements and key performance indicators
- Document maintenance procedures and update protocols
- Specify logging requirements and troubleshooting procedures
- Include testing procedures and validation criteria
- Address security protocols and access control requirements

PROFESSIONAL TECHNICAL STANDARDS:
- Organize information hierarchically from overview to detailed implementation
- Use consistent technical terminology throughout
- Include cross-references to related systems and dependencies
- Provide both theoretical background and practical implementation guidance
- Address common implementation challenges and their solutions

IMPLEMENTATION SUPPORT:
- Include sample configurations and example implementations
- Document common errors and their resolution procedures
- Provide validation steps and testing protocols
- Include performance tuning recommendations
- Address migration and upgrade considerations

TARGET DELIVERABLE: Production-ready technical documentation that enables confident implementation by qualified technical professionals.

Create comprehensive technical documentation that preserves all critical implementation details.""",
                "temperature": 0.02
            },
            
            SummaryType.NARRATIVE: {
                "name": "📖 Story Mastery",
                "description": "Transform information into compelling narrative with dramatic structure and emotional engagement",
                "category": "Narrative Excellence",
                "use_cases": ["Case studies", "Success stories", "Change management", "Stakeholder communication"],
                "instruction": """You are a master storyteller capable of transforming complex information into compelling narratives that engage emotions while delivering complete understanding.

NARRATIVE MASTERY PROTOCOL:
Create stories that capture imagination while conveying every essential piece of information. Use the power of narrative structure to make complex concepts memorable and emotionally resonant.

STORY ARCHITECTURE FRAMEWORK:
📖 COMPELLING OPENING: Establish stakes, characters, and dramatic tension immediately
📖 CHARACTER DEVELOPMENT: Show how people, organizations, or systems evolve through challenges
📖 CONFLICT PROGRESSION: Build tension through obstacles, setbacks, and mounting challenges
📖 TRANSFORMATION JOURNEY: Document the process of change, growth, and resolution
📖 SATISFYING RESOLUTION: Deliver meaningful conclusions with clear outcomes and lessons

DRAMATIC STRUCTURE MASTERY:
- Hook readers immediately with intriguing opening scenario or compelling question
- Introduce key "characters": people, organizations, technologies, or concepts
- Build rising action through challenges, complications, and mounting stakes
- Include turning points where breakthrough insights or solutions emerge
- Create satisfying resolution that shows transformation and provides closure

EMOTIONAL ENGAGEMENT TECHNIQUES:
- Use specific, concrete details that help readers visualize scenes and situations
- Include human interest elements: individual struggles, team dynamics, personal stakes
- Create empathy through relatable challenges and universal experiences
- Build suspense through strategic information revelation and cliffhangers
- Include moments of triumph, discovery, and breakthrough achievement

NARRATIVE FLOW OPTIMIZATION:
- Use chronological progression to build momentum and maintain engagement
- Include dialogue, quotes, or firsthand accounts when available
- Create scene transitions that maintain story momentum while advancing information
- Balance action with reflection, showing both events and their significance
- Use foreshadowing and callback techniques to create narrative coherence

STORYTELLING LANGUAGE MASTERY:
- Use vivid, sensory language that creates mental images
- Employ active voice and dynamic verbs to maintain energy
- Include metaphors and analogies that clarify complex concepts
- Create rhythm through varied sentence lengths and structures
- Use transitional phrases that advance story while connecting ideas

CHARACTER AND SETTING DEVELOPMENT:
- Establish clear protagonists with relatable motivations and challenges
- Create vivid settings that provide context for action and decisions
- Show character growth and transformation throughout the narrative
- Include supporting characters that add depth and perspective
- Demonstrate how environment and circumstances influence outcomes

INFORMATION INTEGRATION MASTERY:
- Weave technical details naturally into story progression
- Use plot developments to reveal key insights and findings
- Include data and statistics as story elements rather than interruptions
- Show cause-and-effect relationships through narrative causation
- Balance entertainment value with complete information transfer

TARGET OUTCOME: Memorable, engaging narrative that entertains while delivering comprehensive understanding.

Transform the information into a compelling story that readers will remember and share.""",
                "temperature": 0.40
            }
        }

    def _calculate_optimal_length(self, original_text: str, summary_length: SummaryLength, summary_type: SummaryType) -> int:
        """Calculate optimal summary length using advanced algorithms"""
        original_words = len(original_text.split())
        
        # Base ratios optimized for different summary types
        type_multipliers = {
            SummaryType.ULTRA_SHORT: 1.0,
            SummaryType.EXTRACTIVE: 1.2,    # Slightly longer for sentence preservation
            SummaryType.BULLET_POINTS: 0.8,  # More concise for bullet format
            SummaryType.OUTLINE: 0.9,       # Structured format allows efficiency
            SummaryType.EXECUTIVE: 1.1,     # Business context needs completeness
            SummaryType.ACADEMIC: 1.3,      # Academic rigor requires detail
            SummaryType.SOCIAL: 0.7,        # Social media needs brevity
            SummaryType.TECHNICAL: 1.4,     # Technical details require preservation
            SummaryType.NARRATIVE: 1.2      # Stories need development space
        }
        
        # Length ratios optimized through testing
        length_ratios = {
            SummaryLength.ULTRA_SHORT: 0.03,  # 3% of original
            SummaryLength.SHORT: 0.12,        # 12% of original  
            SummaryLength.MEDIUM: 0.25,       # 25% of original
            SummaryLength.LONG: 0.45,         # 45% of original
            SummaryLength.DETAILED: 0.65      # 65% of original
        }
        
        base_ratio = length_ratios.get(summary_length, 0.25)
        type_multiplier = type_multipliers.get(summary_type, 1.0)
        
        # Calculate target with bounds
        target_words = max(15, int(original_words * base_ratio * type_multiplier))
        return min(target_words, 600)  # Cap at 600 words for model efficiency

    def _generate_with_best_model(self, text: str, instruction: str, target_length: int, 
                                 summary_type: SummaryType, temperature: float = 0.3) -> str:
        """Generate summary using the best available model with optimized parameters"""
        if not self.model_available:
            return ""
        
        try:
            # Model-specific optimization
            if self.model_info["task"] == "summarization":
                # For BART/Pegasus models optimized for summarization
                result = self.model(
                    text,
                    max_length=min(target_length + 100, 500),
                    min_length=max(target_length - 30, 20),
                    do_sample=True if temperature > 0.1 else False,
                    temperature=temperature,
                    top_p=0.95,
                    top_k=50,
                    repetition_penalty=1.15,
                    length_penalty=1.0,
                    early_stopping=True
                )
                
                if result and len(result) > 0:
                    summary = result[0]['summary_text'].strip()
                    return self._post_process_summary(summary, summary_type)
            
            else:
                # For T5/FLAN models using text2text generation
                enhanced_prompt = self._create_enhanced_prompt(instruction, text, target_length, summary_type)
                
                result = self.model(
                    enhanced_prompt,
                    max_length=min(target_length + 150, 600),
                    temperature=temperature,
                    do_sample=True if temperature > 0.1 else False,
                    top_p=0.92,
                    top_k=40,
                    repetition_penalty=1.1,
                    no_repeat_ngram_size=3
                )
                
                if result and len(result) > 0:
                    generated = result[0]['generated_text'].strip()
                    cleaned = self._clean_model_output(generated)
                    return self._post_process_summary(cleaned, summary_type)
                
        except Exception as e:
            logger.error(f"Model generation error: {e}")
        
        return ""

    def _create_enhanced_prompt(self, instruction: str, text: str, target_length: int, 
                              summary_type: SummaryType) -> str:
        """Create enhanced prompts optimized for different model types"""
        
        # Type-specific enhancements
        type_enhancements = {
            SummaryType.EXTRACTIVE: "Focus on selecting the most important original sentences.",
            SummaryType.ABSTRACTIVE: "Rewrite the key information using new, clearer language.",
            SummaryType.BULLET_POINTS: "Format as clear, scannable bullet points.",
            SummaryType.PARAGRAPH: "Create one flowing, comprehensive paragraph.",
            SummaryType.OUTLINE: "Structure information hierarchically with main points and sub-points.",
            SummaryType.EXECUTIVE: "Write for business executives who need actionable insights.",
            SummaryType.ACADEMIC: "Use scholarly language appropriate for academic contexts.",
            SummaryType.SOCIAL: "Create engaging content optimized for social media sharing.",
            SummaryType.TECHNICAL: "Preserve all technical details and specifications.",
            SummaryType.NARRATIVE: "Transform into compelling story format with clear progression."
        }
        
        enhancement = type_enhancements.get(summary_type, "")
        
        return f"""EXPERT SUMMARIZATION TASK:

{instruction}

SPECIFIC GUIDANCE: {enhancement}

TARGET LENGTH: Approximately {target_length} words

TEXT TO SUMMARIZE:
{text}

EXPERT SUMMARY:"""

    def _post_process_summary(self, summary: str, summary_type: SummaryType) -> str:
        """Apply post-processing optimization based on summary type"""
        
        if summary_type == SummaryType.BULLET_POINTS:
            return self._format_as_bullets(summary)
        elif summary_type == SummaryType.OUTLINE:
            return self._format_as_outline(summary)
        elif summary_type == SummaryType.SOCIAL:
            return self._optimize_for_social(summary)
        elif summary_type == SummaryType.EXECUTIVE:
            return self._optimize_for_executive(summary)
        
        return summary

    def _format_as_bullets(self, text: str) -> str:
        """Convert text to professional bullet point format"""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
        
        bullets = []
        for sentence in sentences[:8]:  # Max 8 bullets
            clean = sentence.strip()
            if clean and not clean.startswith('•'):
                # Ensure bullets start with action words when possible
                bullets.append(f"• {clean}")
        
        return '\n'.join(bullets)

    def _format_as_outline(self, text: str) -> str:
        """Convert text to hierarchical outline format"""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
        
        outline = []
        main_points = 0
        
        for i, sentence in enumerate(sentences[:10]):
            if i % 3 == 0 and main_points < 4:  # Every 3rd sentence as main point
                outline.append(f"{chr(73 + main_points)}. {sentence}")  # I, II, III, IV
                main_points += 1
            else:
                outline.append(f"   A. {sentence}")
        
        return '\n'.join(outline)

    def _optimize_for_social(self, text: str) -> str:
        """Optimize summary for social media engagement"""
        # Add engaging elements
        if not any(word in text.lower() for word in ['surprising', 'shocking', 'amazing', 'incredible']):
            text = f"Here's what's surprising: {text}"
        
        # Ensure it ends with engagement
        if not text.endswith(('?', '!')):
            text += " What do you think?"
        
        return text

    def _optimize_for_executive(self, text: str) -> str:
        """Optimize summary for executive consumption"""
        # Ensure it starts with impact
        impact_starters = ['Key finding:', 'Bottom line:', 'Strategic insight:', 'Critical result:']
        if not any(text.startswith(starter) for starter in impact_starters):
            text = f"Key finding: {text}"
        
        return text

    def _clean_model_output(self, text: str) -> str:
        """Advanced cleaning of model output"""
        # Remove model artifacts
        artifacts = [
            "expert summary:", "summarization task:", "target length:", "approximately",
            "words", "text to summarize:", "guidance:", "specific guidance:",
            "summary:", "output:", "result:", "task:", "here's", "the summary",
            "expert summarization", "task:"
        ]
        
        text_lower = text.lower()
        for artifact in artifacts:
            if artifact in text_lower:
                # Find and remove the artifact
                start_idx = text_lower.find(artifact)
                if start_idx != -1:
                    text = text[start_idx + len(artifact):].strip()
                    text_lower = text.lower()
        
        # Remove quotes if entire text is quoted
        if (text.startswith('"') and text.endswith('"')) or (text.startswith("'") and text.endswith("'")):
            text = text[1:-1].strip()
        
        # Clean up formatting
        text = ' '.join(text.split())
        
        # Ensure proper sentence ending
        if text and not text.endswith(('.', '!', '?', ':')):
            text += '.'
        
        return text

    def _advanced_extractive_fallback(self, text: str, target_sentences: int = 5) -> str:
        """Advanced rule-based extractive summarization with multiple scoring algorithms"""
        
        # Enhanced sentence splitting
        sentences = re.split(r'(?<=[.!?])\s+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 15]
        
        if len(sentences) <= target_sentences:
            return text
        
        # Multi-factor sentence scoring
        sentence_scores = {}
        
        for i, sentence in enumerate(sentences):
            score = 0
            sentence_lower = sentence.lower()
            words = sentence_lower.split()
            
            # 1. Position scoring (refined)
            total_sentences = len(sentences)
            if i == 0:  # First sentence
                score += 3
            elif i == total_sentences - 1:  # Last sentence
                score += 2
            elif i < total_sentences * 0.2:  # First 20%
                score += 1.5
            elif i > total_sentences * 0.8:  # Last 20%
                score += 1
            
            # 2. Length optimization
            word_count = len(words)
            if 12 <= word_count <= 30:  # Optimal length
                score += 2
            elif 8 <= word_count <= 35:  # Acceptable length
                score += 1
            elif word_count > 40:  # Too long penalty
                score -= 1
            
            # 3. Advanced keyword scoring
            for category, keywords in self.advanced_markers.items():
                matches = sum(1 for keyword in keywords if keyword in sentence_lower)
                if category == 'high_importance':
                    score += matches * 2.5
                elif category == 'conclusions':
                    score += matches * 2.0
                elif category == 'emphasis_markers':
                    score += matches * 1.5
                elif category == 'quantitative_data':
                    score += matches * 1.8
                elif category == 'causation_indicators':
                    score += matches * 1.3
                elif category == 'temporal_markers':
                    score += matches * 0.8
            
            # 4. Numerical and factual content
            if re.search(r'\d+\.?\d*%', sentence):  # Percentages
                score += 2
            if re.search(r'\$\d+', sentence):  # Money
                score += 1.5
            if re.search(r'\d{4}', sentence):  # Years
                score += 1
            if re.search(r'\d+', sentence):  # Any numbers
                score += 0.8
            
            # 5. Sentence complexity and information density
            unique_words = len(set(words))
            if unique_words / len(words) > 0.7:  # High vocabulary diversity
                score += 1
            
            # 6. Question and statement balance
            if sentence.endswith('?'):
                score += 0.5  # Questions can be important
            elif sentence.endswith('!'):
                score += 1  # Emphasis
            
            # 7. Capital letters and proper nouns (often indicate important entities)
            capitals = sum(1 for word in words if word and word[0].isupper())
            if capitals > 1:
                score += min(capitals * 0.3, 2)  # Cap the bonus
            
            sentence_scores[i] = score
        
        # Select top sentences with diversity
        sorted_scores = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Ensure diversity by avoiding consecutive sentences
        selected_indices = []
        for idx, score in sorted_scores:
            if len(selected_indices) >= target_sentences:
                break
            
            # Check if this sentence is too close to already selected ones
            too_close = any(abs(idx - selected) <= 1 for selected in selected_indices)
            if not too_close or len(selected_indices) == 0:
                selected_indices.append(idx)
        
        # Fill remaining slots if needed
        while len(selected_indices) < target_sentences and len(selected_indices) < len(sentences):
            for idx, score in sorted_scores:
                if idx not in selected_indices:
                    selected_indices.append(idx)
                    break
        
        # Sort by original order and create summary
        selected_indices.sort()
        selected_sentences = [sentences[i] for i in selected_indices]
        
        return ' '.join(selected_sentences)

    def summarize(self, text: str, summary_type: str = "abstractive", 
                 summary_length: str = "medium") -> Tuple[str, str, str]:
        """Generate advanced summary using best available models and techniques"""
        
        if not text.strip():
            return "Please provide text to summarize.", "❌ No text provided", "No analysis available"
        
        # Validate and convert parameters
        try:
            type_enum = SummaryType(summary_type.lower())
            length_enum = SummaryLength(summary_length.lower()) 
        except ValueError as e:
            available_types = [t.value for t in SummaryType]
            available_lengths = [l.value for l in SummaryLength]
            return (f"❌ Invalid parameter: {str(e)}\nAvailable types: {available_types}\nAvailable lengths: {available_lengths}", 
                   "❌ Invalid parameters", "Check documentation for valid options")
        
        # Get configuration and calculate optimal length
        config = self.summary_configs[type_enum]
        target_length = self._calculate_optimal_length(text, length_enum, type_enum)
        
        try:
            summary_text = ""
            model_used = ""
            
            # Primary: Try best available model
            if self.model_available and type_enum != SummaryType.EXTRACTIVE:
                summary_text = self._generate_with_best_model(
                    text,
                    config["instruction"], 
                    target_length,
                    type_enum,
                    config["temperature"]
                )
                model_used = f"{self.model_info['name']} ({self.model_info['task']})"
            
            # Fallback: Advanced rule-based methods
            if not summary_text or len(summary_text.strip()) < 25:
                if type_enum == SummaryType.EXTRACTIVE:
                    target_sentences = max(3, target_length // 25)
                    summary_text = self._advanced_extractive_fallback(text, target_sentences)
                    model_used = "Advanced extractive algorithm"
                else:
                    # Use extractive then transform
                    target_sentences = max(4, target_length // 25)
                    base_summary = self._advanced_extractive_fallback(text, target_sentences)
                    summary_text = self._post_process_summary(base_summary, type_enum)
                    model_used = "Hybrid extractive + rule-based transformation"
            
            # Quality validation
            if not summary_text or len(summary_text.strip()) < 20:
                return "❌ Summary generation failed", "❌ No summary produced", f"Model attempted: {model_used}"
            
            # Calculate advanced metrics
            original_words = len(text.split())
            summary_words = len(summary_text.split())
            compression_ratio = round((1 - summary_words/original_words) * 100, 1)
            
            # Quality scoring
            quality_indicators = []
            if summary_words >= target_length * 0.8:
                quality_indicators.append("✓ Optimal length")
            if any(char in summary_text for char in '.!?'):
                quality_indicators.append("✓ Proper sentences")
            if summary_words < original_words:
                quality_indicators.append("✓ Compression achieved")
            
            # Advanced status
            status = f"{config['name']} | {model_used} | {original_words}→{summary_words} words ({compression_ratio}% compression) | Quality: {len(quality_indicators)}/3 ✓"
            
            # Comprehensive analysis
            analysis = f"""**ADVANCED SUMMARIZATION ANALYSIS:**

**MODEL PERFORMANCE:**
• Engine: {model_used}
• Processing: {config['name']} mode
• Category: {config['category']}

**METRICS:**
• Original text: {original_words} words
• Generated summary: {summary_words} words  
• Compression ratio: {compression_ratio}% reduction
• Target length: {target_length} words (achieved: {min(100, round(summary_words/target_length*100))}%)
• Length setting: {length_enum.value.replace('_', ' ').title()}

**QUALITY INDICATORS:**
{chr(10).join(['• ' + indicator for indicator in quality_indicators])}

**TECHNICAL DETAILS:**
• Temperature: {config['temperature']} (creativity level)
• Model availability: {'✓ Pretrained model' if self.model_available else '✗ Fallback only'}
• Processing cost: Completely free
• Use cases: {', '.join(config['use_cases'])}"""
            
            return summary_text, status, analysis
            
        except Exception as e:
            logger.error(f"Summarization error: {e}")
            return f"❌ Error: {str(e)}", "❌ Processing failed", "Technical analysis unavailable"

    # Enhanced interface methods
    def get_summary_config(self, summary_type: SummaryType) -> Dict:
        """Get detailed configuration for specific summary type"""
        return self.summary_configs.get(summary_type, self.summary_configs[SummaryType.ABSTRACTIVE])
    
    def get_available_types(self) -> Dict[str, Dict]:
        """Get all available summary types with details"""
        return {
            stype.value: {
                "name": config["name"],
                "description": config["description"], 
                "category": config["category"],
                "use_cases": config["use_cases"]
            }
            for stype, config in self.summary_configs.items()
        }
    
    def get_types_by_category(self) -> Dict[str, List[Dict]]:
        """Group summary types by category"""
        categories = {}
        for stype, config in self.summary_configs.items():
            category = config["category"]
            if category not in categories:
                categories[category] = []
            
            categories[category].append({
                "type": stype.value,
                "name": config["name"],
                "description": config["description"],
                "use_cases": config["use_cases"]
            })
        
        return categories
    
    def get_recommended_type_for_use_case(self, use_case: str) -> List[SummaryType]:
        """Get recommended summary types for specific use case"""
        use_case_lower = use_case.lower()
        recommendations = []
        
        for stype, config in self.summary_configs.items():
            use_cases = [uc.lower() for uc in config["use_cases"]]
            if any(use_case_lower in uc or uc in use_case_lower for uc in use_cases):
                recommendations.append(stype)
        
        return recommendations if recommendations else [SummaryType.ABSTRACTIVE]
    
    def get_model_info(self) -> Dict:
        """Get information about currently loaded model"""
        if self.model_available:
            return {
                "status": "✓ Model loaded successfully",
                "name": self.model_info["name"],
                "task": self.model_info["task"],
                "best_for": self.model_info.get("best_for", ["general"]),
                "size": self.model_info.get("size", "Unknown")
            }
        else:
            return {
                "status": "✗ No model available",
                "fallback": "Advanced rule-based summarization active",
                "recommendation": "Install transformers library for AI model support"
            }
    
    def validate_inputs(self, summary_type: str, summary_length: str) -> Tuple[bool, str]:
        """Validate input parameters"""
        try:
            SummaryType(summary_type.lower())
            SummaryLength(summary_length.lower())
            return True, "✓ Valid parameters"
        except ValueError as e:
            available_types = [t.value for t in SummaryType]
            available_lengths = [l.value for l in SummaryLength]
            return False, f"❌ Invalid: {str(e)}\nTypes: {available_types}\nLengths: {available_lengths}"
    
    def summarize_text(self, text: str, summary_type: str = "abstractive", 
                      length: str = "medium", **kwargs) -> Tuple[str, str, str]:
        """Backward compatible method name"""
        return self.summarize(text, summary_type, length)
    
    def get_summary(self, text: str, mode: str = "abstractive", 
                   length: str = "medium") -> str:
        """Simple interface returning just the summary text"""
        result, _, _ = self.summarize(text, mode, length)
        return result


# Additional aliases for different naming preferences
SummarizerManager = LlamaSummarizer
Summarizer = LlamaSummarizer
EnhancedSummarizer = LlamaSummarizer
TextSummarizer = LlamaSummarizer

# Export all classes for different import patterns
__all__ = [
    'LlamaSummarizer',
    'SummarizerManager', 
    'Summarizer', 
    'EnhancedSummarizer',
    'TextSummarizer',
    'SummaryType', 
    'SummaryLength'
]
