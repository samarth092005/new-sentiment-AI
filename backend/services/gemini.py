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