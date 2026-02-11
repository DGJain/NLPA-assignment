# sentiment_analyzer.py
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import string

# Download necessary NLTK data
def download_nltk_data():
    resources = ['vader_lexicon', 'punkt', 'stopwords', 'wordnet', 'punkt_tab']
    for resource in resources:
        try:
            if resource == 'punkt_tab':
                nltk.data.find('tokenizers/punkt_tab')
            else:
                nltk.data.find(f'tokenizers/{resource}.zip') if resource in ['punkt'] else \
                nltk.data.find(f'corpora/{resource}.zip') if resource in ['stopwords', 'wordnet'] else \
                nltk.data.find(f'sentiment/{resource}.zip')
        except LookupError:
            nltk.download(resource, quiet=True)

download_nltk_data()

def preprocess_text(text):
    """
    Prepares text for analysis by tokenizing, removing stopwords/punctuation,
    and lemmatizing.
    Note: VADER is actually designed to handle punctuation and capitalization,
    so heavy preprocessing effectively reduces its accuracy. 
    We will provide a 'clean' version for display or specific models, 
    but for VADER we often pass the raw text. 
    However, to satisfy the requirement of 'Text Preprocessing', 
    we will implement a standard pipeline.
    """
    # Tokenize
    tokens = word_tokenize(text.lower())
    
    # Remove stopwords and punctuation
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words and word not in string.punctuation]
    
    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    lemmatized = [lemmatizer.lemmatize(word) for word in tokens]
    
    return " ".join(lemmatized)

def analyze_sentiment(text):
    """
    Analyzes sentiment using VADER.
    Returns a dictionary with scores, label, word stats, and highlighted tokens.
    """
    sid = SentimentIntensityAnalyzer()
    
    # 1. Overall scores
    scores = sid.polarity_scores(text)
    
    # Determine label
    compound = scores['compound']
    if compound >= 0.05:
        label = 'Positive'
    elif compound <= -0.05:
        label = 'Negative'
    else:
        label = 'Neutral'
        
    # 2. Word Statistics (Frequency of repeated words)
    # Use simple tokenization for counting
    tokens = word_tokenize(text.lower())
    # Filter out punctuation
    words_only = [word for word in tokens if word not in string.punctuation]
    stop_words = set(stopwords.words('english'))
    # Filter out stopwords for "interesting" word counts, or keep them? 
    # Valid requirement: "repeated words with their count". Usually implies meaningful words.
    filtered_words = [word for word in words_only if word not in stop_words]
    
    from collections import Counter
    word_counts = Counter(filtered_words)
    # Get ALL words sorted by frequency
    top_words = word_counts.most_common()
    
    # 3. Sentiment Highlighting
    # We need to preserve original text structure for highlighting, or at least reconstruct it.
    # VADER lexicon is case-sensitive for some things (like CAPS), but mostly lowercase.
    # We will iterate through tokens and check their score in VADER lexicon.
    
    highlighted_text = []
    # Use a tokenizer that keeps punctuation to reconstruct text better, or just split?
    # NLTK word_tokenize is good.
    # We need to map tokens back to sentiment.
    
    # Access VADER lexicon
    lexicon = sid.lexicon
    
    for word in tokens:
        lower_word = word.lower()
        score = lexicon.get(lower_word, 0)
        
        category = 'neutral'
        if score >= 0.05:
            category = 'pos'
        elif score <= -0.05:
            category = 'neg'
            
        highlighted_text.append({
            'word': word,
            'category': category,
            'score': score
        })
        
    result = {
        'compound': compound,
        'pos': scores['pos'],
        'neg': scores['neg'],
        'neu': scores['neu'],
        'label': label,
        'preprocessed_text': preprocess_text(text),
        'word_stats': top_words,
        'highlighted_tokens': highlighted_text
    }
    
    return result
