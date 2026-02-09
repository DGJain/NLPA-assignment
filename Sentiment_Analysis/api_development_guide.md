# API Development Guide: Enhancing Sentiment Analysis App

This guide outlines the step-by-step process to enhance the existing Sentiment Analysis application into a robust RESTful API provider using Flask. This allows external applications (mobile apps, 3rd party services) to consume your sentiment analysis engine.

## Overview of Enhancements
1.  **API Structure**: Organizing routes with Blueprints.
2.  **Versioning**: implementing `/api/v1/` prefixes.
3.  **Documentation**: Adding Swagger/OpenAPI support.
4.  **Error Handling**: Standardized JSON error responses.

---

## Step 1: Install Additional Dependencies
To build a professional API with documentation, we'll use `flasgger` (Flask-Swagger).

```bash
pip install flasgger
```

## Step 2: Refactor Code Structure (Blueprints)
Instead of keeping all routes in `app.py`, separate the API logic.

1.  **Create a new file `api_routes.py`**:
    This file will hold all API-related endpoints.

    ```python
    from flask import Blueprint, request, jsonify
    from sentiment_analyzer import analyze_sentiment

    # Create a Blueprint named 'api'
    api_bp = Blueprint('api', __name__)

    @api_bp.route('/analyze', methods=['POST'])
    def analyze_api():
        """
        Analyze sentiment of provided text.
        ---
        tags:
          - Sentiment Analysis
        parameters:
          - in: body
            name: body
            schema:
              type: object
              required:
                - text
              properties:
                text:
                  type: string
                  example: "I love coding!"
        responses:
          200:
            description: Analysis result
            schema:
              type: object
              properties:
                label:
                  type: string
                compound:
                  type: number
    """
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        result = analyze_sentiment(data['text'])
        return jsonify(result)
    ```

## Step 3: Integrate with Main Application
Update `app.py` to register the blueprint and setup Swagger.

```python
from flask import Flask, render_template
from flasgger import Swagger
from api_routes import api_bp # Import the blueprint

app = Flask(__name__)
swagger = Swagger(app) # Initialize Swagger

# Register the blueprint with a version prefix
app.register_blueprint(api_bp, url_prefix='/api/v1')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
```

## Step 4: Testing the API
Once implemented, you can interact with the API in two ways:

### 1. Swagger UI
Navigate to `http://localhost:5000/apidocs`.
You will see an interactive UI where you can test the endpoints directly in the browser.

### 2. External Request (cURL/Postman)
**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/v1/analyze \
     -H "Content-Type: application/json" \
     -d '{"text": "This is a great tutorial"}'
```

**Response:**
```json
{
    "compound": 0.6249,
    "label": "Positive",
    "neg": 0.0,
    "neu": 0.423,
    "pos": 0.577,
    "preprocessed_text": "great tutorial"
}
```

## Summary
By following these steps, you verify that:
1.  **Decoupling**: API logic is separate from frontend logic.
2.  **Standardization**: External apps know exactly what to send and receive via Swagger docs.
3.  **Scalability**: Versioning (`/api/v1`) allows you to release updates without breaking existing clients.
