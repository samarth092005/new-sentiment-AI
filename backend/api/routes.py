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


# ── Helpers ───────────────────────────────────────────────────────────────────

def _build_fallback_insights() -> dict:
    """Return safe default insights when Gemini is unavailable."""
    return {
        "summary": (
            "AI Intelligence Engine is temporarily operating at reduced capacity. "
            "Core sentiment analysis remains fully operational."
        ),
        "action_items": ["Review this feedback manually for follow-up actions."],
        "key_phrases": [],
        "urgency": "Low",
    }


def _build_fallback_intelligence(total: int = 0) -> DashboardIntelligenceResponse:
    """Return a safe, complete DashboardIntelligenceResponse when Gemini is unavailable."""
    summary = (
        "AI Intelligence Engine is temporarily operating at reduced capacity. "
        f"Core operational analytics across {total} records remain available while advanced insights recover."
        if total > 0 else
        "No review data is currently available. Analyze customer feedback to activate AI intelligence."
    )
    return DashboardIntelligenceResponse(
        executive_summary=summary,
        top_issues=[],
        recommendations=["Process customer reviews to generate operational recommendations."],
        department_risk="Insufficient data for department risk assessment.",
        alerts=[],
        risk_level="low",
    )


# ── Analyze (single review) ───────────────────────────────────────────────────
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_review(request: AnalyzeRequest):
    review_text = request.review.strip()
    if not review_text:
        raise HTTPException(status_code=400, detail="Review text cannot be empty.")
    if len(review_text) > 5000:
        raise HTTPException(status_code=400, detail="Review text exceeds maximum length of 5000 characters.")

    # ML pipeline — hard failure (500) if this breaks
    try:
        prediction = analyzer.predict(review_text)
        department = classify_department(review_text)
    except Exception as e:
        logger.error("ML pipeline error: %s", e)
        raise HTTPException(
            status_code=500,
            detail="Sentiment analysis pipeline encountered an error. Please try again."
        )

    # Gemini — soft failure: always return 200 with fallback insights
    try:
        insights = generate_insights(review_text, prediction["sentiment"])
    except Exception as e:
        logger.error("Unexpected error from generate_insights: %s", e)
        insights = _build_fallback_insights()

    return AnalyzeResponse(
        sentiment=prediction["sentiment"],
        confidence=prediction["confidence"],
        department=department,
        insights=insights,
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
            prediction = analyzer.predict(review_text[:2000])
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
            logger.warning("Skipping review due to ML error: %s", e)
            continue

    total = len(results)
    if total == 0:
        return BulkAnalyzeResponse(
            total_reviews=0, positive_percent=0.0, negative_percent=0.0,
            neutral_percent=0.0, common_departments={}, results=[]
        )

    counts      = Counter(sentiments)
    dept_counts = dict(Counter(departments))

    return BulkAnalyzeResponse(
        total_reviews=total,
        positive_percent=round((counts.get("Positive", 0) / total) * 100, 1),
        negative_percent=round((counts.get("Negative", 0) / total) * 100, 1),
        neutral_percent =round((counts.get("Neutral",  0) / total) * 100, 1),
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
        logger.error("PDF file not found: %s", e)
        raise HTTPException(status_code=500, detail="Report file could not be generated.")
    except Exception as e:
        logger.error("Report generation error: %s", e)
        raise HTTPException(status_code=500, detail="An error occurred while generating the report.")


# ── AI Copilot ────────────────────────────────────────────────────────────────
@router.post("/assistant/query", response_model=AssistantQueryResponse)
async def assistant_query(request: AssistantQueryRequest):
    """Emovix AI Customer Intelligence Copilot — always returns 200."""
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
        # generate_assistant_response should never raise — but be extra safe
        logger.error("Unexpected assistant error: %s", e)
        response_text = (
            "The AI Intelligence Engine is temporarily operating at reduced capacity. "
            "Core operational analytics remain available. Please try again shortly."
        )

    return AssistantQueryResponse(response=response_text)


# ── Dashboard Intelligence ────────────────────────────────────────────────────
@router.post("/intelligence/dashboard", response_model=DashboardIntelligenceResponse)
async def dashboard_intelligence(request: DashboardIntelligenceRequest):
    """Emovix AI Dashboard Intelligence Engine — always returns 200 with complete response."""
    if len(request.context) > 50:
        raise HTTPException(status_code=400, detail="Context exceeds maximum of 50 review records.")

    total = len(request.context)

    try:
        context_dicts = [item.model_dump() for item in request.context]
        data = generate_dashboard_intelligence(context_dicts)
    except Exception as e:
        # generate_dashboard_intelligence should never raise — but be extra safe
        logger.error("Unexpected intelligence engine error: %s", e)
        return _build_fallback_intelligence(total)

    # Safe alert construction with per-field defaults
    alerts = [
        DashboardAlert(
            title=a.get("title") or "Operational Alert",
            message=a.get("message") or "",
            severity=a.get("severity") or "low"
        )
        for a in data.get("alerts", [])
        if isinstance(a, dict)
    ]

    return DashboardIntelligenceResponse(
        executive_summary=data.get("executive_summary") or _build_fallback_intelligence(total).executive_summary,
        top_issues       =data.get("top_issues", []),
        recommendations  =data.get("recommendations", ["Review customer feedback to generate recommendations."]),
        department_risk  =data.get("department_risk", "Insufficient data for department risk assessment."),
        alerts=alerts,
        risk_level=data.get("risk_level", "low"),
    )
