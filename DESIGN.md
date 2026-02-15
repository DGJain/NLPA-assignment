# Design Choices and Challenges

This document describes the main design decisions and challenges encountered while building the Sentiment Analysis application.

---

## 1. Design Choices

### 1.1 Sentiment Model: VADER

**Choice:** Use NLTK’s **VADER** (Valence Aware Dictionary and sEntiment Reasoner) for sentiment scoring.

**Rationale:**

- No training phase: works out of the box with a built-in lexicon.
- Suited to informal/social text (punctuation, capitalization, “!!”, “VERY”).
- Returns four outputs: `pos`, `neg`, `neu` (proportions 0–1) and `compound` (−1 to +1) for an overall score.
- Fits a “simple application” scope while still allowing preprocessing and rich UI.

**Trade-off:** VADER is English-focused and lexicon-based. It will not match the accuracy of large language models or domain-specific models, but it keeps the stack small and predictable.

---

### 1.2 Two Pipelines: Raw Text for VADER, Preprocessing for Display

**Choice:** Run VADER on **raw text**. Run a separate **preprocessing pipeline** only for the “Preprocessed text” section (tokenize → remove stopwords/punctuation → lemmatize).

**Rationale:**

- VADER is designed to use punctuation and capitalization (e.g. “GOOD” vs “good”). Preprocessing would remove signal and **reduce accuracy**.
- The assignment still required demonstrating **text preprocessing**; that is satisfied by the preprocessed output shown to the user, without altering the input to VADER.

**Result:** Overall and sentence-level sentiment reflect the raw text; the preprocessed view is for transparency and learning, not for scoring.

---

### 1.3 Overall Label and “Mixed” Content

**Choice:** The main sentiment **label** (Positive / Negative / Neutral) is always derived from the **overall compound** score. If the text contains both positive and negative sentences, we do **not** show a “Mixed” label; we show the **dominant** (highest) sentiment and add a note in the summary.

**Rationale:**

- Users get one clear takeaway: “What is the overall sentiment?”
- Compound already aggregates the whole text, so it represents the dominant direction.
- The sentence-by-sentence section still exposes mixed content; the summary can say “The text contains both positive and negative parts.”

**Result:** Badge and label = overall sentiment; mixed nature is explained in the summary and in the per-sentence breakdown.

---

### 1.4 Strength and Clarity

**Choice:**

- **Strength** (Very strong / Strong / Moderate / Weak) is based on \|compound\| so users see how decisive the sentiment is.
- **Sentiment clarity** (clear / moderate / ambiguous) is based on the neutral proportion and compound so users see how “mixed” or unclear the signal is.

**Rationale:**

- Strength answers “How strong is the sentiment?”; clarity answers “How clear vs. ambiguous is it?”. Both are derived from existing VADER outputs with no extra model.

---

### 1.5 Sentence-by-Sentence Analysis

**Choice:** Run VADER on each sentence (after sentence tokenization), and return per-sentence **pos**, **neg**, **neu**, **compound**, and **label**. Expose this in a “Sentence-by-sentence analysis” section with short descriptions.

**Rationale:**

- Long or mixed texts are easier to interpret when each sentence is scored.
- Same model (VADER) and same thresholds keep behavior consistent with the overall result.
- Per-sentence metrics (pos/neu/neg/compound) make the analysis transparent and educational.

---

### 1.6 Negation-Aware Highlighting (Display Only)

**Choice:** For word-level highlighting, mark tokens that immediately follow a negation word (e.g. *not*, *never*, *no*) with a `negated` flag and show them with distinct styling (e.g. strikethrough). **Do not** change VADER scores based on this; VADER already handles negation internally.

**Rationale:**

- Highlighting is based on the VADER lexicon only (word → pos/neg/neutral). So “good” is highlighted green even in “not good.” Marking negated words helps the user see that the model is aware of context (VADER’s score already reflects “not good”).
- Implementing full negation in our own scoring would duplicate and risk conflicting with VADER’s logic.

---

### 1.7 Backend and Portability

**Choice:** Flask app with **explicit** `template_folder` and `static_folder` set from `os.path.dirname(os.path.abspath(__file__))`.

**Rationale:**

- Running the app from a different working directory (e.g. project root vs. subfolder) must still resolve `templates/` and `static/` correctly. Using paths relative to the app file makes the app portable and avoids “template not found” errors.

---

### 1.8 API and Input Flexibility

**Choice:** Single **POST `/analyze`** endpoint that accepts:

- **Form data:** `text=...` or `file=<uploaded file>`
- **JSON:** `{"text": "..."}`

**Rationale:**

- Form + file supports the web UI (text area and file upload). JSON supports scripts and other clients. One endpoint keeps the API simple while serving both.

---

### 1.9 Frontend and UI

**Choice:**

- **Single-page** UI: one HTML page, results injected via JavaScript after calling `/analyze`.
- **Dark theme** with a clear hierarchy: summary card → score breakdown → chart → sentence breakdown → driving words → highlighted text → repeated words → preprocessed text.
- **Vanilla JS** (no React/Vue), **Chart.js** for the bar chart, **Font Awesome** for icons. No build step.

**Rationale:**

- Keeps the project small and runnable without a front-end build. Chart.js and Font Awesome are loaded from CDN. The layout orders information from “overall” to “detail” so users can stop at the level they care about.

---

### 1.10 Thresholds for Label and Strength

**Choice:**

- **Label:** Positive if compound ≥ 0.05; Negative if compound ≤ −0.05; else Neutral. (Aligned with common VADER usage.)
- **Strength:** Very strong if \|compound\| ≥ 0.7; Strong if ≥ 0.5; Moderate if ≥ 0.2; else Weak.

