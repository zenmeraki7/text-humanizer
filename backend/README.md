# AI Text Detector & Humanizer API - Modular Architecture

A comprehensive, modular system for AI text detection, humanization, and plagiarism checking with clean separation of concerns.

## 🏗️ Architecture Overview

The system is now organized into separate, focused modules:

- **`ai_detector.py`** - AI text detection and pattern analysis
- **`humanizer.py`** - Text humanization and AI pattern removal
- **`plagiarism_checker.py`** - Plagiarism detection and removal
- **`main.py`** - FastAPI application that orchestrates all modules
- **`ai_patterns.json`** - External pattern database (5000+ patterns)

## 📁 Project Structure

```
project/
├── main.py                    # Main FastAPI application
├── ai_detector.py            # AI detection module
├── humanizer.py              # Text humanization module  
├── plagiarism_checker.py     # Plagiarism checking module
├── ai_patterns.json          # Pattern database (5000+ patterns)
├── phrasal_patterns.xlsx     # Excel patterns (optional)
├── requirements.txt          # Dependencies
├── .env                      # Environment variables
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables
Create a `.env` file:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Ensure Required Files
- `ai_patterns.json` - Pattern database (provided)
- `phrasal_patterns.xlsx` - Excel patterns (optional)

### 4. Run the Application
```bash
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 📡 API Endpoints

### Core Features
- `POST /analyze` - AI text detection
- `POST /humanize` - Text humanization  
- `POST /check-plagiarism` - Plagiarism detection
- `POST /remove-plagiarism` - Plagiarism removal

### Utility Endpoints
- `GET /` - System status and stats
- `GET /health` - Comprehensive health check
- `GET /patterns/stats` - Pattern statistics
- `GET /humanizer/alternatives/{pattern}` - Get alternatives for pattern
- `POST /plagiarism/similarity` - Detailed similarity analysis

## 🔧 Module Details

### AI Detector (`ai_detector.py`)
**Features:**
- Loads 5000+ patterns from JSON
- Excel pattern integration with severity levels
- Advanced sentence structure analysis
- Comprehensive scoring algorithm

**Key Methods:**
- `detect_ai_patterns(text)` - Find AI patterns in text
- `calculate_ai_score(text)` - Calculate AI probability score
- `get_detection_report(text)` - Generate detailed report

### Humanizer (`humanizer.py`)
**Features:**
- Uses Anthropic Claude for intelligent rewriting
- Pattern-aware humanization
- Excel suggestion integration
- Before/after analysis

**Key Methods:**
- `humanize(text)` - Main humanization function
- `get_available_alternatives(pattern)` - Get pattern alternatives
- `is_available()` - Check if API key is configured

### Plagiarism Checker (`plagiarism_checker.py`)
**Features:**
- Multi-algorithm similarity detection
- Sentence-by-sentence comparison
- N-gram analysis
- Advanced rewriting strategies

**Key Methods:**
- `check_plagiarism_local(text1, text2)` - Calculate similarity
- `get_plagiarism_report(text1, text2)` - Generate report
- `remove_plagiarism(text, mode, reference)` - Rewrite text

## 🎯 Benefits of Modular Architecture

### ✅ Maintainability
- Each module has a single responsibility
- Easy to update individual components
- Clear separation of concerns

### ✅ Scalability
- Add new modules without affecting existing ones
- Independent testing of each component
- Flexible deployment options

### ✅ Reusability
- Modules can be imported independently
- Use AI detector without humanization
- Mix and match functionality as needed

### ✅ Testing
- Unit test each module separately
- Mock dependencies easily
- Focused testing strategies

## 📊 Pattern Management

### JSON Pattern File (`ai_patterns.json`)
- **5000+ patterns** across 15+ categories
- Easy to update without code changes
- Version controlled pattern database
- Organized by pattern type

### Excel Integration (`phrasal_patterns.xlsx`)
- Additional patterns with suggestions
- Severity levels (high/medium/low)  
- Human-friendly editing
- Automatic merging with JSON patterns

## 🔌 Usage Examples

### Using Individual Modules
```python
from ai_detector import AIDetector
from humanizer import TextHumanizer
from plagiarism_checker import PlagiarismChecker

# Initialize modules independently
detector = AIDetector()
score, details = detector.calculate_ai_score("Your text here")

# Use humanizer with detector reference
humanizer = TextHumanizer(api_key, detector)
result, status, analysis = humanizer.humanize("AI text")

# Check plagiarism
checker = PlagiarismChecker()
report, score, status = checker.get_plagiarism_report(text1, text2)
```

### API Usage
```bash
# AI Detection
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here"}'

# Humanization  
curl -X POST "http://localhost:8000/humanize" \
  -H "Content-Type: application/json" \
  -d '{"text": "AI-generated text"}'

# Plagiarism Check
curl -X POST "http://localhost:8000/check-plagiarism" \
  -H "Content-Type: application/json" \
  -d '{"text1": "First text", "text2": "Second text"}'
```

## ⚙️ Configuration Options

### Environment Variables
- `ANTHROPIC_API_KEY` - Required for humanization and plagiarism removal
- `LOG_LEVEL` - Logging level (INFO, DEBUG, WARNING, ERROR)

### Rewrite Modes (Plagiarism Removal)
- `conservative` - Light paraphrasing, maintain structure
- `balanced` - Moderate restructuring with synonyms (default)
- `aggressive` - Complete rewrite with new style

## 🔍 Monitoring & Debugging

### Comprehensive Logging
- Module-specific log prefixes
- Request tracking
- Error details with context
- Performance metrics

### Health Checks
- Individual module status
- Pattern loading verification
- API key validation
- Feature availability

## 🚀 Deployment

### Docker Support
```dockerfile
FROM python:3.11-slim
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Considerations
- Use environment-specific .env files
- Configure proper logging levels
- Set up health check monitoring
- Consider rate limiting for API endpoints

## 🤝 Contributing

1. **Adding New Patterns**: Edit `ai_patterns.json`
2. **New Features**: Create new modules following existing patterns
3. **Bug Fixes**: Target specific modules for focused fixes
4. **Testing**: Test individual modules and integration points

## 📝 License

This project uses a modular architecture for better maintainability and scalability while preserving all original functionality.

---

**Version**: 3.0.0 - Modular Architecture  
**Last Updated**: August 2025
