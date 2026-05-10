import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Gemini model
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash"
)

def generate_insights(review: str, sentiment: str) -> dict:

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

        response = model.generate_content(prompt)

        raw_text = response.text.strip()

        # Remove markdown json wrappers if present
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(raw_text)

        return parsed

    except Exception as e:

        print("GEMINI ERROR:", e)

        return {
            "summary": "AI insights temporarily unavailable.",
            "action_items": [
                "Review customer feedback manually"
            ],
            "key_phrases": [],
            "urgency": "Low"
        }


def generate_assistant_response(query: str, context: list) -> str:
    """
    Emovix AI Customer Intelligence Copilot.
    Answers business analytics questions with executive-level, grounded intelligence
    based on the provided review context.
    """

    if not context:
        return (
            "No customer review data is currently available in your Emovix workspace. "
            "Run a few analyses first — once reviews are processed, I can surface "
            "complaint patterns, department risks, and operational trends from your data."
        )

    # ── Pre-compute lightweight stats to enrich prompt context ──────────────
    total = len(context)

    # Sentiment distribution
    sentiment_counts: dict = {}
    for item in context:
        s = item.get("sentiment", "Unknown")
        sentiment_counts[s] = sentiment_counts.get(s, 0) + 1

    sentiment_summary = ", ".join(
        f"{s}: {c} ({round(c/total*100)}%)"
        for s, c in sorted(sentiment_counts.items(), key=lambda x: -x[1])
    )

    # Department frequency
    dept_counts: dict = {}
    for item in context:
        d = item.get("department", "General")
        dept_counts[d] = dept_counts.get(d, 0) + 1

    top_departments = sorted(dept_counts.items(), key=lambda x: -x[1])
    dept_summary = ", ".join(
        f"{d} ({c} reviews)" for d, c in top_departments[:5]
    )

    # Date range
    timestamps = [item.get("timestamp", "")[:10] for item in context if item.get("timestamp")]
    date_range = f"{min(timestamps)} to {max(timestamps)}" if timestamps else "Unknown"

    # Format individual reviews compactly
    review_lines = []
    for idx, item in enumerate(context, 1):
        review_lines.append(
            f"[{idx}] {item.get('sentiment', 'N/A')} | "
            f"{item.get('department', 'General')} | "
            f"{item.get('timestamp', '')[:10]} | "
            f"\"{item.get('review', '')[:220]}\""
        )

    review_block = "\n".join(review_lines)

    # ── System prompt — Executive BI Analyst persona ─────────────────────────
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
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("GEMINI ASSISTANT ERROR:", e)
        return (
            "The intelligence engine is temporarily unavailable. "
            "Please verify your API key configuration and try again shortly."
        )


def generate_dashboard_intelligence(context: list) -> dict:
    """
    Emovix AI Dashboard Intelligence Engine (Phase 4B/4C/4D).
    Generates structured executive business intelligence from review history.
    Returns JSON: executive_summary, top_issues, recommendations,
                  department_risk, alerts, risk_level.
    """
    _empty = {
        "executive_summary": "No review data is currently available. Analyze customer reviews to unlock AI intelligence insights.",
        "top_issues": [],
        "recommendations": ["Process customer reviews to generate operational recommendations."],
        "department_risk": "Insufficient data to assess department risk.",
        "alerts": [],
        "risk_level": "low"
    }

    if not context:
        return _empty

    total = len(context)

    # Sentiment distribution
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

    # Department frequency
    dept_counts: dict = {}
    for item in context:
        d = item.get("department", "General")
        dept_counts[d] = dept_counts.get(d, 0) + 1

    top_depts = sorted(dept_counts.items(), key=lambda x: -x[1])
    dept_summary = ", ".join(f"{d} ({c})" for d, c in top_depts[:5])

    # Date range
    ts = [item.get("timestamp", "")[:10] for item in context if item.get("timestamp")]
    date_range = f"{min(ts)} to {max(ts)}" if ts else "Unknown"

    # Format reviews compactly
    review_block = "\n".join(
        f"[{i}] {item.get('sentiment','N/A')} | {item.get('department','General')} | \"{item.get('review','')[:180]}\""
        for i, item in enumerate(context, 1)
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

Return ONLY valid JSON — no markdown, no extra text:
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
        response = model.generate_content(prompt)
        raw = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(raw)
    except Exception as e:
        print("GEMINI INTELLIGENCE ERROR:", e)
        _empty["executive_summary"] = f"AI analysis encountered an error. Manual review of {total} records recommended."
        return _empty