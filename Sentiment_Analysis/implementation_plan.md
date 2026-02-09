# Implementation Plan - Sentiment Analysis Application

## Goal Description
Develop a simple web application that analyzes the sentiment (positive, negative, neutral) of user-provided text or uploaded text files. The application will use Python (Flask) for the backend and HTML/CSS/JS for the frontend. It will leverage NLTK for text preprocessing and sentiment analysis.

## User Review Required
> [!NOTE]
> I will use **NLTK's VADER** (Valence Aware Dictionary and sEntiment Reasoner) for sentiment analysis as it is a standard, pre-trained model excellent for general text and requires no manual training phase, fitting the "simple application" requirement while still allowing for preprocessing demonstration. If you prefer a generic machine learning model (like Naive Bayes with a specific dataset), please let me know.

## Proposed Changes

### Backend (Python/Flask)
#### [NEW] [app.py](file:///c:/Users/GARVIT%20Jain/Desktop/NLPA%20assignment/Sentiment_Analysis/app.py)
- Flask application setup.
- Routes: `/` (home), `/analyze` (POST API).
- Integration with NLP module.

#### [NEW] [sentiment_analyzer.py](file:///c:/Users/GARVIT%20Jain/Desktop/NLPA%20assignment/Sentiment_Analysis/sentiment_analyzer.py)
- `preprocess_text(text)`: Tokenization, stopword removal, lemmatization (using NLTK).
- `analyze_sentiment(text)`: Returns probability scores (compound, pos, neg, neu) and label.

#### [NEW] [requirements.txt](file:///c:/Users/GARVIT%20Jain/Desktop/NLPA%20assignment/Sentiment_Analysis/requirements.txt)
- flask
- nltk
- pandas (if needed for file handling)

### Frontend
#### [NEW] [templates/index.html](file:///c:/Users/GARVIT%20Jain/Desktop/NLPA%20assignment/Sentiment_Analysis/templates/index.html)
- Clean, modern UI with:
    - Text area for direct input.
    - File upload button (.txt support).
    - "Analyze" button.
    - Result section with visualization holders.

#### [NEW] [static/style.css](file:///c:/Users/GARVIT%20Jain/Desktop/NLPA%20assignment/Sentiment_Analysis/static/style.css)
- Modern CSS (gradient backgrounds, card layout, responsive).

#### [NEW] [static/script.js](file:///c:/Users/GARVIT%20Jain/Desktop/NLPA%20assignment/Sentiment_Analysis/static/script.js)
- Handle form submission via AJAX/Fetch.
- Update UI with results.
- Render charts (e.g., using a simple CSS-based bar or a library like Chart.js if complexity allows, for now simple CSS bars are robust).

## Verification Plan

### Automated Tests
- None planned for this simple demo unless requested.

### Manual Verification
1.  **Text Input**: detailed positive/negative sentences to check accuracy.
2.  **File Upload**: Upload a sample `.txt` file and verify parsing and analysis.
3.  **UI/UX**: Verify responsiveness and visual feedback.
