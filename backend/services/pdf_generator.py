import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from fastapi.responses import FileResponse
from datetime import datetime

def generate_report(review: str, sentiment: str, insights: dict) -> str:
    """Generates a PDF report and returns the file path."""
    os.makedirs("temp", exist_ok=True)
    filename = f"temp/report_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    story.append(Paragraph("Fuzzo - Customer Feedback Intelligence Report", styles['Title']))
    story.append(Spacer(1, 12))
    
    # Review
    story.append(Paragraph("<b>Review Text:</b>", styles['Heading2']))
    story.append(Paragraph(review, styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Sentiment
    story.append(Paragraph(f"<b>Sentiment:</b> {sentiment}", styles['Heading2']))
    story.append(Spacer(1, 12))
    
    # Insights
    story.append(Paragraph("<b>AI Insights (Gemini):</b>", styles['Heading2']))
    story.append(Spacer(1, 6))
    
    story.append(Paragraph(f"<b>Summary:</b> {insights.get('summary', 'N/A')}", styles['Normal']))
    story.append(Spacer(1, 6))
    
    story.append(Paragraph(f"<b>Urgency:</b> {insights.get('urgency', 'N/A')}", styles['Normal']))
    story.append(Spacer(1, 6))
    
    story.append(Paragraph("<b>Action Items:</b>", styles['Normal']))
    for item in insights.get('action_items', []):
        story.append(Paragraph(f"- {item}", styles['Normal']))
    story.append(Spacer(1, 6))
    
    story.append(Paragraph("<b>Key Phrases:</b>", styles['Normal']))
    story.append(Paragraph(", ".join(insights.get('key_phrases', [])), styles['Normal']))
    
    doc.build(story)
    
    return filename
