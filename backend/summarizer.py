"""
Enhanced Summarizer Module with Pretrained Models
Replaces Ollama with lightweight Hugging Face models and strongest prompts
"""

from enum import Enum
from typing import Dict, List, Optional, Tuple
import logging
import re
import math

logger = logging.getLogger(__name__)

# Try to import transformers, fall back gracefully if not available
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logger.warning("Transformers not available. Using fallback methods only.")

class SummaryMode(Enum):
    """Available summary modes for text summarization"""
    STANDARD = "standard"
    EXECUTIVE = "executive"
    BULLET = "bullet"
    TECHNICAL = "technical"
    CREATIVE = "creative"
    ACADEMIC = "academic"
    EXTRACT = "extract"
    ABSTRACT = "abstract"
    MEETING = "meeting"
    NEWS = "news"

class SummaryLength(Enum):
    """Summary length options"""
    BRIEF = "brief"          # ~25% of original
    MEDIUM = "medium"        # ~40% of original  
    DETAILED = "detailed"    # ~60% of original
    COMPREHENSIVE = "comprehensive"  # ~75% of original

class SummarizerManager:
    """Manages summarization modes using pretrained models with strongest prompts"""
    
    def __init__(self, model_name="facebook/bart-large-cnn"):
        """
        Initialize with lightweight pretrained model
        
        Recommended models for cloud deployment:
        - facebook/bart-large-cnn: 406MB, excellent summarization
        - google/pegasus-xsum: 568MB, abstractive summaries
        - t5-small: 242MB, text-to-text (if memory is tight)
        - sshleifer/distilbart-cnn-12-6: 306MB, distilled BART
        """
        self.model_name = model_name
        self.summary_configs = self._load_summary_configurations()
        self.length_configs = self._load_length_configurations()
        
        # Initialize pretrained model
        self.model_available = False
        self.model = None
        
        if TRANSFORMERS_AVAILABLE:
            self._init_pretrained_model()
        
        # Initialize fallback rules
        self._init_fallback_rules()
        
        logger.info(f"Summarizer Manager initialized - Model available: {self.model_available}")
    
    def _init_pretrained_model(self):
        """Initialize the pretrained summarization model"""
        try:
            logger.info(f"Loading {self.model_name} for summarization...")
            
            self.model = pipeline(
                "summarization",
                model=self.model_name,
                device=-1,  # Force CPU for cloud compatibility
                max_length=1024,
                min_length=30
            )
            
            self.model_available = True
            logger.info(f"Successfully loaded {self.model_name}")
            
        except Exception as e:
            logger.error(f"Failed to load {self.model_name}: {e}")
            self.model_available = False
            # Fallback to text2text if summarization fails
            try:
                self.model = pipeline(
                    "text2text-generation",
                    model="t5-small",
                    device=-1,
                    max_length=512
                )
                self.model_available = True
                self.model_name = "t5-small (fallback)"
                logger.info("Fallback to t5-small successful")
            except Exception as e2:
                logger.error(f"Fallback model also failed: {e2}")
    
    def _init_fallback_rules(self):
        """Initialize rule-based fallback summarization methods"""
        self.fallback_rules = {
            'sentence_scoring': {
                'position_weight': 0.3,    # First/last sentences more important
                'length_weight': 0.2,      # Medium-length sentences preferred
                'keyword_weight': 0.5      # Sentences with key terms
            },
            'key_indicators': [
                'important', 'significant', 'crucial', 'essential', 'key', 'main',
                'primary', 'major', 'critical', 'fundamental', 'central', 'core',
                'summary', 'conclusion', 'result', 'finding', 'outcome', 'impact'
            ],
            'transition_words': [
                'however', 'therefore', 'furthermore', 'moreover', 'additionally',
                'consequently', 'thus', 'hence', 'meanwhile', 'nevertheless'
            ]
        }

    def _load_length_configurations(self) -> Dict[SummaryLength, Dict]:
        """Load length configuration settings"""
        return {
            SummaryLength.BRIEF: {
                "name": "Brief",
                "target_ratio": 0.25,
                "min_sentences": 2,
                "max_sentences": 5,
                "description": "Quick overview with key points only"
            },
            SummaryLength.MEDIUM: {
                "name": "Medium", 
                "target_ratio": 0.40,
                "min_sentences": 3,
                "max_sentences": 8,
                "description": "Balanced summary with main details"
            },
            SummaryLength.DETAILED: {
                "name": "Detailed",
                "target_ratio": 0.60,
                "min_sentences": 5,
                "max_sentences": 12,
                "description": "Comprehensive overview with context"
            },
            SummaryLength.COMPREHENSIVE: {
                "name": "Comprehensive",
                "target_ratio": 0.75,
                "min_sentences": 8,
                "max_sentences": 20,
                "description": "Nearly complete information retained"
            }
        }

    def _load_summary_configurations(self) -> Dict[SummaryMode, Dict]:
        """Load summary configurations with strongest possible prompts"""
        return {
            SummaryMode.STANDARD: {
                "name": "📄 Standard",
                "description": "Clean, neutral summary preserving key information",
                "category": "General",
                "use_cases": ["Default summarization", "General content", "Balanced approach"],
                "instruction": """You are an expert summarizer. Create a clear, comprehensive summary that captures all essential information.

MANDATORY REQUIREMENTS:
- Include every key fact, finding, or conclusion from the original text
- Preserve critical numbers, dates, names, and specific details
- Maintain logical flow and structure of main arguments
- Use clear, direct language without unnecessary words
- Keep the original meaning and context intact

STRUCTURE RULES:
- Start with the most important point or conclusion
- Present information in logical order of importance
- Use complete sentences that stand alone clearly
- Connect related ideas smoothly with natural transitions
- End with significant outcomes or implications

FORBIDDEN ELEMENTS:
- Do not add interpretations or opinions not in original text
- Never skip important facts or conclusions
- Avoid repetition or redundant information
- No filler words or unnecessary elaboration

QUALITY STANDARDS:
- Someone should understand the main content without reading the original
- All stakeholders and key points must be mentioned
- Maintain professional, objective tone throughout
- Ensure factual accuracy in every statement

Create a comprehensive summary with no explanations or meta-commentary.""",
                "temperature": 0.2
            },
            
            SummaryMode.EXECUTIVE: {
                "name": "💼 Executive",
                "description": "High-level summary for business decision makers",
                "category": "Business",
                "use_cases": ["Board reports", "Executive briefings", "Strategic overviews"],
                "instruction": """You are a senior executive assistant preparing a brief for C-level leadership. Create a strategic executive summary focused on business impact.

EXECUTIVE FOCUS AREAS:
- Key business implications and strategic significance
- Financial impact, costs, revenue, or ROI considerations  
- Risk factors and mitigation strategies
- Competitive advantages or market positioning
- Resource requirements and timeline implications
- Decision points requiring leadership attention

STRUCTURE REQUIREMENTS:
- Lead with bottom-line impact and critical decisions needed
- Present strategic context and business rationale
- Highlight opportunities and potential obstacles
- Include quantifiable benefits and measurable outcomes
- End with recommended next steps or actions required

EXECUTIVE LANGUAGE:
- Use business terminology: "strategic initiative," "market opportunity," "competitive advantage"
- Focus on outcomes: "drives revenue growth," "reduces operational costs," "improves efficiency"
- Include metrics: percentages, dollar amounts, timeframes, performance indicators
- Present clear value propositions and business justifications

DECISION-MAKER PRIORITIES:
- What decisions need to be made and by when?
- What resources or approvals are required?
- How does this align with company objectives?
- What are the risks of action vs. inaction?
- How will success be measured?

TONE: Authoritative, strategic, and action-oriented for senior leadership consumption.

Create an executive summary that enables informed decision-making with no explanations.""",
                "temperature": 0.1
            },
            
            SummaryMode.BULLET: {
                "name": "📋 Bullet Points",
                "description": "Organized bullet points for quick scanning",
                "category": "Quick Reference",
                "use_cases": ["Meeting notes", "Action items", "Quick reference"],
                "instruction": """You are an expert in creating scannable, actionable bullet point summaries. Transform this content into perfectly organized bullet points for rapid comprehension.

BULLET POINT STRUCTURE:
- Use consistent, parallel structure for all points
- Start each bullet with strong action verbs or key concepts
- Keep each point to 1-2 lines maximum for easy scanning
- Order points by importance and logical sequence
- Group related bullets under clear subheadings when needed

CONTENT ORGANIZATION:
- **Key Points:** Most important facts or conclusions
- **Action Items:** Specific tasks or next steps required
- **Important Details:** Critical information, numbers, dates
- **Outcomes/Results:** What was achieved or decided
- **Next Steps:** Future actions or follow-up required

BULLET FORMATTING RULES:
- Use strong, specific language that conveys exact meaning
- Include quantifiable details: numbers, percentages, dates, deadlines
- Eliminate connecting words: "and," "but," "however," "therefore"
- Start with action verbs: "Implemented," "Identified," "Approved," "Recommended"
- Use consistent verb tense throughout each section

SCANNABLE REQUIREMENTS:
- Each bullet must be instantly understandable without context
- No bullet should exceed 20 words
- Use bold text for critical terms, names, or deadlines
- Maintain parallel grammar structure across similar bullets
- Include subheadings for different topics or categories

TRANSFORMATION EXAMPLES:
"We discussed the budget and decided to increase marketing spend by 15% starting next quarter" 
→ "• **Budget Decision:** Increase marketing spend by 15% starting Q2"

"The project timeline has some challenges but we think we can still meet the December deadline if we add two more developers"
→ "• **Timeline Risk:** December deadline achievable with 2 additional developers"

Create organized bullet points that enable instant comprehension and action with no explanations.""",
                "temperature": 0.3
            },
            
            SummaryMode.TECHNICAL: {
                "name": "⚙️ Technical",
                "description": "Detailed technical summary with specifications and data",
                "category": "Technical",
                "use_cases": ["Technical documentation", "Research papers", "Engineering reports"],
                "instruction": """You are a senior technical writer creating documentation for engineering teams. Produce a precise technical summary that preserves all critical specifications and methodologies.

TECHNICAL ACCURACY REQUIREMENTS:
- Preserve ALL technical specifications, measurements, and parameters exactly
- Include complete model numbers, version numbers, and technical identifiers
- Maintain precise terminology and industry-standard nomenclature
- Document all methodologies, algorithms, and technical approaches used
- Preserve quantitative results, performance metrics, and statistical data

TECHNICAL STRUCTURE:
- **Technical Overview:** Core technology, system, or methodology described
- **Specifications:** Exact parameters, requirements, and technical details
- **Implementation:** How the technology/method was applied or configured
- **Performance:** Quantitative results, benchmarks, and measurements
- **Technical Challenges:** Issues encountered and solutions implemented
- **Future Considerations:** Scalability, upgrades, or technical evolution

PRECISION REQUIREMENTS:
- Use exact technical language without simplification
- Include units of measurement for all quantitative data
- Preserve acronyms, technical abbreviations, and industry terms
- Document dependencies, prerequisites, and system requirements
- Include version compatibility and technical constraints

TECHNICAL COMMUNICATION STYLE:
- Write for technical audience with domain expertise
- Use precise, unambiguous language throughout
- Include relevant technical context and background
- Reference standards, protocols, or frameworks used
- Document assumptions and technical limitations

CRITICAL ELEMENTS TO PRESERVE:
- API endpoints, database schemas, configuration settings
- Algorithm complexity, performance characteristics
- Security considerations and compliance requirements
- Integration points and technical dependencies
- Error conditions and exception handling approaches

Create a comprehensive technical summary that serves as authoritative technical documentation with no explanations.""",
                "temperature": 0.1
            },
            
            SummaryMode.CREATIVE: {
                "name": "🎨 Creative",
                "description": "Engaging narrative summary with storytelling elements",
                "category": "Creative",
                "use_cases": ["Blog posts", "Marketing content", "Storytelling"],
                "instruction": """You are a master storyteller and content creator. Transform this information into an engaging, memorable narrative summary that captivates readers while preserving all essential information.

STORYTELLING TECHNIQUES:
- Open with a compelling hook that draws readers in immediately
- Create narrative flow with beginning, development, and satisfying conclusion
- Use vivid, descriptive language that paints clear mental pictures
- Include human elements: challenges, breakthroughs, emotions, motivations
- Build tension and resolution around key developments or discoveries

ENGAGING LANGUAGE ARSENAL:
- Power words that create emotional connection and visual imagery
- Metaphors and analogies that make complex concepts instantly relatable
- Sensory details that help readers visualize and experience the content
- Active voice and dynamic verbs that create momentum and energy
- Conversational tone that feels like storytelling, not reporting

NARRATIVE STRUCTURE:
- **The Challenge:** What problem or situation initiated this story?
- **The Journey:** How did events unfold? What obstacles were encountered?
- **The Discovery:** What key insights, solutions, or breakthroughs emerged?
- **The Impact:** How do these developments change the landscape?
- **The Future:** What possibilities or next chapters does this open?

CREATIVE ELEMENTS TO INCLUDE:
- Compelling character arcs (people, companies, or concepts as protagonists)
- Dramatic tension around outcomes, decisions, or revelations
- Unexpected insights or surprising plot twists in the narrative
- Emotional resonance that helps readers connect personally
- Memorable phrases or concepts that stick with readers

ENGAGEMENT TECHNIQUES:
- Use rhetorical questions to involve readers in the thinking process
- Include surprising facts or statistics as narrative tension points
- Create curiosity gaps that propel readers through the summary
- Use pacing variation: short, punchy sentences mixed with flowing descriptions
- End with thought-provoking implications or calls to imagination

TRANSFORMATION EXAMPLES:
"The quarterly results showed 23% growth" → "Against all expectations, this quarter delivered a stunning 23% growth surge that left competitors scrambling to understand the secret formula"

"The new software improves efficiency" → "Like discovering a hidden shortcut through a maze, this breakthrough software transforms hours of tedious work into minutes of streamlined productivity"

Create an engaging narrative summary that makes readers want to learn more, with no explanations.""",
                "temperature": 0.6
            },
            
            SummaryMode.ACADEMIC: {
                "name": "🎓 Academic",
                "description": "Scholarly summary with research methodology and citations",
                "category": "Academic",
                "use_cases": ["Research papers", "Literature reviews", "Academic reports"],
                "instruction": """You are a distinguished academic researcher creating a scholarly summary for peer review. Produce a rigorous academic summary that meets the highest standards of scholarly communication.

ACADEMIC RIGOR REQUIREMENTS:
- Preserve ALL research methodologies, statistical analyses, and empirical findings
- Maintain precise academic terminology and disciplinary language
- Include sample sizes, statistical significance, confidence intervals, and effect sizes
- Document theoretical frameworks, hypotheses, and research questions
- Preserve author conclusions and their evidential support

SCHOLARLY STRUCTURE:
- **Research Context:** Theoretical background and literature positioning
- **Methodology:** Research design, data collection, and analytical approaches
- **Key Findings:** Primary results with statistical support and significance
- **Theoretical Implications:** How findings contribute to existing knowledge
- **Limitations:** Study constraints and methodological considerations
- **Future Research:** Directions for continued investigation

ACADEMIC LANGUAGE STANDARDS:
- Use precise scholarly vocabulary and disciplinary conventions
- Employ objective, third-person perspective throughout
- Include appropriate qualifiers: "suggests," "indicates," "demonstrates"
- Use formal academic transition phrases and logical connectors
- Maintain measured, evidence-based tone without overstatement

EVIDENTIAL STANDARDS:
- Distinguish clearly between correlation and causation
- Acknowledge uncertainty and alternative interpretations where present
- Include effect sizes and practical significance alongside statistical significance
- Document methodological strengths and limitations honestly
- Preserve nuanced conclusions and conditional statements

SCHOLARLY COMMUNICATION ELEMENTS:
- Present findings within broader theoretical and empirical context
- Use appropriate academic hedging: "appears to," "may suggest," "provides evidence for"
- Include implications for theory, practice, and policy where relevant
- Document gaps in knowledge that this research addresses or reveals
- Connect findings to established literature and theoretical frameworks

TRANSFORMATION EXAMPLES:
"The results were good" → "The findings demonstrate statistically significant improvements (p < .05, d = 0.73) with medium to large effect sizes"
"This shows that..." → "These data provide empirical support for the hypothesis that..."
"Many people think..." → "Substantial body of research suggests..."

Create a scholarly summary that meets standards for academic publication with no explanations.""",
                "temperature": 0.1
            },
            
            SummaryMode.EXTRACT: {
                "name": "🔍 Key Extracts",
                "description": "Direct quotes and extracted key phrases from original text",
                "category": "Reference",
                "use_cases": ["Research notes", "Quote collection", "Key phrase extraction"],
                "instruction": """You are an expert information extraction specialist. Identify and extract the most important direct quotes, key phrases, and essential statements from the original text.

EXTRACTION PRIORITIES:
- Direct quotes that contain the most important conclusions or findings
- Key phrases that capture essential concepts or terminology
- Specific data points, statistics, and quantifiable information
- Author's main arguments and primary thesis statements
- Critical definitions and explanatory statements

EXTRACTION CRITERIA:
- **High-Impact Quotes:** Statements that contain the core message or breakthrough insights
- **Data Quotes:** Specific numbers, percentages, measurements, and statistical findings
- **Definition Quotes:** Clear explanations of important concepts or terminology
- **Conclusion Quotes:** Author's main findings, recommendations, or final thoughts
- **Supporting Evidence:** Key facts or research that supports main arguments

FORMATTING REQUIREMENTS:
- Use exact quotation marks around all extracted text
- Maintain original punctuation and capitalization precisely
- Include context tags: [CONCLUSION], [DATA], [DEFINITION], [KEY INSIGHT]
- Organize extracts by importance and thematic relevance
- Preserve author's exact words without any modification

SELECTION STANDARDS:
- Choose quotes that could stand alone and still convey important meaning
- Prioritize statements that someone would want to reference or cite
- Include the most memorable and impactful phrasing from the original
- Select diverse quotes that cover different aspects of the content
- Focus on quotes that contain actionable insights or specific information

ORGANIZATION STRUCTURE:
- **Core Message:** Most important overarching conclusions
- **Key Data:** Statistical findings and quantifiable information  
- **Important Insights:** Breakthrough discoveries or significant observations
- **Definitions:** Critical terminology and concept explanations
- **Supporting Facts:** Essential background information and evidence

EXTRACTION EXAMPLES:
Instead of paraphrasing "The research showed positive results," extract: 
"[DATA] 'The intervention resulted in a 34% improvement in outcomes compared to the control group (p < 0.001)'"

Instead of summarizing "The author concluded," extract:
"[CONCLUSION] 'These findings fundamentally challenge our understanding of how these systems operate in real-world environments'"

Extract the most valuable and quotable content in exact original form with clear categorization and no explanations.""",
                "temperature": 0.1
            },
            
            SummaryMode.ABSTRACT: {
                "name": "📖 Abstract",
                "description": "Research paper style abstract with structured format",
                "category": "Academic",
                "use_cases": ["Research abstracts", "Paper summaries", "Academic overviews"],
                "instruction": """You are an expert academic writer creating a publication-quality abstract. Produce a structured abstract that meets journal publication standards for scholarly communication.

ABSTRACT STRUCTURE (include all sections):
- **Background/Context:** Research gap or problem that motivated this work
- **Objective/Purpose:** Specific aims, research questions, or hypotheses addressed
- **Methods:** Research design, participants/subjects, data collection and analysis approaches
- **Results:** Key quantitative and qualitative findings with specific data
- **Conclusions:** Primary implications and significance of findings
- **Keywords:** 5-7 key terms that capture the essential concepts

ACADEMIC ABSTRACT REQUIREMENTS:
- Begin with clear statement of research problem or knowledge gap
- State specific objectives using precise academic language
- Describe methodology concisely but with sufficient detail for understanding
- Present results with specific numbers, effect sizes, and statistical significance
- Conclude with broader implications for theory, practice, or policy
- Use 150-300 words total (journal standard length)

SCHOLARLY LANGUAGE STANDARDS:
- Use disciplinary terminology and established academic conventions
- Employ precise quantitative descriptors and statistical language
- Include appropriate academic hedging: "suggests," "indicates," "appears to"
- Use objective, third-person perspective throughout
- Avoid speculation beyond what data supports

ESSENTIAL ELEMENTS TO INCLUDE:
- Sample characteristics and size (N = X)
- Statistical significance levels and effect sizes where applicable
- Primary outcome measures and assessment tools used
- Theoretical framework or conceptual model employed
- Practical or theoretical significance of findings
- Study limitations and scope clearly defined

ABSTRACT FORMATTING:
- **Background:** 1-2 sentences establishing research context and rationale
- **Objective:** 1 sentence stating specific aims or hypotheses
- **Methods:** 2-3 sentences describing design, participants, and procedures
- **Results:** 2-4 sentences presenting key findings with data
- **Conclusions:** 1-2 sentences stating implications and significance
- **Keywords:** List 5-7 terms for indexing and searchability

TRANSFORMATION EXAMPLES:
"We studied this topic" → "This randomized controlled trial (N = 247) examined the effectiveness of..."
"Good results were found" → "Intervention participants demonstrated significantly greater improvements (M = 4.2, SD = 1.1) compared to controls (M = 2.8, SD = 1.3), t(245) = 8.7, p < .001, d = 1.1"

Create a publication-ready abstract that meets strict journal standards with no explanations.""",
                "temperature": 0.1
            },
            
            SummaryMode.MEETING: {
                "name": "🤝 Meeting Notes",
                "description": "Structured meeting summary with decisions and action items",
                "category": "Business",
                "use_cases": ["Meeting minutes", "Team discussions", "Decision tracking"],
                "instruction": """You are an expert meeting facilitator and note-taker. Create comprehensive meeting notes that capture all essential information for follow-up and accountability.

MEETING SUMMARY STRUCTURE:
- **Meeting Overview:** Purpose, attendees, date/time, and main objectives
- **Key Discussions:** Major topics covered with brief context and viewpoints
- **Decisions Made:** Specific choices, approvals, or agreements reached
- **Action Items:** Tasks assigned with owners and deadlines clearly specified
- **Next Steps:** Follow-up meetings, checkpoints, and future activities
- **Outstanding Issues:** Unresolved questions or topics requiring further attention

ACTION ITEM REQUIREMENTS:
- Assign specific owner/responsible party to each action
- Include clear deadlines or target completion dates
- Use specific, measurable language for task descriptions
- Note any dependencies or prerequisites for completion
- Include success criteria or expected outcomes where relevant

DECISION DOCUMENTATION:
- Record exact decisions with clear rationale when provided
- Note any dissenting opinions or alternative approaches considered
- Include budget approvals, resource allocations, or priority decisions
- Document policy changes, process updates, or strategic choices
- Capture risk assessments and mitigation strategies discussed

ATTENDEE AND STAKEHOLDER INFORMATION:
- List all participants with roles/titles for context
- Note key contributors to specific discussions or decisions
- Document any proxy representation or absent stakeholder input
- Include external stakeholders mentioned or affected by decisions
- Record any expertise or perspectives brought to discussions

ACCOUNTABILITY ELEMENTS:
- Use names, not pronouns, for clear responsibility assignment
- Include specific metrics or deliverables for tracking progress
- Note reporting relationships and escalation paths
- Document review cycles and progress check-in schedules
- Include contact information or resources needed for action completion

FORMATTING FOR CLARITY:
- Use consistent bullet points and numbering for easy reference
- Bold important names, dates, and critical information
- Group related action items under topic headings
- Include priority levels: High, Medium, Low for action items
- Use tables or structured lists for complex information tracking

TRANSFORMATION EXAMPLES:
"John will handle the budget stuff soon" → "**ACTION:** John Smith will prepare Q2 budget analysis including cost projections and resource requirements. **DEADLINE:** March 15, 2024. **DELIVERABLE:** Budget presentation for leadership team."

"We talked about marketing and decided to do more" → "**DECISION:** Approved 25% increase in digital marketing budget ($50K additional) for Q2 campaign focused on lead generation. **RATIONALE:** Current conversion rates exceed projections by 40%."

Create comprehensive meeting notes that ensure accountability and clear follow-through with no explanations.""",
                "temperature": 0.2
            },
            
            SummaryMode.NEWS: {
                "name": "📰 News Summary", 
                "description": "Journalistic summary with who, what, when, where, why format",
                "category": "Journalism",
                "use_cases": ["News articles", "Press releases", "Current events"],
                "instruction": """You are a senior news editor creating a comprehensive news summary. Apply journalistic standards to present information clearly and objectively for public consumption.

JOURNALISTIC STRUCTURE (5 W's + H):
- **WHO:** Key people, organizations, or entities involved with roles and relevance
- **WHAT:** Specific events, actions, or developments that occurred  
- **WHEN:** Precise timing, dates, and chronological sequence of events
- **WHERE:** Geographic locations, venues, or contexts where events took place
- **WHY:** Motivations, causes, or background factors that explain the situation
- **HOW:** Methods, processes, or mechanisms by which events unfolded

NEWS SUMMARY REQUIREMENTS:
- Lead with the most newsworthy and impactful information first
- Use inverted pyramid structure: most important facts at the top
- Maintain objective, unbiased tone throughout the summary
- Include relevant background context for reader understanding
- Present multiple perspectives when different viewpoints exist
- Use clear, accessible language appropriate for general public

JOURNALISTIC STANDARDS:
- Attribute all claims and quotes to specific sources
- Distinguish between facts and opinions or speculation
- Include relevant stakeholder reactions and implications
- Provide necessary context for understanding significance
- Avoid editorial commentary or personal interpretation
- Use precise, factual language without sensationalism

ESSENTIAL NEWS ELEMENTS:
- **Breaking Development:** The immediate news or change that occurred
- **Key Players:** Primary individuals, organizations, or institutions involved
- **Timeline:** When events happened and sequence of developments
- **Impact Analysis:** Who is affected and how significantly
- **Reactions:** Responses from stakeholders, officials, or affected parties
- **Future Implications:** What this means going forward

PUBLIC INTEREST FOCUS:
- Explain why this information matters to readers
- Include economic, social, or political implications
- Highlight any policy changes or regulatory impacts
- Note effects on specific communities or demographics
- Address public safety, financial, or legal considerations
- Connect to broader trends or ongoing stories

TRANSFORMATION EXAMPLES:
"There was a meeting about budget issues" → "City Council voted 7-2 Tuesday to approve a $2.3 million emergency budget allocation to address infrastructure repairs following last month's severe storm damage affecting downtown business district."

"The company announced changes" → "TechCorp CEO Sarah Johnson announced Wednesday that the company will eliminate 150 positions across three departments while simultaneously hiring 200 new engineers, representing a strategic shift toward artificial intelligence development."

Create a comprehensive news summary that informs the public with journalistic integrity and no explanations.""",
                "temperature": 0.2
            }
        }

    def _calculate_target_length(self, original_length: int, length_mode: SummaryLength) -> Tuple[int, int]:
        """Calculate target word count range based on length mode"""
        config = self.length_configs[length_mode]
        target_words = int(original_length * config["target_ratio"])
        
        # Ensure minimum/maximum bounds
        min_words = max(target_words - 50, config["min_sentences"] * 8)  # ~8 words per sentence
        max_words = min(target_words + 100, config["max_sentences"] * 20)  # ~20 words per sentence
        
        return min_words, max_words

    def _generate_with_model(self, text: str, instruction: str, length_mode: SummaryLength, temperature: float = 0.3) -> str:
        """Generate summary using pretrained model"""
        if not self.model_available:
            return ""
        
        try:
            original_words = len(text.split())
            min_length, max_length = self._calculate_target_length(original_words, length_mode)
            
            # For BART/Pegasus summarization models
            if hasattr(self.model, 'task') and self.model.task == 'summarization':
                result = self.model(
                    text,
                    max_length=max_length,
                    min_length=min_length,
                    do_sample=True if temperature > 0.1 else False,
                    temperature=temperature,
                    top_p=0.9
                )
                
                if result and len(result) > 0:
                    return result[0]['summary_text'].strip()
            
            # For T5 text2text models
            else:
                prompt = f"Summarize this text following these instructions: {instruction}\n\nText to summarize: {text}\n\nSummary:"
                
                result = self.model(
                    prompt,
                    max_length=max_length,
                    min_length=min_length,
                    do_sample=True if temperature > 0.1 else False,
                    temperature=temperature,
                    top_p=0.9
                )
                
                if result and len(result) > 0:
                    return self._clean_model_output(result[0]['generated_text'])
                
        except Exception as e:
            logger.error(f"Model generation error: {e}")
        
        return ""
    
    def _clean_model_output(self, text: str) -> str:
        """Clean and optimize model output"""
        # Remove common prefixes that models add
        prefixes = [
            "summary:", "text:", "output:", "result:", "summarized text:",
            "here's the summary:", "the summary is:", "summarization:",
            "summary text:", "condensed version:", "brief summary:"
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

    def _apply_extractive_summarization(self, text: str, length_mode: SummaryLength) -> str:
        """Apply rule-based extractive summarization as fallback"""
        sentences = self._split_into_sentences(text)
        if len(sentences) <= 3:
            return text  # Too short to summarize
        
        # Score sentences
        scored_sentences = []
        for i, sentence in enumerate(sentences):
            score = self._score_sentence(sentence, i, len(sentences), text)
            scored_sentences.append((score, sentence, i))
        
        # Sort by score and select top sentences
        scored_sentences.sort(reverse=True)
        
        # Determine how many sentences to include
        config = self.length_configs[length_mode]
        target_sentences = min(
            max(config["min_sentences"], len(sentences) // 4),
            config["max_sentences"]
        )
        
        # Select top sentences and sort by original order
        selected = scored_sentences[:target_sentences]
        selected.sort(key=lambda x: x[2])  # Sort by original position
        
        return ' '.join([sentence for _, sentence, _ in selected])

    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences using basic rules"""
        # Simple sentence splitting - can be enhanced with NLTK if available
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        return sentences

    def _score_sentence(self, sentence: str, position: int, total_sentences: int, full_text: str) -> float:
        """Score sentence importance using multiple factors"""
        score = 0.0
        rules = self.fallback_rules['sentence_scoring']
        
        # Position score (first and last sentences are important)
        if position == 0 or position == total_sentences - 1:
            score += rules['position_weight'] * 1.0
        elif position < total_sentences * 0.3:  # First third
            score += rules['position_weight'] * 0.7
        
        # Length score (prefer medium-length sentences)
        words = len(sentence.split())
        if 10 <= words <= 25:
            score += rules['length_weight'] * 1.0
        elif 7 <= words <= 30:
            score += rules['length_weight'] * 0.7
        
        # Keyword score
        sentence_lower = sentence.lower()
        keyword_count = sum(1 for keyword in self.fallback_rules['key_indicators'] 
                          if keyword in sentence_lower)
        score += rules['keyword_weight'] * (keyword_count / len(self.fallback_rules['key_indicators']))
        
        # Transition word bonus
        transition_count = sum(1 for word in self.fallback_rules['transition_words']
                             if word in sentence_lower)
        score += 0.1 * transition_count
        
        return score

    def summarize_text(self, text: str, summary_mode: str, length_mode: str = "medium") -> Tuple[str, str, str]:
        """Summarize text using pretrained models with strongest prompts or fallback methods"""
        
        if not text.strip():
            return "Please provide text to summarize.", "❌ No text provided", "No analysis available"
        
        # Validate modes
        summary_enum = self.validate_summary_mode(summary_mode)
        length_enum = self.validate_length_mode(length_mode)
        
        if not summary_enum:
            return f"❌ Invalid summary mode: {summary_mode}", "❌ Invalid mode", f"Available: {list(self.get_available_modes().keys())}"
        
        if not length_enum:
            return f"❌ Invalid length mode: {length_mode}", "❌ Invalid length", f"Available: {list(self.get_available_lengths().keys())}"
        
        # Get configurations
        summary_config = self.get_summary_config(summary_enum)
        length_config = self.length_configs[length_enum]
        
        try:
            summarized_text = ""
            
            # Try pretrained model first
            if self.model_available:
                summarized_text = self._generate_with_model(
                    text, 
                    summary_config["instruction"], 
                    length_enum,
                    summary_config["temperature"]
                )
                model_used = f"Pretrained ({self.model_name})"
            
            # Fallback to rule-based if model fails or unavailable
            if not summarized_text or len(summarized_text.strip()) < 20:
                summarized_text = self._apply_extractive_summarization(text, length_enum)
                model_used = "Extractive fallback"
            
            # Final validation
            if not summarized_text or summarized_text.strip() == text.strip():
                return "❌ Summarization failed", "❌ No summary generated", f"Model: {model_used}"
            
            # Calculate statistics
            original_words = len(text.split())
            summary_words = len(summarized_text.split())
            compression_ratio = (1 - summary_words / original_words) * 100 if original_words > 0 else 0
            
            # Generate status
            status = f"{summary_config['name']} | {length_config['name']} | {original_words} → {summary_words} words ({compression_ratio:.1f}% reduction) | {model_used} | Free"
            
            # Generate analysis
            analysis = f"**SUMMARIZATION ANALYSIS:**\n\n"
            analysis += f"**MODEL:** {model_used}\n"
            analysis += f"**ORIGINAL:** {original_words} words\n"
            analysis += f"**SUMMARY:** {summary_words} words\n"
            analysis += f"**COMPRESSION:** {compression_ratio:.1f}% reduction\n"
            analysis += f"**MODE:** {summary_config['name']} | **CATEGORY:** {summary_config['category']}\n"
            analysis += f"**LENGTH:** {length_config['name']} | **TARGET:** {length_config['description']}\n"
            analysis += f"**COST:** Completely free"
            
            return summarized_text, status, analysis
            
        except Exception as e:
            logger.error(f"Summarization error: {e}")
            return f"Error: {str(e)}", "❌ Processing failed", "Analysis unavailable"

    # Interface methods
    def get_summary_config(self, summary_mode: SummaryMode) -> Dict:
        return self.summary_configs.get(summary_mode, self.summary_configs[SummaryMode.STANDARD])
    
    def get_length_config(self, length_mode: SummaryLength) -> Dict:
        return self.length_configs.get(length_mode, self.length_configs[SummaryLength.MEDIUM])
    
    def get_available_modes(self) -> Dict[str, Dict]:
        return {
            mode.value: {
                "name": config["name"],
                "description": config["description"],
                "category": config["category"],
                "use_cases": config["use_cases"]
            }
            for mode, config in self.summary_configs.items()
        }
    
    def get_available_lengths(self) -> Dict[str, Dict]:
        return {
            length.value: {
                "name": config["name"],
                "description": config["description"],
                "target_ratio": config["target_ratio"]
            }
            for length, config in self.length_configs.items()
        }
    
    def get_modes_by_category(self) -> Dict[str, List[Dict]]:
        categories = {}
        for mode, config in self.summary_configs.items():
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
    
    def validate_summary_mode(self, summary_mode_str: str) -> Optional[SummaryMode]:
        try:
            return SummaryMode(summary_mode_str.lower())
        except ValueError:
            logger.warning(f"Invalid summary mode: {summary_mode_str}")
            return None
    
    def validate_length_mode(self, length_mode_str: str) -> Optional[SummaryLength]:
        try:
            return SummaryLength(length_mode_str.lower())
        except ValueError:
            logger.warning(f"Invalid length mode: {length_mode_str}")
            return None
    
    def get_recommended_modes_for_use_case(self, use_case: str) -> List[SummaryMode]:
        use_case_lower = use_case.lower()
        recommendations = []
        
        for mode, config in self.summary_configs.items():
            use_cases = [uc.lower() for uc in config["use_cases"]]
            if any(use_case_lower in uc or uc in use_case_lower for uc in use_cases):
                recommendations.append(mode)
        
        return recommendations if recommendations else [SummaryMode.STANDARD]

    def batch_summarize(self, texts: List[str], summary_mode: str, length_mode: str = "medium") -> List[Tuple[str, str, str]]:
        """Summarize multiple texts in batch"""
        results = []
        for text in texts:
            result = self.summarize_text(text, summary_mode, length_mode)
            results.append(result)
        return results

    def get_summary_statistics(self, original_text: str, summary_text: str) -> Dict[str, float]:
        """Calculate detailed summarization statistics"""
        original_words = len(original_text.split())
        original_chars = len(original_text)
        original_sentences = len(self._split_into_sentences(original_text))
        
        summary_words = len(summary_text.split())
        summary_chars = len(summary_text)
        summary_sentences = len(self._split_into_sentences(summary_text))
        
        return {
            "compression_ratio": (1 - summary_words / original_words) * 100 if original_words > 0 else 0,
            "word_reduction": original_words - summary_words,
            "char_reduction": original_chars - summary_chars,
            "sentence_reduction": original_sentences - summary_sentences,
            "words_per_sentence_original": original_words / original_sentences if original_sentences > 0 else 0,
            "words_per_sentence_summary": summary_words / summary_sentences if summary_sentences > 0 else 0
        }

    def suggest_optimal_length(self, text: str, target_use_case: str = "") -> SummaryLength:
        """Suggest optimal summary length based on text characteristics and use case"""
        word_count = len(text.split())
        
        # Use case specific recommendations
        if "executive" in target_use_case.lower() or "brief" in target_use_case.lower():
            return SummaryLength.BRIEF
        elif "detailed" in target_use_case.lower() or "comprehensive" in target_use_case.lower():
            return SummaryLength.DETAILED
        elif "meeting" in target_use_case.lower() or "notes" in target_use_case.lower():
            return SummaryLength.MEDIUM
        
        # Length-based recommendations
        if word_count < 200:
            return SummaryLength.BRIEF
        elif word_count < 800:
            return SummaryLength.MEDIUM
        elif word_count < 2000:
            return SummaryLength.DETAILED
        else:
            return SummaryLength.COMPREHENSIVE

# Example usage and testing
if __name__ == "__main__":
    # Initialize summarizer
    summarizer = SummarizerManager()
    
    # Example text for testing
    sample_text = """
    Artificial intelligence (AI) has emerged as one of the most transformative technologies of the 21st century, 
    fundamentally reshaping industries, research methodologies, and everyday human experiences. The rapid advancement 
    in machine learning algorithms, particularly deep learning neural networks, has enabled unprecedented capabilities 
    in pattern recognition, natural language processing, and autonomous decision-making systems.
    
    Recent breakthroughs in large language models have demonstrated remarkable proficiency in understanding and 
    generating human-like text, leading to applications ranging from automated customer service to creative writing 
    assistance. These developments have sparked both excitement about potential benefits and concerns about ethical 
    implications, job displacement, and the need for responsible AI governance frameworks.
    
    The economic impact of AI adoption continues to accelerate, with McKinsey Global Institute estimating that AI 
    could contribute up to $13 trillion to global economic output by 2030. This growth is driven by productivity 
    improvements across sectors including healthcare, finance, manufacturing, and transportation, where AI systems 
    are optimizing operations, reducing costs, and enabling new service capabilities.
    
    However, successful AI implementation requires careful consideration of data privacy, algorithmic bias, and 
    the importance of maintaining human oversight in critical decision-making processes. Organizations must balance 
    innovation with responsibility to ensure that AI technologies serve broad societal interests while minimizing 
    potential risks and negative consequences.
    """
    
    # Test different summary modes
    modes_to_test = ["standard", "executive", "bullet", "technical"]
    
    print("=== SUMMARIZER TESTING ===\n")
    
    for mode in modes_to_test:
        print(f"--- {mode.upper()} MODE ---")
        summary, status, analysis = summarizer.summarize_text(sample_text, mode, "medium")
        print(f"Status: {status}")
        print(f"Summary: {summary}")
        print(f"Analysis: {analysis}")
        print("\n" + "="*50 + "\n")
