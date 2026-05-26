import os
import re
import json
import logging
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# ── Gemini configuration ──────────────────────────────────────────────────────
_api_key = os.getenv("GEMINI_API_KEY", "")
if not _api_key:
    logger.warning("GEMINI_API_KEY is not set — AI features will use fallback mode.")

genai.configure(api_key=_api_key)

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-8b",
    generation_config=genai.types.GenerationConfig(
        max_output_tokens=2048,
        temperature=0.4,
    ),
)

# ── Shared request options (timeout) ─────────────────────────────────────────
_REQUEST_OPTIONS = {"timeout": 20}  # 20-second hard timeout per call


# ── Helpers ───────────────────────────────────────────────────────────────────

def _classify_error(e: Exception) -> str:
    """Return a human-readable reason for the Gemini failure."""
    msg = str(e).lower()
    if "quota" in msg or "429" in msg:
        return "quota_exceeded"
    if "timeout" in msg or "deadline" in msg:
        return "timeout"
    if "invalid" in msg or "blocked" in msg or "safety" in msg:
        return "blocked_response"
    if "network" in msg or "connection" in msg or "unavailable" in msg:
        return "network_error"
    return "unknown_error"


def _extract_json(raw: str) -> dict | None:
    """
    Extract valid JSON from Gemini responses safely.
    Handles markdown wrappers, partial prose, and malformed formatting.
    """

    if not raw:
        return None

    # Remove markdown fences
    cleaned = re.sub(r"```json\s*", "", raw)
    cleaned = re.sub(r"```", "", cleaned).strip()

    # Try direct parse
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Find first valid JSON object
    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start != -1 and end != -1 and end > start:
        candidate = cleaned[start:end + 1]

        try:
            return json.loads(candidate)
        except json.JSONDecodeError as e:
            logger.warning("_extract_json failed: %s", e)

    return None


def _safe_text(response) -> str | None:
    """Safely extract .text from a Gemini response; return None on empty/blocked."""
    try:
        text = response.text
        return text.strip() if text and text.strip() else None
    except Exception:
        return None


# ── Public API ────────────────────────────────────────────────────────────────

def generate_insights(review: str, sentiment: str) -> dict:
    """
    Generate structured AI insights for a single customer review.
    Always returns a valid dict — falls back gracefully on any Gemini failure.
    """
    _fallback = {
        "summary": "AI insights are temporarily unavailable. Core sentiment analysis remains fully operational.",
        "action_items": ["Review this feedback manually for follow-up actions."],
        "key_phrases": [],
        "urgency": "Low",
    }

    prompt = f"""
Analyze the following customer review.

Review:
{review}

Sentiment:
{sentiment}

Return ONLY valid JSON in this exact format:

{{
  "summary": "short summary",
  "action_items": ["action 1", "action 2"],
  "key_phrases": ["phrase 1", "phrase 2"],
  "urgency": "Low"
}}
"""

    try:
                

        response = model.generate_content(prompt, request_options=_REQUEST_OPTIONS)
        raw = _safe_text(response)
        if not raw:
            logger.warning("generate_insights: empty Gemini response; using fallback.")
            return _fallback

        parsed = _extract_json(raw)
        print("\nRAW GEMINI RESPONSE:\n", raw)
        print("\nPARSED RESULT:\n", parsed)

        if not parsed:
            logger.warning("generate_insights: JSON parse failed; using fallback. raw=%s", raw[:200])
            return _fallback

        # Validate required keys — fill missing with safe defaults
        return {
            "summary":      parsed.get("summary") or _fallback["summary"],
            "action_items": parsed.get("action_items") or _fallback["action_items"],
            "key_phrases":  parsed.get("key_phrases") or [],
            "urgency":      parsed.get("urgency") or "Low",
        }

    except Exception as e:
        reason = _classify_error(e)
        logger.error("generate_insights failed [%s]: %s", reason, e)
        if reason == "quota_exceeded":
            _fallback["summary"] = "AI quota reached. Insights will resume automatically once capacity is restored."
        elif reason == "timeout":
            _fallback["summary"] = "AI response timed out. Core sentiment analysis is still available."
        return _fallback


