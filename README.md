```md
# AI Text Detector & Humanizer – Full Stack App

A full-stack application for **AI text detection, humanization, and plagiarism management**, built with a **modular FastAPI backend** and a **React + Vite frontend**.

---

## Tech Stack

### Backend
- Python
- FastAPI
- Anthropic Claude API
- Modular architecture
- JSON & Excel-based pattern system

### Frontend
- React 18
- Vite
- ESLint
- Fast Refresh (HMR)

---

## Project Structure

```

project/
├── backend/
│   ├── main.py
│   ├── ai_detector.py
│   ├── humanizer.py
│   ├── plagiarism_checker.py
│   ├── ai_patterns.json
│   ├── phrasal_patterns.xlsx
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md

````

---

## Backend Overview

### Modules
- **ai_detector.py** – AI pattern detection & scoring
- **humanizer.py** – AI text humanization
- **plagiarism_checker.py** – Plagiarism detection & removal
- **main.py** – FastAPI entry point

### Features
- 5000+ AI detection patterns
- Pattern severity scoring
- Claude-powered rewriting
- Multi-algorithm plagiarism detection
- Conservative / Balanced / Aggressive rewrite modes

---

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
````

### Environment Variables

Create a `.env` file:

```env
ANTHROPIC_API_KEY=your_api_key_here
LOG_LEVEL=INFO
```

### Run Backend

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at:

```
http://localhost:8000
```

---

## API Endpoints

### Core

* `POST /analyze` – AI text detection
* `POST /humanize` – Humanize text
* `POST /check-plagiarism` – Plagiarism check
* `POST /remove-plagiarism` – Remove plagiarism

### Utility

* `GET /health`
* `GET /patterns/stats`
* `GET /humanizer/alternatives/{pattern}`
* `POST /plagiarism/similarity`

---

## Frontend Overview

### Features

* React + Vite setup
* Fast Refresh (HMR)
* API-driven architecture
* ESLint configured

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## Frontend → Backend Example

```js
fetch("http://localhost:8000/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text })
});
```

---

## Docker (Backend)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Notes

* Backend and frontend are fully decoupled
* Each backend module can be used independently
* Patterns can be updated without code changes
* Ready for production scaling

---

## Version

**v3.0.0 – Modular Architecture**
Last Updated: August 2025

```
