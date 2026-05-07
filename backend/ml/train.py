import os
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

def train_dummy_model():
    """Trains a simple dummy model for the MVP."""
    print("Training dummy model...")
    data = {
        'review': [
            "This app is amazing, I love it!",
            "Terrible experience, completely broken.",
            "It's okay, nothing special but it works.",
            "Best customer service I have ever received.",
            "I hate this product, waste of money.",
            "Very intuitive and easy to use.",
            "Too many bugs, fix your software.",
            "Decent value for the price.",
            "Absolutely fantastic, highly recommend!",
            "Worst purchase ever."
        ],
        'sentiment': [
            "Positive", "Negative", "Neutral", "Positive", "Negative",
            "Positive", "Negative", "Neutral", "Positive", "Negative"
        ]
    }
    
    df = pd.DataFrame(data)
    
    vectorizer = TfidfVectorizer(max_features=1000)
    X = vectorizer.fit_transform(df['review'])
    y = df['sentiment']
    
    model = LogisticRegression()
    model.fit(X, y)
    
    # Save the model and vectorizer
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    
    with open(os.path.join(os.path.dirname(__file__), 'model.pkl'), 'wb') as f:
        pickle.dump(model, f)
        
    with open(os.path.join(os.path.dirname(__file__), 'vectorizer.pkl'), 'wb') as f:
        pickle.dump(vectorizer, f)
        
    print("Model and vectorizer saved successfully.")

if __name__ == "__main__":
    train_dummy_model()
