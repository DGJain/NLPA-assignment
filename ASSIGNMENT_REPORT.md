# Assignment 2 – Part A: Brief Report  
## Sentiment Analysis Application

**Course:** NLP Applications (S1-25_AIMLCZG519)  
**Deliverable:** A brief report explaining the design choices and any challenges faced during implementation, with a set of screenshots that explain the entire flow of the application.

---

## 1. Design Choices

### 1.1 Sentiment Model (NLP Model Integration)

- **Choice:** NLTK’s **VADER** (Valence Aware Dictionary and sEntiment Reasoner) is used for sentiment analysis.
- **Reason:** VADER is lexicon-based, requires no training, works well on informal and social text, and returns positive, negative, neutral, and compound scores. It fits the requirement of implementing an NLP model (e.g. using NLTK) for sentiment analysis.

### 1.2 Text Preprocessing

- **Choice:** Two separate pipelines:
  - **For sentiment prediction:** The **raw text** is passed to VADER (no preprocessing). VADER is designed to use punctuation and capitalization.
  - **For display and demonstration:** A **preprocessing pipeline** (tokenization → stopword removal → lemmatization using NLTK) is applied and the result is shown in the “Preprocessed text” section.
- **Reason:** Preprocessing the input to VADER would reduce its accuracy. The assignment’s preprocessing requirement is met by applying tokenization, stopword removal, and lemmatization and displaying that output, without altering the input to the sentiment model.

### 1.3 Sentiment Prediction and Display

- **Choice:** Sentiment is predicted from VADER’s **compound** score: Positive (compound ≥ 0.05), Negative (compound ≤ −0.05), Neutral otherwise. Strength (Very strong / Strong / Moderate / Weak) is derived from |compound|. When the text contains both positive and negative sentences, the **overall label** is still based on compound (dominant sentiment); a note in the summary indicates mixed content.
- **Reason:** Gives a single, interpretable overall sentiment and strength while still exposing mixed content via summary and sentence-by-sentence analysis.

### 1.4 Web Interface

- **Choice:** A single-page web interface with:
  - **User input:** Text area and file upload (.txt, UTF-8).
  - **Sentiment display:** Color-coded label (Positive/Negative/Neutral), bar chart (pos, neu, neg, compound), score breakdown, sentence-by-sentence analysis, driving words, highlighted text, repeated words, and preprocessed text.
- **Reason:** Meets the requirement for an intuitive interface (text or file input) and clear visualization (e.g. bar chart and color-coded label).

### 1.5 Backend and API

- **Choice:** Flask app with one **POST /analyze** endpoint accepting form data (text or file) and JSON (`{"text": "..."}`). Template and static folders are set using the app file path so the app runs correctly from any working directory.
- **Reason:** Supports both the web UI and external clients; simple and portable.

---

## 2. Challenges Faced

1. **Preprocessing vs. accuracy:** Applying tokenization/stopword removal/lemmatization before VADER would hurt accuracy. **Approach:** Use raw text for VADER; run preprocessing only for the “Preprocessed text” display.

2. **Chart scale:** Compound is in [−1, 1] while pos/neg/neu are in [0, 1]. **Approach:** Use a single y-axis from −1 to 1 so all four metrics (including negative compound) are shown correctly.

3. **Negation in highlighting:** Word-level highlighting uses the lexicon only (e.g. “good” is green even in “not good”). **Approach:** Mark words that follow negation (e.g. “not”) and style them differently (e.g. strikethrough); VADER’s scores already account for negation.

4. **Mixed sentiment:** Need one overall label and still show that the text is mixed. **Approach:** Overall label from compound; add a summary line when both positive and negative sentences exist; keep sentence-by-sentence breakdown.

5. **NLTK data:** First run requires downloading NLTK data (vader_lexicon, punkt, stopwords, wordnet). **Approach:** Download at module load; document in README and RUNNING.md.

6. **Portability:** App must find templates and static files when run from different directories. **Approach:** Set `template_folder` and `static_folder` from `os.path.dirname(os.path.abspath(__file__))`.

7. **Security:** User content is rendered in the browser. **Approach:** Escape all user- and analysis-derived strings before inserting into the DOM to prevent XSS.

8. **File encoding:** Uploaded files may not be UTF-8. **Approach:** Decode as UTF-8 only; return 400 with a clear error message if decoding fails.

A more detailed discussion is in **DESIGN.md**.

---

## 3. Screenshots Explaining the Entire Flow

*Include the following screenshots in the report (paste them into this section when preparing the final PDF/submission).*

### Screenshot 1: Homepage – Text input
- **What to capture:** The main page with the “Text Input” tab selected, the text area visible, and the “Analyze Sentiment” button.
- **Purpose:** Shows the user interface for entering text.

### Screenshot 2: File upload option
- **What to capture:** The “File Upload” tab selected, with the drag-and-drop area and “Browse Files” button visible.
- **Purpose:** Shows the option to upload a text file.

### Screenshot 3: Analysis in progress (optional)
- **What to capture:** The loading state (e.g. “Analyzing...” spinner) after clicking Analyze.
- **Purpose:** Shows feedback during processing.

### Screenshot 4: Result – Sentiment label and summary
- **What to capture:** The result section with the sentiment badge (e.g. “Strong Positive”), the summary sentence, and the text statistics (words, sentences, characters).
- **Purpose:** Shows the main sentiment output and basic stats.

### Screenshot 5: Result – Score breakdown and chart
- **What to capture:** The score breakdown cards (Positive, Neutral, Negative, Compound) and the bar chart.
- **Purpose:** Shows the visualization of sentiment (bar chart and color-coded scores).

### Screenshot 6: Result – Sentence-by-sentence analysis
- **What to capture:** The “Sentence-by-sentence analysis” section with at least one or two sentences, their metrics (Pos, Neu, Neg, Compound), and labels.
- **Purpose:** Shows per-sentence sentiment analysis.

### Screenshot 7: Result – Driving words and highlighted text
- **What to capture:** The “Positive words in text” / “Negative words in text” lists and the “Sentiment highlight” section with colored tokens.
- **Purpose:** Shows which words drove the sentiment and how they are highlighted.

### Screenshot 8: Result – Preprocessed text
- **What to capture:** The “Preprocessed text” section showing the tokenized, stopwords-removed, lemmatized version of the input.
- **Purpose:** Shows the preprocessing output as required by the assignment.

---

*Add the actual screenshot images in place of the descriptions above when compiling the final report (e.g. for PDF submission).*
