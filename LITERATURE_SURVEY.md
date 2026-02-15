# Literature Survey  
## Sentiment Analysis in Opinion Mining

**Assignment 2 – Part B (5 Marks)**  
**Topic:** Sentiment Analysis in Opinion Mining  
**Course:** NLP Applications (S1-25_AIMLCZG519)

---

## 1. Introduction

**Opinion mining** (also called sentiment analysis) is the computational study of people’s opinions, attitudes, and emotions toward entities such as products, services, events, or topics. **Sentiment analysis** is the core task within opinion mining that classifies the polarity of text (e.g. positive, negative, or neutral) and often the strength or subjectivity of the sentiment. This survey summarizes key concepts, methods, and recent research directions in sentiment analysis in the context of opinion mining.

---

## 2. Definitions and Scope

- **Opinion mining:** Extracting, aggregating, and summarizing subjective information from text (reviews, social media, news). It includes identifying opinion holders, targets (aspects/entities), and the sentiment expressed.
- **Sentiment analysis:** Determining the polarity (positive/negative/neutral) and sometimes the intensity or emotion (joy, anger, sadness) of a piece of text. It can be done at document, sentence, or aspect level.
- **Subjectivity detection:** Separating factual (objective) from opinionated (subjective) text before or alongside polarity classification.

Sentiment analysis in opinion mining is used in brand monitoring, customer feedback analysis, political and social trend analysis, and recommendation systems.

---

## 3. Levels of Analysis

Research and applications typically distinguish:

- **Document-level:** One polarity label per document (e.g. whole review). Assumes the document expresses a single overall opinion.
- **Sentence-level:** Polarity per sentence. Handles documents that mix positive and negative statements.
- **Aspect-level (target-based):** Sentiment per aspect or entity (e.g. “battery” positive, “screen” negative in a phone review). Requires aspect extraction and aspect–sentiment association.

Most early work was document- or sentence-level; aspect-level sentiment has become a major focus with the growth of review and social data.

---

## 4. Approaches and Techniques

### 4.1 Lexicon-Based Methods

- Use sentiment lexicons (word lists with polarity and sometimes strength). Examples: VADER, SentiWordNet, AFINN, Opinion Lexicon.
- **Pros:** No training data, interpretable, fast, good for social and informal text when the lexicon is tuned (e.g. VADER).
- **Cons:** Limited to known words; hard to capture context, negation, and domain-specific usage without extra rules or resources.

### 4.2 Machine Learning (Traditional)

- Treat sentiment as a classification task. Use hand-crafted or bag-of-words features (n-grams, TF-IDF) with classifiers such as Naive Bayes, SVM, or MaxEnt.
- **Pros:** Can learn from data and adapt to domain; well-understood pipelines.
- **Cons:** Feature engineering; limited ability to capture long-range context and subtle negation.

### 4.3 Deep Learning and Pre-trained Models

- **RNNs/LSTMs/GRUs:** Model sequences; can capture context and negation better than bag-of-words.
- **CNNs:** Use n-gram-like filters over word embeddings for sentence classification.
- **Transformers and BERT-style models:** Pre-trained on large corpora; fine-tuned for sentiment. State-of-the-art on many benchmarks; can capture complex context and domain shift when fine-tuned.
- **Pros:** High accuracy; less manual feature design; good transfer with pre-training.
- **Cons:** Need more data and compute; less interpretable; risk of overfitting on small or biased datasets.

### 4.4 Hybrid and Rule-Based Components

- Combine lexicons with rules (negation, intensifiers, modals) or with ML/deep learning. Often used in industry for robustness and explainability.
- Aspect-level systems often combine aspect extraction (e.g. NER, dependency parsing, or sequence models) with sentiment classification per aspect.

---

## 5. Challenges in Sentiment Analysis and Opinion Mining

- **Negation:** “Not good” should be negative. Handled by lexicons (e.g. VADER), rules, or learned by sequence models.
- **Sarcasm and irony:** Surface form may be positive while intent is negative. Requires context and sometimes extra signals (e.g. user history, community norms).
- **Domain and language:** A word’s sentiment can depend on domain (e.g. “unpredictable” in movies vs. cars). Multilingual sentiment needs parallel or low-resource methods.
- **Aspect vs. overall:** A review can be positive overall but negative on one aspect; aspect-level methods are needed for fine-grained mining.
- **Data imbalance and bias:** Real-world data are often imbalanced (e.g. more positive reviews); models can inherit and amplify bias if not carefully designed and evaluated.
- **Temporal and evolving language:** Slang and new expressions (e.g. in social media) require updated lexicons or models.

---

## 6. Datasets and Evaluation

- Common benchmarks: IMDb movie reviews, Amazon product reviews, SST (Stanford Sentiment Treebank), SemEval aspect-based sentiment tasks, Twitter/social datasets.
- Metrics: Accuracy, F1 (macro/micro), precision/recall; for aspect-level, exact match or sentiment accuracy per aspect.
- Evaluation must consider domain, language, and level (document/sentence/aspect) to compare methods fairly.

---

## 7. Applications

- **Business:** Product and service reviews, brand monitoring, customer support prioritization, market research.
- **Social and political:** Public opinion on policies, elections, and social issues from social media and news.
- **Recommendation and search:** Using sentiment to rank or filter content, or to explain recommendations.
- **Finance:** Sentiment from news and social media for trading or risk signals (with appropriate caution and regulation).

---

## 8. Recent Trends and Future Directions

- **Pre-trained language models:** BERT, RoBERTa, and domain-specific variants are standard baselines; research focuses on efficiency, few-shot learning, and robustness.
- **Multimodal sentiment:** Combining text with audio, video, or images (e.g. in social and customer videos).
- **Explainability and fairness:** Interpretable predictions (e.g. attention, rationales) and mitigating demographic and cultural bias.
- **Low-resource and multilingual:** Few-shot and zero-shot sentiment; cross-lingual transfer and models for under-resourced languages.
- **Real-time and scalable systems:** Efficient models and APIs for streaming and large-scale opinion mining in production.

---

## 9. Conclusion

Sentiment analysis is a central task in opinion mining, with applications from commerce to social and political analysis. Research has evolved from lexicon and traditional ML to deep learning and pre-trained transformers, with increasing attention to aspect-level analysis, negation, sarcasm, multilinguality, and fairness. Practical systems often combine lexicons, rules, and learned models. Future work will likely emphasize efficiency, robustness, explainability, and better handling of multilingual and multimodal opinion data.

---

## 10. References (Representative Works)

*(Include full references when preparing the PDF. Examples of important directions:)*

- Liu, B. (2012). Sentiment Analysis and Opinion Mining. Synthesis Lectures on Human Language Technologies.
- Pang, B., & Lee, L. (2008). Opinion Mining and Sentiment Analysis. Foundations and Trends in Information Retrieval.
- Hutto, C., & Gilbert, E. (2014). VADER: A Parsimonious Rule-based Model for Sentiment Analysis of Social Media Text. ICWSM.
- Devlin, J., et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding. NAACL.
- Zhang, L., et al. (2018). Aspect-based Sentiment Analysis with Aspect-specific Graph Convolutional Networks. EMNLP.

*(Expand with additional papers from IEEE, ACM, ACL, EMNLP, and domain-specific venues as per your course requirements.)*

---

*This literature survey is the Part B deliverable. Export this document to PDF for submission as “A well-documented literature review” (Assignment 2 – Part B).*
