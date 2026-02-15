# Task B: Enhancement Plan  
## RESTful API for Sentiment Analysis Application

**Assignment 2 – Part A, Task B (2 Marks)**  
**Requirement:** Provide detailed documentation that explains the **step-by-step process** to enhance the Sentiment Analysis Application to **develop and expose RESTful APIs** that allow external applications to access the sentiment analysis engine.

---

## Submission Note

**For Task B, submit a PDF document.** The content of that PDF should be the **API Development Guide** that describes the step-by-step enhancement process. The full guide is in **api_development_guide.md** in this project.

**To create the PDF for Task B:**  
Export or print **api_development_guide.md** to PDF (e.g. using VS Code “Markdown PDF” extension, Pandoc, or any Markdown-to-PDF tool), and submit that PDF as the Task B deliverable.

---

## Summary of the Enhancement Plan (from api_development_guide.md)

The enhancement plan in **api_development_guide.md** covers:

1. **Overview** – Turning the app into a RESTful API provider (versioning, structure, documentation, error handling).
2. **Step 1** – Installing additional dependencies (e.g. flasgger for Swagger/OpenAPI).
3. **Step 2** – Refactoring with Flask Blueprints: separate API routes (e.g. in `api_routes.py`), versioned prefix (e.g. `/api/v1/`).
4. **Step 3** – Integrating the API blueprint and Swagger into the main app.
5. **Step 4** – Testing the API via Swagger UI and via external clients (e.g. cURL/Postman).

The guide includes code snippets and examples for each step so that the existing Sentiment Analysis application can be enhanced to expose RESTful APIs for external applications.

---

*Detailed step-by-step instructions, code examples, and testing instructions are in **api_development_guide.md**. Use that file as the source for your Task B PDF submission.*
