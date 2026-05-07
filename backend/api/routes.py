from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from api.schemas import AnalyzeRequest, AnalyzeResponse, HistoryItem, HistoryResponse, ReportRequest
from ml.sentiment import analyzer
from services.gemini import generate_insights
from services.pdf_generator import generate_report
from datetime import datetime
import os

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
    
    # 3. In a real app, save to Firestore here with user ID
    # This will be handled by the frontend for the MVP to keep backend simple
    
    return AnalyzeResponse(
        sentiment=sentiment,
        confidence=confidence,
        insights=insights
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
