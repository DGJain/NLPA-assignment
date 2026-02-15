# Sentiment Analysis App

A web-based sentiment analysis tool built with **Flask** and **NLTK (VADER)**. Analyze text or upload a `.txt` file to get sentiment scores, word statistics, and highlighted sentiment cues.

## Features

- **Text or file input** — Type/paste text or upload a UTF-8 `.txt` file
- **Sentiment result** — Overall label (Positive / Negative / Neutral) with **strength** (Strong / Moderate / Weak)
- **Summary** — One-line description of the result (e.g. *"The text is moderately positive."*)
- **Text statistics** — Word count, sentence count, and character count
- **Score breakdown** — Positive, Neutral, Negative, and Compound scores with hover tooltips explaining each
- **Bar chart** — Visual comparison of the four scores
- **Driving words** — Top positive and negative words found in the text (from VADER lexicon) with scores
- **Highlighted text** — Inline highlighting of positive (green), negative (red), and neutral (gray) tokens; hover to see VADER score
- **Top repeated words** — Frequency list of non-stopwords
- **Preprocessed text** — Tokenized, stopwords-removed, lemmatized version of the input

## Project structure

```
.
├── app.py                 # Flask app (routes: /, /analyze)
├── sentiment_analyzer.py   # NLTK VADER analysis, preprocessing, stats
├── requirements.txt       # Python dependencies
├── test_app.py            # Unit tests
├── templates/
│   └── index.html         # Single-page UI
├── static/
│   ├── style.css          # Styles (dark theme)
│   └── script.js          # Frontend logic, chart (Chart.js)
├── api_development_guide.md
├── implementation_plan.md
└── README.md
```

## Prerequisites

- **Python 3.x**
- **pip**
- **Internet** (first run may download NLTK data; UI uses CDN for Font Awesome and Chart.js)

## Installation

1. **Go to the project directory:**
   ```bash
   cd /path/to/NLPA-assignment
   ```

2. **Create and activate a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```
   - **macOS/Linux:** `source venv/bin/activate`
   - **Windows:** `venv\Scripts\activate`

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the app

1. **Start the server** (with venv activated):
   ```bash
   python app.py
   ```

2. **Open in browser:**  
   **http://localhost:9000**

## Usage

1. **Text:** Use the "Text Input" tab and type or paste your text.
2. **File:** Use the "File Upload" tab and drag-and-drop or browse to select a `.txt` file (UTF-8).
3. Click **Analyze Sentiment**.
4. Review the summary, stats, score breakdown, chart, driving words, highlighted text, repeated words, and preprocessed text.

## API

- **POST `/analyze`**  
  Accepts:
  - Form: `text=...` or `file=<file>`
  - JSON: `{"text": "..."}`  

  Returns JSON with: `label`, `strength`, `summary`, `compound`, `pos`, `neg`, `neu`, `text_stats`, `score_descriptions`, `top_positive_words`, `top_negative_words`, `highlighted_tokens`, `word_stats`, `preprocessed_text`.

See `api_development_guide.md` for more detail.

## Running tests

```bash
python -m unittest test_app
```

or:

```bash
python test_app.py
```

## Tech stack

- **Backend:** Flask, NLTK (VADER, tokenizers, stopwords, WordNet)
- **Frontend:** Vanilla JS, Chart.js, Font Awesome
- **Styling:** CSS (dark theme, responsive)
