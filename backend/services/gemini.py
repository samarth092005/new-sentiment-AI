import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE"))

# Define model
generation_config = {
  "temperature": 0.7,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 1024,
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-2.5-flash",
  generation_config=generation_config,
)

def generate_insights(review: str, sentiment: str) -> dict:
    prompt = f"""
    Analyze the following customer review and its sentiment, and return JSON.
    Review: "{review}"
    Sentiment: {sentiment}
    
    Provide insights in the following JSON format strictly:
    {{
      "summary": "1 sentence summary of the issue or praise",
      "action_items": ["Action item 1", "Action item 2"],
      "key_phrases": ["phrase 1", "phrase 2"],
      "urgency": "Low" | "Medium" | "High"
    }}
    """
    try:
        response = model.generate_content(prompt)
        # response.text is already expected to be JSON because of response_mime_type
        import json
        return json.loads(response.text)
    except Exception as e:
        print(f"Error generating insights: {e}")
        return {
            "summary": "Could not generate insights.",
            "action_items": [],
            "key_phrases": [],
            "urgency": "Low"
        }
