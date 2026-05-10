from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AnalyzeRequest(BaseModel):
    review: str

class AnalyzeResponse(BaseModel):
    sentiment: str
    confidence: float
    department: str
    insights: Dict[str, Any]

class HistoryItem(BaseModel):
    review: str
    sentiment: str
    department: str
    timestamp: str
    insights: Optional[Dict[str, Any]] = None

class HistoryResponse(BaseModel):
    history: List[HistoryItem]

class ReportRequest(BaseModel):
    review: str
    sentiment: str
    department: str
    insights: Dict[str, Any]

class BulkAnalyzeRequest(BaseModel):
    reviews: List[str]

class BulkAnalyzeItem(BaseModel):
    review: str
    sentiment: str
    confidence: float
    department: str

class BulkAnalyzeResponse(BaseModel):
    total_reviews: int
    positive_percent: float
    negative_percent: float
    neutral_percent: float
    common_departments: Dict[str, int]
    results: List[BulkAnalyzeItem]


class ReviewContext(BaseModel):
    review: str
    sentiment: str
    department: str
    timestamp: str


class AssistantQueryRequest(BaseModel):
    query: str
    context: List[ReviewContext]


class AssistantQueryResponse(BaseModel):
    response: str


# ── Phase 4B/4C/4D: Dashboard Intelligence ───────────────────────────────────

class DashboardAlert(BaseModel):
    title: str
    message: str
    severity: str  # low | medium | high | critical


class DashboardIntelligenceRequest(BaseModel):
    context: List[ReviewContext]  # reuses existing schema


class DashboardIntelligenceResponse(BaseModel):
    executive_summary: str
    top_issues: List[str]
    recommendations: List[str]
    department_risk: str
    alerts: List[DashboardAlert]
    risk_level: str  # low | medium | high | critical
