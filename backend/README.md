# AI Text Detector & Humanizer Backend

FastAPI backend service for AI text detection and humanization.

## Quick Setup

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set API Key
Create `.env` file:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 4. Run Server
```bash
python main.py
```

Server runs on: http://localhost:8000

## API Endpoints

- `GET /` - Health check
- `GET /health` - API status  
- `POST /analyze` - Analyze text for AI characteristics
- `POST /humanize` - Humanize AI-generated text

## Features

✅ **5000+ AI Detection Patterns**
✅ **15 Pattern Categories** 
✅ **Real-time Analysis**
✅ **Text Humanization**
✅ **Detailed Reporting**

## Pattern Categories

1. AI Clichés
2. Corporate Buzzwords  
3. Revelation Phrases
4. Escalation Phrases
5. Truth-Telling Phrases
6. Dramatic Fragments
7. Inspirational Endings
8. List Scaffolding
9. AI Hedging Language
10. Generic Conclusions
11. Artificial Enthusiasm
12. Robotic Transitions
13. Repetitive Structures
14. Clickbait Patterns
15. AI Disclaimers