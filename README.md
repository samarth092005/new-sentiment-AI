# Fuzzo - AI Feedback Intelligence Platform

Fuzzo is a modern, premium AI SaaS platform that transforms raw customer feedback into actionable insights. It uses advanced sentiment analysis and generative AI to understand customer sentiment, generate detailed reports, and provide an interactive dashboard for businesses to make data-driven decisions.

## Features

- **Advanced Sentiment Analysis**: Powered by custom ML models to accurately categorize feedback into Positive, Neutral, or Negative.
- **AI-Powered Insights**: Integrates with Google's Gemini API to generate deep, contextual insights and actionable recommendations from customer feedback.
- **Premium User Interface**: Built with React, Tailwind CSS, and Framer Motion for a stunning, futuristic, and responsive design.
- **Real-Time Dashboard**: Visualize sentiment trends, metrics, and insights through interactive charts using Recharts.
- **PDF Report Generation**: Export detailed analysis reports via PDF using ReportLab.
- **Secure Authentication**: Robust user authentication and secure data storage powered by Firebase.

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charting**: Recharts
- **Routing**: React Router DOM
- **Backend as a Service (BaaS)**: Firebase (Auth & Firestore)

### Backend
- **Framework**: FastAPI
- **Machine Learning**: scikit-learn, NLTK, spaCy
- **LLM Integration**: Google Generative AI (Gemini API)
- **PDF Generation**: ReportLab
- **Authentication Check**: Firebase Admin SDK

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.9 or higher)
- Firebase Account
- Google Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables. Create a `.env` file in the backend directory with:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```
   *(Ensure you also configure Firebase Admin credentials if necessary for your backend environment)*

5. Run the backend server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the frontend directory with your Firebase configuration.
4. Run the frontend development server:
   ```bash
   npm run dev
   ```

## Project Structure
```text
new_sentiment/
├── backend/
│   ├── api/           # FastAPI routes and Pydantic schemas
│   ├── ml/            # Machine learning models (sentiment.py, train.py)
│   ├── services/      # External integrations (gemini.py, pdf_generator.py)
│   ├── main.py        # FastAPI entry point
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/     # React pages (Landing, Login, Dashboard, Analyze, History)
    │   ├── App.jsx    # Application routing
    │   ├── firebase.js# Firebase configuration
    │   └── index.css  # Global Tailwind styles
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## License
MIT License
