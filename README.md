# Emovix — AI Customer Intelligence Platform

## Overview

Emovix is an AI-powered customer intelligence platform designed to transform raw customer feedback into operational insights, executive intelligence, and actionable business recommendations.

The platform combines:

* Sentiment Analysis
* AI-generated Insights
* Executive Intelligence Dashboards
* AI Copilot Assistance
* Bulk CSV Analytics
* Real-time Operational Monitoring

Unlike basic sentiment analyzers, Emovix focuses on business intelligence workflows and operational decision-making.

---

# Key Features

## AI-Powered Sentiment Analysis

Analyze customer reviews and classify them into:

* Positive
* Negative
* Neutral

Includes:

* Confidence scores
* Department classification
* AI-generated recommendations
* Key phrase extraction
* Urgency analysis

---

## Executive Intelligence Dashboard

Real-time operational intelligence dashboard with:

* Sentiment distribution analytics
* Department heatmaps
* Operational alerts
* AI recommendations
* Risk analysis
* Review trends
* Emerging issue detection

---

## AI Copilot

Interactive AI assistant capable of:

* Identifying complaint patterns
* Highlighting department risks
* Summarizing customer behavior
* Providing operational intelligence
* Answering analytics-based business questions

---

## Bulk CSV Analysis

Upload CSV datasets containing customer feedback.

Features:

* Bulk sentiment processing
* Real-time dashboard updates
* CSV validation
* Error handling
* Department analytics
* Automatic Firestore integration

Supported:

* CSV files up to 5MB
* Multiple review rows
* Real-world dataset handling

---

## Hybrid AI Architecture

Emovix uses a hybrid AI system:

### Local AI (Development)

* Ollama
* Llama 3.1 8B

### Cloud AI (Production)

* Google Gemini API

Includes:

* AI fallback architecture
* Quota handling
* Graceful degradation
* Local-first intelligence generation

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Recharts
* Axios
* Framer Motion

## Backend

* FastAPI
* Python
* Scikit-learn
* NLTK
* spaCy

## Database & Authentication

* Firebase Authentication
* Firestore Database

## AI & ML

* Gemini API
* Ollama
* Llama 3.1
* TF-IDF Vectorization
* Machine Learning Sentiment Classification

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# System Architecture

```text
Frontend (React)
        ↓
FastAPI Backend
        ↓
AI Intelligence Layer
   ↙             ↘
Ollama         Gemini API
(Local)         (Cloud)
        ↓
Firestore Database
        ↓
Dashboard Analytics
```

---

# Project Structure

```text
Emovix/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── main.py
│   └── requirements.txt
│
├── README.md
└── .env
```

---

# Platform Experience

Emovix is designed as an AI-powered operational intelligence platform for analyzing customer feedback at scale.

The platform focuses on transforming unstructured reviews into:

* Executive intelligence
* Operational risk signals
* Department-level analytics
* AI-generated recommendations
* Customer experience insights

Users can:

* Analyze single reviews instantly
* Upload bulk CSV datasets
* Monitor live dashboard intelligence
* Interact with an AI business copilot
* Detect emerging operational issues
* Track sentiment trends in real time

---

# Core Intelligence Modules

## Review Intelligence

Transforms raw customer feedback into structured operational insights.

## Executive Dashboard

Provides real-time sentiment analytics, operational alerts, and department-level monitoring.

## AI Copilot

Allows users to interact conversationally with customer intelligence data.

## Bulk Analytics Engine

Processes large-scale customer review datasets and automatically updates dashboard intelligence.

---

# API Endpoints

## Sentiment Analysis

```http
POST /api/analyze
```

---

## AI Copilot

```http
POST /api/assistant/query
```

---

## Dashboard Intelligence

```http
POST /api/intelligence/dashboard
```

---

# Real-World Use Cases

* Customer Experience Intelligence
* Review Monitoring
* Operational Risk Detection
* Product Feedback Analysis
* Support Department Monitoring
* Delivery Issue Tracking
* Executive Reporting
* Customer Satisfaction Analytics

---

# Future Improvements

* Real-time streaming analytics
* Multi-language support
* PDF intelligence reports
* Team collaboration features
* Advanced trend forecasting
* Vector database integration
* Role-based dashboards
* Enterprise analytics layer

---

# Screenshots

Add screenshots of:

* Dashboard
* Analyze Page
* AI Copilot
* Bulk CSV Upload
* Intelligence Reports

---

# Performance Highlights

* Real-time dashboard updates
* AI fallback handling
* Local-first AI architecture
* Production-ready analytics pipeline
* Graceful AI quota recovery
* Firestore-powered live metrics

---

# Author

Samarth Agarwal

AI Engineer | Data Science & AI-ML Enthusiast

---

# License

This project is licensed for educational and portfolio purposes.

---

# Final Note

Emovix was built to move beyond traditional sentiment analysis systems and evolve into a real operational customer intelligence platform capable of helping organizations monitor customer experience, identify operational risks, and generate AI-driven business insights in real time.
