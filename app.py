# app.py
# Main Flask application file for Sentiment Analysis
# Routes: / (index), /analyze (prediction)
import os
from flask import Flask, render_template, request, jsonify
from sentiment_analyzer import analyze_sentiment

_here = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__,
    template_folder=os.path.join(_here, 'templates'),
    static_folder=os.path.join(_here, 'static'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    # Handle both JSON and Form data (for file uploads or direct text)
    text = ""
    
    if 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            try:
                text = file.read().decode('utf-8')
            except UnicodeDecodeError:
                return jsonify({'error': 'Invalid file encoding. Please upload a UTF-8 text file.'}), 400
    
    if not text and request.form.get('text'):
        text = request.form.get('text')
        
    if not text and request.is_json:
        data = request.get_json()
        text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    result = analyze_sentiment(text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=9000)
