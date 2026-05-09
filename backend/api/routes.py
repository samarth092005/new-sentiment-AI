from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from api.schemas import AnalyzeRequest, AnalyzeResponse, HistoryItem, HistoryResponse, ReportRequest, BulkAnalyzeRequest, BulkAnalyzeResponse, BulkAnalyzeItem
from ml.sentiment import analyzer
from services.gemini import generate_insights
from services.pdf_generator import generate_report
from utils.classifier import classify_department
from datetime import datetime
import os
from collections import Counter

router = APIRouter()

# Note: In a real production app, you would add Firebase Auth middleware here
# to verify the user's token. For the MVP, we will keep endpoints open or mock the user.

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_review(request: AnalyzeRequest):
    # 1. Get sentiment prediction
    prediction = analyzer.predict(request.review)
    sentiment = prediction["sentiment"]
    confidence = prediction["confidence"]
    
    # 2. Get Gemini insights
    insights = generate_insights(request.review, sentiment)
    
    # 3. Get Department classification
    department = classify_department(request.review)
    
    return AnalyzeResponse(
        sentiment=sentiment,
        confidence=confidence,
        department=department,
        insights=insights
    )

@router.post("/analyze/bulk", response_model=BulkAnalyzeResponse)
async def bulk_analyze_reviews(request: BulkAnalyzeRequest):
    results = []
    sentiments = []
    departments = []
    
    for review_text in request.reviews:
        if not review_text.strip():
            continue
            
        prediction = analyzer.predict(review_text)
        dept = classify_department(review_text)
        
        results.append(BulkAnalyzeItem(
            review=review_text,
            sentiment=prediction["sentiment"],
            confidence=prediction["confidence"],
            department=dept
        ))
        
        sentiments.append(prediction["sentiment"])
        departments.append(dept)
        
    total = len(results)
    if total == 0:
        return BulkAnalyzeResponse(
            total_reviews=0, positive_percent=0, negative_percent=0, neutral_percent=0,
            common_departments={}, results=[]
        )
        
    counts = Counter(sentiments)
    dept_counts = dict(Counter(departments))
    
    return BulkAnalyzeResponse(
        total_reviews=total,
        positive_percent=round((counts.get("Positive", 0) / total) * 100, 1),
        negative_percent=round((counts.get("Negative", 0) / total) * 100, 1),
        neutral_percent=round((counts.get("Neutral", 0) / total) * 100, 1),
        common_departments=dept_counts,
        results=results
    )

@router.post("/report")
async def create_report(request: ReportRequest):
    try:
        filename = generate_report(
            review=request.review,
            sentiment=request.sentiment,
            insights=request.insights
        )
        return FileResponse(
            path=filename,
            media_type='application/pdf',
            filename=f"Fuzzo_Report_{datetime.now().strftime('%Y%m%d')}.pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
