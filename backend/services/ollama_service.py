import json
import ollama
import re


def extract_json(raw: str):

    try:
        return json.loads(raw)
    except:
        pass

    cleaned = re.sub(r"```json", "", raw)
    cleaned = re.sub(r"```", "", cleaned).strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start != -1 and end != -1:
        try:
            return json.loads(cleaned[start:end + 1])
        except:
            return None

    return None


def generate_local_insights(review: str):

    prompt = f"""
    Analyze the following customer feedback.

    Return ONLY valid JSON.

    Format:
    {{
      "summary": "...",
      "action_items": ["..."],
      "key_phrases": ["..."],
      "urgency": "Low | Medium | High"
    }}

    Customer Feedback:
    {review}
    """

    try:

        response = ollama.chat(
            model='llama3.1:8b',
            messages=[
                {
                    'role': 'user',
                    'content': prompt
                }
            ]
        )

        raw = response['message']['content']

        parsed = extract_json(raw)

        if parsed:
            return parsed

        return {
            "summary": "Local AI analysis completed.",
            "action_items": [],
            "key_phrases": [],
            "urgency": "Low"
        }

    except Exception as e:

        print("Ollama failed:", e)

        return None