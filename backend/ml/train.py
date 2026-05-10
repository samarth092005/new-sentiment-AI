import os
import pickle
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score


def train_model():

    print("Loading Amazon Review dataset...")

    # Load dataset
    df = pd.read_csv(
        "../data/train.csv",
        header=None,
        names=["label", "title", "review"]
    )

    # Balanced real dataset
    positive_df = df[df["label"] == 2].head(80000)
    negative_df = df[df["label"] == 1].head(80000)

    positive_df["sentiment"] = "Positive"
    negative_df["sentiment"] = "Negative"

    print(f"Positive Reviews: {len(positive_df)}")
    print(f"Negative Reviews: {len(negative_df)}")

    # CLEAN neutral samples
    neutral_reviews = [
        "The package arrived yesterday.",
        "The item was received.",
        "Average overall experience.",
        "The product works normally.",
        "Basic functionality is available.",
        "The application opened successfully.",
        "Standard packaging received.",
        "The item matches the description.",
        "The service was average.",
        "Normal user experience.",
        "The product was installed.",
        "Received the package.",
        "The item functions properly.",
        "Standard quality overall.",
        "The application works normally."
    ] * 1000

    neutral_df = pd.DataFrame({
        "review": neutral_reviews,
        "sentiment": ["Neutral"] * len(neutral_reviews)
    })

    print(f"Neutral Reviews: {len(neutral_df)}")

    # Combine dataset
    final_df = pd.concat([
        positive_df[["review", "sentiment"]],
        negative_df[["review", "sentiment"]],
        neutral_df
    ], ignore_index=True)

    # Shuffle dataset
    final_df = final_df.sample(
        frac=1,
        random_state=42
    ).reset_index(drop=True)

    print("\nFinal Distribution:")
    print(final_df["sentiment"].value_counts())

    # Features
    X = final_df["review"]
    y = final_df["sentiment"]

    print("\nVectorizing text data...")

    # Better TF-IDF settings
    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=15000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95
    )

    X_vectorized = vectorizer.fit_transform(X)

    # Stratified split
    X_train, X_test, y_train, y_test = train_test_split(
        X_vectorized,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("\nTraining Logistic Regression model...")

    # Better regularized model
    model = LogisticRegression(
        max_iter=2000,
        C=1.0
    )

    model.fit(X_train, y_train)

    print("\nEvaluating model...")

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print(f"\nAccuracy: {accuracy * 100:.2f}%\n")

    print(classification_report(
        y_test,
        predictions
    ))

    # Save model
    with open("model.pkl", "wb") as f:
        pickle.dump(model, f)

    with open("vectorizer.pkl", "wb") as f:
        pickle.dump(vectorizer, f)

    print("\nModel and vectorizer saved successfully!")
    print("Training completed successfully.")


if __name__ == "__main__":
    train_model()