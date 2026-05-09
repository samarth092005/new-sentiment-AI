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