def generate_assistant_response(query: str, context: list) -> str:
    """
    Emovix AI Customer Intelligence Copilot.
    Always returns a non-empty string — never raises.
    """
    if not context:
        return (
            "No customer review data is currently available in your Emovix workspace. "
            "Run a few analyses first — once reviews are processed, I can surface "
            "complaint patterns, department risks, and operational trends from your data."
        )

    # ── Pre-compute lightweight stats ─────────────────────────────────────────
    total = len(context)

    sentiment_counts: dict = {}
    for item in context:
        s = item.get("sentiment", "Unknown")
        sentiment_counts[s] = sentiment_counts.get(s, 0) + 1

    sentiment_summary = ", ".join(
        f"{s}: {c} ({round(c/total*100)}%)"
        for s, c in sorted(sentiment_counts.items(), key=lambda x: -x[1])
    )

    dept_counts: dict = {}
    for item in context:
        d = item.get("department", "General")
        dept_counts[d] = dept_counts.get(d, 0) + 1

    top_departments = sorted(dept_counts.items(), key=lambda x: -x[1])
    dept_summary = ", ".join(f"{d} ({c} reviews)" for d, c in top_departments[:5])

    timestamps = [item.get("timestamp", "")[:10] for item in context if item.get("timestamp")]
    date_range = f"{min(timestamps)} to {max(timestamps)}" if timestamps else "Unknown"

    review_lines = []
    for idx, item in enumerate(context, 1):
        review_lines.append(
            f"[{idx}] {item.get('sentiment', 'N/A')} | "
            f"{item.get('department', 'General')} | "
            f"{item.get('timestamp', '')[:10]} | "
            f"\"{item.get('review', '')[:220]}\""
        )
    review_block = "\n".join(review_lines)

    prompt = f"""SYSTEM ROLE:
You are the Emovix AI Customer Intelligence Copilot — a senior customer analytics advisor embedded in a SaaS business intelligence platform.

You think like a Head of Customer Experience or a CX Strategy Analyst. Your job is to surface meaningful patterns, flag operational risks, and translate raw customer feedback into executive-ready intelligence.

PERSONA GUIDELINES:
- Sound analytical, confident, and professional — not cautious or defensive.
- Deliver insights as if briefing a product or operations team.
- Infer reasonable patterns from available data without fabricating specifics.
- When data is sparse, note it briefly and still surface what is observable — do not refuse to analyze.
- Use natural, executive prose. Avoid robotic hedging phrases like "based on the provided context" or "I cannot determine".
- If patterns are emerging, say so. If risks are visible, name them clearly.
- Prefer paragraph-form insights with selective use of bullets only when listing distinct items improves clarity.
- Keep responses concise: 3–6 sentences or one focused analytical paragraph. Never over-explain.

INTELLIGENCE GROUND RULES:
1. Base all insights strictly on the review context provided — do not invent specific statistics.
2. Pre-computed aggregate stats below (sentiment distribution, department breakdown) are derived from the context and are safe to reference.
3. If the question falls outside what the data can support, briefly state the limitation and pivot to what IS observable.
4. Do not begin responses with "I", "Based on", or "According to the data". Open with the insight itself.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATASET OVERVIEW ({total} recent reviews | {date_range})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sentiment Distribution : {sentiment_summary}
Top Departments        : {dept_summary}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDIVIDUAL REVIEWS:
{review_block}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANALYST QUERY:
{query}

Deliver a sharp, executive-grade intelligence response:"""

    try:
        response = model.generate_content(prompt, request_options=_REQUEST_OPTIONS)
        text = _safe_text(response)
        if text:
            return text
        logger.warning("generate_assistant_response: empty response from Gemini.")
        return (
            "The AI Intelligence Engine returned an empty response. "
            "Your data context is available — please rephrase your question or try again shortly."
        )
    except Exception as e:
        reason = _classify_error(e)
        logger.error("generate_assistant_response failed [%s]: %s", reason, e)

        if reason == "quota_exceeded":
            return (
                "The AI Intelligence Engine has reached its current capacity limit. "
                "Your customer data and analytics remain fully available — "
                "AI-powered responses will resume automatically once capacity is restored."
            )
        if reason == "timeout":
            return (
                "The intelligence engine took too long to respond this time. "
                "This is typically transient — please try again in a moment."
            )
        return (
            "The AI Intelligence Engine is temporarily operating at reduced capacity. "
            "Core operational analytics remain fully available. "
            "Please try again shortly."
        )