**Rationale:**

- These thresholds are standard for VADER and give stable, interpretable buckets without tuning.

---

## 2. Challenges Faced

### 2.1 Preprocessing vs. VADER Accuracy

**Challenge:** The assignment asked for text preprocessing (tokenization, stopwords, lemmatization), but applying that to the input before VADER would remove punctuation and casing and **weaken** VADER’s accuracy.

**Approach:** Keep two separate flows: (1) **VADER always sees raw text.** (2) **Preprocessing** is applied only to produce the “Preprocessed text” block for the user. So we satisfy the preprocessing requirement without hurting sentiment quality.

---

### 2.2 NLTK Data and First Run

**Challenge:** NLTK needs optional data (e.g. `vader_lexicon`, `punkt`, `stopwords`, `wordnet`). On first run or in a new environment, these must be downloaded; if network is unavailable, analysis can fail.

**Approach:** Call `nltk.download(...)` for required resources at module load (with `quiet=True`). Document in the README that the first run may need internet. In tests or offline, cached data is used when available.

---

### 2.3 Compound vs. Pos/Neg/Neu on One Chart

**Challenge:** Compound is in [−1, 1] while pos, neg, neu are in [0, 1]. Using a single bar chart with a 0–1 scale would misrepresent compound (e.g. negative compound would be clipped or wrong).

**Approach:** Use a **shared y-axis from −1 to 1** for the bar chart so all four metrics (pos, neu, neg, compound) are on a consistent scale and negative compound is visible.

---

### 2.4 Word-Level Highlighting vs. Full Context

**Challenge:** Highlighting is done per **word** using the VADER lexicon. So “good” is always highlighted as positive even in “not good.” The **overall** score from VADER is correct (negation is handled), but the **visual** highlighting can look wrong.

**Approach:** Add a **negation flag**: if the previous token is a negation word, mark the current token as `negated` and style it differently (e.g. strikethrough). We do not change the lexicon score; we only improve the UX by showing that the word is in a negated context. Tooltips can note “Negated” where applicable.

---

### 2.5 Mixed Sentiment: One Label vs. “Mixed”

**Challenge:** When some sentences are positive and some negative, showing only “Mixed” hides the **dominant** sentiment. Showing only the dominant label hides the fact that the text is mixed.

**Approach:** Use the **overall compound** to decide the **main label** (Positive/Negative/Neutral). Add a **summary line** when both positive and negative sentences exist: “The text contains both positive and negative parts.” So: one clear “highest” sentiment for the badge, plus an explicit mixed-content note and full sentence-level detail.

---

### 2.6 Sentence Tokenization Edge Cases

**Challenge:** Sentence tokenization (e.g. NLTK `sent_tokenize`) can struggle with abbreviations (“Dr. Smith”), decimals (“3.14”), or missing punctuation (run-on sentences). That can merge or split sentences in a way that changes per-sentence scores.

**Approach:** Rely on NLTK’s default tokenizer and document that sentence-level analysis is best for normally punctuated text. No custom rules were added to keep the design simple and maintainable.

---

### 2.7 File Upload and Encoding

**Challenge:** Uploaded files may not be UTF-8. Decoding with a fixed encoding can raise or produce wrong text.

**Approach:** Decode uploaded files as **UTF-8** only; on failure return **400** with a clear message: “Invalid file encoding. Please upload a UTF-8 text file.” This keeps implementation simple and sets clear expectations.

---

### 2.8 Rendering User Content Safely (XSS)

**Challenge:** User-provided text (and words from the analysis) are inserted into the DOM. Without escaping, malicious content could execute script (XSS).

**Approach:** In the frontend, **escape** all user- and analysis-derived strings before inserting into HTML (e.g. a small `escapeHtml()` that uses `textContent` and then reads `innerHTML`). Applied to sentence text, highlighted words, word stats, and any other dynamic content.

---

### 2.9 Empty or Whitespace-Only Input

**Challenge:** Empty or whitespace-only input can cause tokenizers or VADER to be called with empty strings, leading to inconsistent or minimal results.

**Approach:** **Backend:** After stripping, if the text is empty, return a structured **empty result** (e.g. neutral label, zero counts, empty lists) instead of running the full pipeline. **API:** Reject requests with no text and no file with **400** and an error message. This keeps responses and UI consistent.

---

## 3. Summary

| Area              | Main choice                                      | Main challenge / mitigation                                                                 |
|-------------------|--------------------------------------------------|---------------------------------------------------------------------------------------------|
| Sentiment model   | VADER (lexicon-based, no training)               | Less accurate than LLMs; accepted for simplicity and scope.                                |
| Preprocessing     | Raw text → VADER; preprocess only for display    | Preprocessing before VADER would hurt accuracy; two pipelines used.                         |
| Overall label     | From compound; mixed only in summary             | Need one “highest” sentiment plus visibility of mixed content; solved by summary + sentences.|
| Sentence-level    | Full pos/neg/neu/compound per sentence           | Tokenization edge cases; use default NLTK, document limits.                               |
| Negation in UI    | Flag negated words for styling only              | Lexicon highlight can look wrong; negated styling + tooltips clarify.                       |
| Chart scale       | y-axis −1 to 1 for all metrics                  | Compound negative values; single scale keeps chart correct.                                 |
| Portability       | Template/static paths from `__file__`            | Running from different CWD; explicit paths avoid missing templates.                        |
| Security          | UTF-8 only for files; escape in frontend         | Encoding and XSS; clear errors and safe HTML rendering.                                    |

This document should be read together with `README.md`, `implementation_plan.md`, and `api_development_guide.md` for a full picture of the system.
