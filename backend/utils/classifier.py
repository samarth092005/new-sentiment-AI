import re

# Keyword mapping to departments
DEPARTMENT_KEYWORDS = {
    "Delivery": [r"\bdelivery\b", r"\blate\b", r"\bshipping\b", r"\bcourier\b", r"\barrived\b", r"\btransit\b"],
    "Refund": [r"\brefund\b", r"\bmoney back\b", r"\bcharge\b", r"\bcharged\b", r"\bbilling\b", r"\breturn\b"],
    "Customer Support": [r"\bsupport\b", r"\bservice\b", r"\bagent\b", r"\brude\b", r"\bhelpdesk\b", r"\bhelped\b", r"\bcall\b", r"\bemail\b"],
    "Product Quality": [r"\bbroken\b", r"\bquality\b", r"\bcheap\b", r"\bmaterial\b", r"\btore\b", r"\bshredded\b", r"\bfell apart\b", r"\bstopped working\b"],
    "Packaging": [r"\bpackage\b", r"\bpackaging\b", r"\bbox\b", r"\bsmashed\b", r"\bwrapped\b"]
}

def classify_department(review: str) -> str:
    """
    Classifies a customer review into a department based on keywords.
    Falls back to 'General Feedback' if no keywords match.
    """
    review_lower = review.lower()
    
    # We will score each department based on the number of keyword matches
    scores = {dept: 0 for dept in DEPARTMENT_KEYWORDS.keys()}
    
    for dept, patterns in DEPARTMENT_KEYWORDS.items():
        for pattern in patterns:
            if re.search(pattern, review_lower):
                scores[dept] += 1
                
    # Find the department with the highest score
    max_score = 0
    best_dept = "General Feedback"
    
    for dept, score in scores.items():
        if score > max_score:
            max_score = score
            best_dept = dept
            
    return best_dept
