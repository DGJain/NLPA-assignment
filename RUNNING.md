# Instructions for Running the Application Locally

This document provides step-by-step instructions to run the Sentiment Analysis application on your machine (e.g. BITS OSHA Cloud Lab or local machine).

---

## Prerequisites

- **Python 3.x** installed
- **pip** (Python package installer)
- **Internet connection** (required for first-time NLTK data download and for CDN assets: Font Awesome, Chart.js)

---

## Step 1: Navigate to the Project Directory

Open a terminal (or use OSHA Lab terminal) and change to the project folder:

```bash
cd /path/to/NLPA-assignment
```

*(Replace `/path/to/NLPA-assignment` with the actual path where the project is located.)*

---

## Step 2: Create a Virtual Environment (Recommended)

Create and activate a virtual environment to isolate dependencies:

```bash
python3 -m venv venv
```

**Activate the virtual environment:**

- **On macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```
- **On Windows (Command Prompt):**
  ```bash
  venv\Scripts\activate.bat
  ```
- **On Windows (PowerShell):**
  ```bash
  venv\Scripts\Activate.ps1
  ```

You should see `(venv)` in your prompt when the environment is active.

---

## Step 3: Install Dependencies

With the virtual environment activated, install the required Python packages:

```bash
pip install -r requirements.txt
```

This installs: `flask`, `nltk`, `pandas` (and their dependencies). On first run, NLTK may download additional data (e.g. VADER lexicon, tokenizers); an internet connection is required for that.

---

## Step 4: Start the Application

Run the Flask server:

```bash
python app.py
```

You should see output similar to:

```
 * Running on http://127.0.0.1:9000
 * Debug mode: on
```

---

## Step 5: Access the Application

1. Open a web browser (Chrome, Firefox, Safari, or Edge).
2. Go to: **http://localhost:9000** (or **http://127.0.0.1:9000**).
3. The Sentiment Analysis web interface should load.

---

## Step 6: Use the Application

- **Text input:** Type or paste text in the "Text Input" tab and click **Analyze Sentiment**.
- **File upload:** In the "File Upload" tab, drag-and-drop or browse to select a `.txt` file (UTF-8), then click **Analyze Sentiment**.
- View the results: sentiment label, score breakdown, chart, sentence-by-sentence analysis, driving words, highlighted text, and preprocessed text.

---

## Stopping the Application

In the terminal where the app is running, press **Ctrl+C** to stop the server.

---

## Troubleshooting

| Issue | Suggested action |
|-------|------------------|
| Port 9000 already in use | Edit `app.py` and change `port=9000` to another port (e.g. `5000`), then use that port in the browser. |
| NLTK data not found | Ensure internet is available on first run; or run `python -c "import nltk; nltk.download('vader_lexicon'); nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"` once. |
| Templates or static files not found | Run the app from the project root directory (where `app.py` is located). |
| Module not found (flask, nltk) | Ensure the virtual environment is activated and run `pip install -r requirements.txt` again. |

---

*This document is the “Instructions for running the application locally” deliverable for Assignment 2 (Part A).*
