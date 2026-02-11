# Sentiment Analysis Project

This project is a web-based Sentiment Analysis tool built with Flask, NLTK, and Pandas. It allows users to input text or upload a file to analyze the sentiment (Positive, Negative, Neutral) and view word statistics.

## Project Structure

- `Sentiment_Analysis/`: Main application directory.
  - `app.py`: The main Flask application file.
  - `sentiment_analyzer.py`: Contains the logic for sentiment analysis using NLTK VADER.
  - `templates/`: HTML templates for the web interface.
  - `static/`: Static files (CSS, JS).
  - `requirements.txt`: List of Python dependencies.

## Prerequisites

- Python 3.x installed on your system.
- `pip` (Python package installer).
- **Internet Connection:** Required to load FontAwesome icons and Chart.js from CDN.

## Installation

1.  **Navigate to the project directory:**
    Open your terminal or command prompt and change to the `Sentiment_Analysis` directory.
    ```bash
    cd "Sentiment_Analysis"
    ```

2.  **Create a virtual environment (Recommended):**
    It is good practice to use a virtual environment to manage dependencies.
    ```bash
    python -m venv venv
    ```

    - **Activate the virtual environment:**
      - On **Windows**:
        ```bash
        venv\Scripts\activate
        ```
      - On **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```

3.  **Install dependencies:**
    Install the required Python packages using `pip`.
    ```bash
    pip install -r requirements.txt
    ```

## Running the Application

1.  **Start the Flask server:**
    Ensure you are in the `Sentiment_Analysis` directory and your virtual environment is activated (if used).
    ```bash
    python app.py
    ```

2.  **Access the application:**
    Open your web browser and go to the URL displayed in the terminal, usually:
    `http://127.0.0.1:5000/`

## Usage

1.  **Enter Text:** Type or paste text into the input box on the homepage.
2.  **Upload File:** Alternatively, upload a `.txt` file containing the text you want to analyze.
3.  **Analyze:** Click the "Analyze Sentiment" button.
4.  **View Results:**
    - **Sentiment Score:** See the overall sentiment (Positive, Negative, Neutral).
    - **Highlighted Text:** View the text with positive words highlighted in green and negative words in red.
    - **Word Statistics:** See a frequency count of words used in the text.

## Running Tests

To ensure the application is working correctly, you can run the provided unit tests.

1.  **Run the test suite:**
    ```bash
    python test_app.py
    ```
    This will execute the tests defined in `test_app.py` and report any failures.
