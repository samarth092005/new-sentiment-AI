import os
import pickle
import numpy as np

model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
vectorizer_path = os.path.join(os.path.dirname(__file__), 'vectorizer.pkl')


class SentimentAnalyzer:

    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.load_models()

    def load_models(self):

        if os.path.exists(model_path) and os.path.exists(vectorizer_path):

            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)

            with open(vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)

        else:
            print("Models not found. Please run train.py first.")

    def predict(self, text: str):

        if not self.model or not self.vectorizer:
            return {
                "sentiment": "Unknown",
                "confidence": 0.0
            }

        # Vectorize text
        X = self.vectorizer.transform([text])

        # ML prediction
        prediction = self.model.predict(X)[0]

        # Confidence score
        probabilities = self.model.predict_proba(X)[0]
        confidence = float(np.max(probabilities))

        # Lowercase text
        text_lower = text.lower()

        # Negative keywords
        negative_keywords = [
            "late",
            "rude",
            "worst",
            "bad",
            "terrible",
            "refund",
            "broken",
            "issue",
            "problem",
            "poor",
            "angry",
            "complaint",
            "delay",
            "damaged",
            "slow",
            "hate",
            "disappointing",
            "useless",
            "frustrating",
            "failed",
            "error",
            "bug",
            "crash",
            "not working",
            "waste",
            "cancel",
            "missing"
        ]

        # Positive keywords
        positive_keywords = [
            "amazing",
            "excellent",
            "fantastic",
            "great",
            "awesome",
            "love",
            "perfect",
            "fast delivery",
            "beautiful",
            "high quality",
            "easy to use",
            "recommend",
            "satisfied",
            "happy",
            "best",
            "wonderful",
            "smooth",
            "brilliant",
            "quick",
            "helpful",
            "professional",
            "responsive",
            "outstanding",
            "superb"
        ]

        # Neutral keywords
        neutral_keywords = [
            "received",
            "delivered",
            "average",
            "normal",
            "standard",
            "basic",
            "okay",
            "processed",
            "available",
            "opened",
            "installed",
            "functional"
        ]

        # Hybrid AI + Rule Logic

        # Negative gets highest priority
        if any(word in text_lower for word in negative_keywords):
            prediction = "Negative"
            confidence = max(confidence, 0.85)

        # Positive second priority
        elif any(word in text_lower for word in positive_keywords):
            prediction = "Positive"
            confidence = max(confidence, 0.85)

        # Neutral fallback
        elif any(word in text_lower for word in neutral_keywords):
            prediction = "Neutral"
            confidence = max(confidence, 0.75)

        return {
            "sentiment": prediction,
            "confidence": confidence
        }


analyzer = SentimentAnalyzer()