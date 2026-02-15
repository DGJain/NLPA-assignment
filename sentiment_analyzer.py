# sentiment_analyzer.py
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from collections import Counter
import string

# Negation words that flip or soften sentiment of following words (VADER handles these; we use for display)
NEGATION_WORDS = {
    'not', 'no', 'never', 'none', 'nobody', 'nothing', 'nowhere', 'neither', 'nor',
    'hardly', 'barely', 'scarcely', 'seldom', "n't", "cannot", "can't", "won't",
    "wouldn't", "couldn't", "shouldn't", "isn't", "aren't", "wasn't", "weren't",
    "don't", "doesn't", "didn't", "haven't", "hasn't", "hadn't", "won't", "without",
}

# Download necessary NLTK data on first use
def _ensure_nltk_data():
    for resource in ['vader_lexicon', 'punkt', 'punkt_tab', 'stopwords', 'wordnet']:
        try:
            nltk.download(resource, quiet=True)
        except Exception:
            pass

_ensure_nltk_data()

def _empty_result():
    """Return a minimal result for empty input."""
    return {
        'compound': 0.0, 'pos': 0.0, 'neg': 0.0, 'neu': 1.0,
        'label': 'Neutral', 'strength': 'Weak', 'summary': 'No text to analyze.',
        'text_stats': {'word_count': 0, 'sentence_count': 0, 'char_count': 0},
        'score_descriptions': {},
        'sentence_sentiments': [], 'sentiment_clarity': 'ambiguous',
        'top_positive_words': [], 'top_negative_words': [],
        'preprocessed_text': '', 'word_stats': [], 'highlighted_tokens': [],
    }


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

def _sentence_label(compound):
    """Return Positive, Negative, or Neutral for a compound score."""
    if compound >= 0.05:
        return 'Positive'
    if compound <= -0.05:
        return 'Negative'
    return 'Neutral'


def analyze_sentiment(text):
    """
    Analyzes sentiment using VADER.
    Returns a dictionary with scores, label, sentence-level breakdown,
    word stats, and highlighted tokens (with negation awareness).
    """
    sid = SentimentIntensityAnalyzer()
    text = text.strip()
    if not text:
        return _empty_result()

    # 1. Overall scores (VADER on raw text to preserve punctuation/caps)
    scores = sid.polarity_scores(text)
    compound = scores['compound']
    label = _sentence_label(compound)

    # 2. Sentence-level analysis (for mixed sentiment and breakdown)
    sentences = sent_tokenize(text)
    sentence_sentiments = []
    labels_in_text = set()
    for sent in sentences:
        sent = sent.strip()
        if not sent:
            continue
        s_scores = sid.polarity_scores(sent)
        s_compound = s_scores['compound']
        s_label = _sentence_label(s_compound)
        labels_in_text.add(s_label)
        sentence_sentiments.append({
            'text': sent,
            'compound': round(s_compound, 4),
            'pos': round(s_scores['pos'], 4),
            'neg': round(s_scores['neg'], 4),
            'neu': round(s_scores['neu'], 4),
            'label': s_label,
        })

    # Mixed content note: keep overall label from compound (highest sentiment); just note mixed parts in summary
    if 'Positive' in labels_in_text and 'Negative' in labels_in_text:
        summary_extra = " The text contains both positive and negative parts."
    else:
        summary_extra = ""

    # 3. Word Statistics (Frequency of repeated words)
    # Use simple tokenization for counting
    tokens = word_tokenize(text.lower())
    # Filter out punctuation
    words_only = [word for word in tokens if word not in string.punctuation]
    stop_words = set(stopwords.words('english'))
    # Filter out stopwords for "interesting" word counts, or keep them? 
    # Valid requirement: "repeated words with their count". Usually implies meaningful words.
    filtered_words = [word for word in words_only if word not in stop_words]
    
    word_counts = Counter(filtered_words)
    # Get ALL words sorted by frequency
    top_words = word_counts.most_common()
    
    # 4. Sentiment highlighting with negation awareness (preserve original casing for display)
    lexicon = sid.lexicon
    tokens_raw = word_tokenize(text)  # original case for display
    highlighted_text = []
    for i, word in enumerate(tokens_raw):
        lower_word = word.lower()
        score = lexicon.get(lower_word, 0)
        category = 'neutral'
        if score >= 0.05:
            category = 'pos'
        elif score <= -0.05:
            category = 'neg'
        prev_lower = tokens_raw[i - 1].lower() if i > 0 else ''
        negated = prev_lower in NEGATION_WORDS
        highlighted_text.append({
            'word': word,
            'category': category,
            'score': score,
            'negated': negated,
        })

    # 5. Text statistics
    words_only = [w for w in word_tokenize(text) if w not in string.punctuation]
    text_stats = {
        'word_count': len(words_only),
        'sentence_count': len(sentence_sentiments),
        'char_count': len(text),
    }

    # 6. Sentiment strength (finer tiers)
    abs_compound = abs(compound)
    if abs_compound >= 0.7:
        strength = 'Very strong'
    elif abs_compound >= 0.5:
        strength = 'Strong'
    elif abs_compound >= 0.2:
        strength = 'Moderate'
    else:
        strength = 'Weak'

    # 7. Sentiment clarity (how clear vs ambiguous the sentiment is)
    neu = scores['neu']
    if neu >= 0.75:
        sentiment_clarity = 'ambiguous'
    elif neu >= 0.5 or abs_compound < 0.2:
        sentiment_clarity = 'moderate'
    else:
        sentiment_clarity = 'clear'

    # 8. Human-readable summary (overall = highest sentiment; summary_extra notes if mixed)
    strength_lower = strength.lower()
    label_lower = label.lower()
    summary = f"The text is {strength_lower} {label_lower}." + summary_extra

    # 9. Top positive and negative words (from VADER lexicon, found in text)
    top_pos = [{'word': t['word'], 'score': round(t['score'], 3)} for t in highlighted_text if t['category'] == 'pos']
    top_neg = [{'word': t['word'], 'score': round(t['score'], 3)} for t in highlighted_text if t['category'] == 'neg']
    top_pos.sort(key=lambda x: -x['score'])
    top_neg.sort(key=lambda x: x['score'])
    top_positive_words = top_pos[:10]
    top_negative_words = top_neg[:10]

    # 10. Score descriptions (for UI tooltips)
    score_descriptions = {
        'pos': 'Proportion of text that is positive (0–1).',
        'neg': 'Proportion of text that is negative (0–1).',
        'neu': 'Proportion of text that is neutral (0–1).',
        'compound': 'Overall sentiment from -1 (most negative) to +1 (most positive).',
    }

    result = {
        'compound': compound,
        'pos': scores['pos'],
        'neg': scores['neg'],
        'neu': scores['neu'],
        'label': label,
        'strength': strength,
        'summary': summary,
        'text_stats': text_stats,
        'sentiment_clarity': sentiment_clarity,
        'sentence_sentiments': sentence_sentiments,
        'score_descriptions': score_descriptions,
        'top_positive_words': top_positive_words,
        'top_negative_words': top_negative_words,
        'preprocessed_text': preprocess_text(text),
        'word_stats': top_words,
        'highlighted_tokens': highlighted_text,
    }

    return result
