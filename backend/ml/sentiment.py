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
            return {"sentiment": "Unknown", "confidence": 0.0}

        # Vectorize
        X = self.vectorizer.transform([text])
        
        # Predict
        prediction = self.model.predict(X)[0]
        
        # Get confidence (max probability)
        probabilities = self.model.predict_proba(X)[0]
        confidence = float(np.max(probabilities))
        
        return {
            "sentiment": prediction,
            "confidence": confidence
        }

analyzer = SentimentAnalyzer()
