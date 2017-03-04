from elasticsearch import Elasticsearch
from elasticsearch import helpers
from itertools import imap
import logging

logger = logging.getLogger(__name__)

class Terms(object):
    def __init__(self):
        self._client = Elasticsearch()
        self._index_name = 'terms'

    def add(self, data):
        logger.info('Adding terms...')

        documents = imap(lambda (term, is_category, rank): {
                '_index': self._index_name,
                '_type': 'term',
                'term': term.replace('_', ' '),
                'category': is_category,
                'rank': rank
            }, data)

        helpers.bulk(self._client, documents)
        logger.info('Refreshing index...')
        self._client.indices.refresh(index=self._index_name)

    def search(self, query, size):
        request_body = {
            "query": {
                "function_score": {
                    "query": {
                        "match": {
                            "term": {
                                "query": query,
                                "operator": "and"
                            }
                        }
                    },
                    "field_value_factor": {
                        "field": "rank"
                    }
                }
            }
        }
        response = self._client.search(index=self._index_name, body=request_body, size=size)
        return self._extract_data_from_search_result(response)

    def reset_index(self):
        logger.info('Reseting index...')
        if self._index_exists():
            self._delete_index()
        self._create_index()

    def _index_exists(self):
        return self._client.indices.exists(self._index_name)

    def _delete_index(self):
        logger.info('Deleting index...')
        self._client.indices.delete(index=self._index_name)

    def _create_index(self):
        logger.info('Creating index...')

        request_body = {
            "settings": {
                "number_of_shards": 1,
                "analysis": {
                    "filter": {
                        "autocomplete_filter": {
                            "type":     "edge_ngram",
                            "min_gram": 1,
                            "max_gram": 15
                        },
                        "my_asciifolding" : {
                            "type" : "asciifolding",
                            "preserve_original" : True
                        }
                    },
                    "analyzer": {
                        "autocomplete_index": {
                            "type":      "custom",
                            "tokenizer": "standard",
                            "filter": [
                                "lowercase",
                                "my_asciifolding",
                                "autocomplete_filter"
                            ]
                        }
                    }
                }
            },
            'mappings': {
                'term': {
                    'properties': {
                        'term': {
                            'index': 'analyzed',
                            'analyzer': 'autocomplete_index',
                            'search_analyzer': 'standard',
                            'type': 'string',
                            "index_options": "docs" # ignore term frequency
                        },
                        'category': {
                            'index': 'not_analyzed',
                            'type': 'boolean'
                        },
                        'rank': {
                            'index': 'not_analyzed',
                            'type': 'double'
                        }
                    }
                }
            }
        }
        self._client.indices.create(index=self._index_name, body=request_body)

    @staticmethod
    def _extract_data_from_search_result(response):
        return [(hit['_source']['term'], hit['_source']['category']) for hit in response['hits']['hits']]

# def get_test_data(size):
#     import random
#     import string

#     for _ in xrange(size):
#         random_string = ''.join(random.choice(string.ascii_lowercase) for _ in range(15))
#         yield (random_string, True)

# def main():
#     logging.basicConfig(level=logging.INFO)
#     terms = Terms()
#     terms.reset_index()
#     terms.add(get_test_data(10000))
#     hits = terms.search('ab', 5)
#     for h in hits:
#         logger.info(h)

# if __name__ == '__main__':
#     main()