def generate_dashboard_intelligence(context: list) -> dict:
    """
    Emovix AI Dashboard Intelligence Engine.
    Always returns a complete, valid dict — never raises.
    """
    _empty = {
        "executive_summary": (
            "No review data is currently available. Analyze customer feedback "
            "to unlock AI-powered operational intelligence."
        ),
        "top_issues": [],
        "recommendations": ["Process customer reviews to generate operational recommendations."],
        "department_risk": "Insufficient data to assess department risk.",
        "alerts": [],
        "risk_level": "low",
    }

    if not context:
        return _empty

    total = len(context)

    sent_counts: dict = {}
    for item in context:
        s = item.get("sentiment", "Unknown")
        sent_counts[s] = sent_counts.get(s, 0) + 1

    neg_pct = round(sent_counts.get("Negative", 0) / total * 100)
    pos_pct = round(sent_counts.get("Positive", 0) / total * 100)
    sentiment_summary = ", ".join(
        f"{s}: {c} ({round(c/total*100)}%)"
        for s, c in sorted(sent_counts.items(), key=lambda x: -x[1])
    )

    dept_counts: dict = {}
    for item in context:
        d = item.get("department", "General")
        dept_counts[d] = dept_counts.get(d, 0) + 1

    top_depts = sorted(dept_counts.items(), key=lambda x: -x[1])
    dept_summary = ", ".join(f"{d} ({c})" for d, c in top_depts[:5])

    ts = [item.get("timestamp", "")[:10] for item in context if item.get("timestamp")]
    date_range = f"{min(ts)} to {max(ts)}" if ts else "Unknown"

    review_block = "\n".join(
    f"[{i}] {item.get('sentiment','N/A')} | "
    f"{item.get('department','General')} | "
    f"\"{item.get('review','')[:50]}\""
    for i, item in enumerate(context[:5], 1)

    )

    prompt = f"""SYSTEM ROLE:
You are the Emovix Dashboard Intelligence Engine — a senior customer analytics AI that generates executive-grade business intelligence from review data.

TASK:
Analyze the customer review dataset and return a complete intelligence report as valid JSON.

QUALITY STANDARDS:
- Be specific and grounded — reference actual complaint themes visible in the reviews.
- Sound like a senior analyst briefing an executive team.
- Identify the top 3–5 real complaint categories present in the data.
- Generate specific, actionable operational recommendations.
- Flag genuine risks — do not downplay high negative rates.
- If negative sentiment > 30%, risk_level should be "high" or "critical".
- Alerts should be specific and reference actual patterns from the reviews.
- Severity: "low" | "medium" | "high" | "critical"
- Do NOT add generic filler — every sentence must reflect actual data.

DATASET ({total} reviews | {date_range}):
Sentiment  : {sentiment_summary}
Departments: {dept_summary}
Negative % : {neg_pct}% | Positive %: {pos_pct}%

REVIEWS:
{review_block}

Return STRICTLY VALID RAW JSON ONLY.
Do not use markdown.
Do not use code blocks.
Do not add explanations before or after the JSON.
Response must begin with {{ and end with }}.

{{
  "executive_summary": "2-3 sentence executive intelligence summary",
  "top_issues": ["Issue 1", "Issue 2", "Issue 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "department_risk": "Short sentence on highest-risk department and why",
  "alerts": [
    {{"title": "Alert title", "message": "Specific alert detail", "severity": "high"}},
    {{"title": "Alert title", "message": "Specific alert detail", "severity": "medium"}}
  ],
  "risk_level": "medium"
}}"""

    

    try:
                # ── Try Ollama first ─────────────────────────────────────
        dashboard_summary = f"""
        Total Reviews: {total}
        Negative Reviews: {neg_pct}%
        Positive Reviews: {pos_pct}%

        Department Breakdown:
        {dept_summary}

        Review Samples:
        {review_block[:2000]}
        """





        response = model.generate_content(prompt, request_options=_REQUEST_OPTIONS)
        raw = _safe_text(response)
        if not raw:
            logger.warning("generate_dashboard_intelligence: empty Gemini response.")
            _empty["executive_summary"] = (
                f"AI Intelligence Engine is temporarily operating at reduced capacity. "
                f"Core analytics across {total} records remain available."
            )
            return _empty

        parsed = _extract_json(raw)
        if not parsed:
            logger.warning("generate_dashboard_intelligence: JSON parse failed. raw=%s", raw[:200])
            _empty["executive_summary"] = (
                f"AI Intelligence Engine returned a malformed response. "
                f"Manual review of {total} records recommended while AI recovers."
            )
            return _empty

        # Validate + fill missing keys
        return {
            "executive_summary": parsed.get("executive_summary") or _empty["executive_summary"],
            "top_issues":        parsed.get("top_issues") or [],
            "recommendations":   parsed.get("recommendations") or _empty["recommendations"],
            "department_risk":   parsed.get("department_risk") or _empty["department_risk"],
            "alerts":            parsed.get("alerts") or [],
            "risk_level":        parsed.get("risk_level") or "low",
        }

    except Exception as e:
        reason = _classify_error(e)
        logger.error("generate_dashboard_intelligence failed [%s]: %s", reason, e)

        if reason == "quota_exceeded":
            _empty["executive_summary"] = (
                "AI Intelligence Engine has reached its current capacity limit. "
                f"Core analytics across {total} reviews remain available. "
                "Advanced insights will resume automatically when capacity is restored."
            )
        elif reason == "timeout":
            _empty["executive_summary"] = (
                f"AI Intelligence Engine timed out while processing {total} reviews. "
                "Core operational metrics remain fully available. Please retry the intelligence report."
            )
        else:
            _empty["executive_summary"] = (
                "AI Intelligence Engine is temporarily operating at reduced capacity. "
                f"Core analytics across {total} reviews remain available while advanced insights recover."
            )
        return _empty