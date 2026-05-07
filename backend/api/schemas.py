from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AnalyzeRequest(BaseModel):
    review: str

class AnalyzeResponse(BaseModel):
    sentiment: str
    confidence: float
    insights: Dict[str, Any]

class HistoryItem(BaseModel):
    review: str
    sentiment: str
    timestamp: str
    insights: Optional[Dict[str, Any]] = None

class HistoryResponse(BaseModel):
    history: List[HistoryItem]

class ReportRequest(BaseModel):
    review: str
    sentiment: str
    insights: Dict[str, Any]
