from services.ollama_service import generate_local_insights

result = generate_local_insights(
    "Amazing customer support and very fast delivery."
)

print(result)