# test_app.py
import unittest
import json
from app import app

class SentimentAppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Sentiment Analysis', response.data)

    def test_analyze_text_positive(self):
        data = {'text': 'I love this application! It is amazing and wonderful.'}
        response = self.app.post('/analyze', 
                                 data=json.dumps(data), 
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(result['label'], 'Positive')
        self.assertGreater(result['pos'], 0)

    def test_analyze_text_negative(self):
        data = {'text': 'I hate this. It is terrible and awful.'}
        response = self.app.post('/analyze', 
                                 data=json.dumps(data), 
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(result['label'], 'Negative')
        self.assertGreater(result['neg'], 0)

    def test_analyze_text_neutral(self):
        data = {'text': 'The book is on the table.'}
        response = self.app.post('/analyze', 
                                 data=json.dumps(data), 
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        # VADER might see this as neutral
        result = json.loads(response.data)
        self.assertEqual(result['label'], 'Neutral')

    def test_analyze_no_text(self):
        data = {'text': ''}
        response = self.app.post('/analyze', 
                                 data=json.dumps(data), 
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
