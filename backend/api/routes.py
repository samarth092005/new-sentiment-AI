from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from api.schemas import (
    AnalyzeRequest, AnalyzeResponse,
    HistoryItem, HistoryResponse,
    ReportRequest, BulkAnalyzeRequest, BulkAnalyzeResponse, BulkAnalyzeItem,
    AssistantQueryRequest, AssistantQueryResponse,
    DashboardIntelligenceRequest, DashboardIntelligenceResponse, DashboardAlert
)
from ml.sentiment import analyzer
from services.gemini import generate_insights, generate_assistant_response, generate_dashboard_intelligence
from services.pdf_generator import generate_report
from utils.classifier import classify_department
from datetime import datetime
import os
import logging
from collections import Counter

logger = logging.getLogger(__name__)
router = APIRouter()

# ── Analyze (single review) ───────────────────────────────────────────────────
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_review(request: AnalyzeRequest):
    review_text = request.review.strip()
    if not review_text:
        raise HTTPException(status_code=400, detail="Review text cannot be empty.")
    if len(review_text) > 5000:
        raise HTTPException(status_code=400, detail="Review text exceeds maximum length of 5000 characters.")

    try:
        prediction = analyzer.predict(review_text)
        department = classify_department(review_text)
        insights   = generate_insights(review_text, prediction["sentiment"])
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail="Analysis pipeline encountered an error. Please try again.")

    return AnalyzeResponse(
        sentiment=prediction["sentiment"],
        confidence=prediction["confidence"],
        department=department,
        insights=insights
    )


# ── Bulk analyze ──────────────────────────────────────────────────────────────
@router.post("/analyze/bulk", response_model=BulkAnalyzeResponse)
async def bulk_analyze_reviews(request: BulkAnalyzeRequest):
    if not request.reviews:
        raise HTTPException(status_code=400, detail="No reviews provided for bulk analysis.")
    if len(request.reviews) > 1000:
        raise HTTPException(status_code=400, detail="Bulk limit is 1000 reviews per request.")

    results, sentiments, departments = [], [], []

    for review_text in request.reviews:
        if not isinstance(review_text, str) or not review_text.strip():
            continue
        try:
            prediction = analyzer.predict(review_text[:2000])  # cap per-review
            dept       = classify_department(review_text)
            results.append(BulkAnalyzeItem(
                review=review_text,
                sentiment=prediction["sentiment"],
                confidence=prediction["confidence"],
                department=dept
            ))
            sentiments.append(prediction["sentiment"])
            departments.append(dept)
        except Exception as e:
            logger.warning(f"Skipping review due to error: {e}")
            continue

    total = len(results)
    if total == 0:
        return BulkAnalyzeResponse(
            total_reviews=0, positive_percent=0.0, negative_percent=0.0,
            neutral_percent=0.0, common_departments={}, results=[]
        )

    counts     = Counter(sentiments)
    dept_counts = dict(Counter(departments))

    return BulkAnalyzeResponse(
        total_reviews=total,
        positive_percent=round((counts.get("Positive", 0) / total) * 100, 1),
        negative_percent=round((counts.get("Negative", 0) / total) * 100, 1),
        neutral_percent=round((counts.get("Neutral",  0) / total) * 100, 1),
        common_departments=dept_counts,
        results=results
    )


# ── PDF Report ────────────────────────────────────────────────────────────────
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
            filename=f"Emovix_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        )
    except FileNotFoundError as e:
        logger.error(f"PDF file not found: {e}")
        raise HTTPException(status_code=500, detail="Report file could not be generated.")
    except Exception as e:
        logger.error(f"Report generation error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the report.")


# ── AI Copilot ────────────────────────────────────────────────────────────────
@router.post("/assistant/query", response_model=AssistantQueryResponse)
async def assistant_query(request: AssistantQueryRequest):
    """Emovix AI Customer Intelligence Copilot."""
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    if len(query) > 1000:
        raise HTTPException(status_code=400, detail="Query exceeds maximum length of 1000 characters.")
    if len(request.context) > 50:
        raise HTTPException(status_code=400, detail="Context exceeds maximum of 50 review records.")

    try:
        context_dicts = [item.model_dump() for item in request.context]
        response_text = generate_assistant_response(query, context_dicts)
    except Exception as e:
        logger.error(f"Assistant error: {e}")
        raise HTTPException(status_code=503, detail="AI Copilot is temporarily unavailable. Please try again shortly.")

    return AssistantQueryResponse(response=response_text)


# ── Dashboard Intelligence ────────────────────────────────────────────────────
@router.post("/intelligence/dashboard", response_model=DashboardIntelligenceResponse)
async def dashboard_intelligence(request: DashboardIntelligenceRequest):
    """Emovix AI Dashboard Intelligence Engine (Phase 4B/4C/4D)."""
    if len(request.context) > 50:
        raise HTTPException(status_code=400, detail="Context exceeds maximum of 50 review records.")

    try:
        context_dicts = [item.model_dump() for item in request.context]
        data = generate_dashboard_intelligence(context_dicts)
    except Exception as e:
        logger.error(f"Intelligence engine error: {e}")
        raise HTTPException(status_code=503, detail="Intelligence engine is temporarily unavailable.")

    alerts = [
        DashboardAlert(
            title=a.get("title", "Alert"),
            message=a.get("message", ""),
            severity=a.get("severity", "low")
        )
        for a in data.get("alerts", [])
        if isinstance(a, dict)
    ]

    return DashboardIntelligenceResponse(
        executive_summary=data.get("executive_summary", "Intelligence summary unavailable."),
        top_issues=data.get("top_issues", []),
        recommendations=data.get("recommendations", []),
        department_risk=data.get("department_risk", ""),
        alerts=alerts,
        risk_level=data.get("risk_level", "low")
    )
