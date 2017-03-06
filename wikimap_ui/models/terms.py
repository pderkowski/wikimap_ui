from elasticsearch import Elasticsearch
from elasticsearch import helpers
from itertools import imap
from abc import ABCMeta, abstractproperty, abstractmethod
import logging

class ESDef(object):
    def __init__(self, name, body):
        self.name = name
        self.body = body

    def __call__(self):
        return {
            self.name: self.body
        }

class ESDefs(object):
    autocomplete_filter = ESDef('autocomplete_filter', {
        "type":     "edge_ngram",
        "min_gram": 1,
        "max_gram": 15
    })

    my_asciifolding_filter = ESDef('my_asciifolding_filter', {
        "type" : "asciifolding",
        "preserve_original" : True
    })

    autocomplete_analyzer = ESDef('autocomplete_analyzer', {
        "type":      "custom",
        "tokenizer": "standard",
        "filter": [
            "lowercase",
            my_asciifolding_filter.name,
            autocomplete_filter.name
        ]
    })

    @staticmethod
    def join(*defs):
        return dict(kv for d in defs for kv in d.items())

class TermIndex(object):
    __metaclass__ = ABCMeta

    def __init__(self):
        self._client = Elasticsearch()
        self._logger = logging.getLogger(__name__)

    @abstractproperty
    def index_name(self):
        pass

    @abstractmethod
    def _make_document(self, item):
        pass

    @abstractmethod
    def _make_search_request(self, query):
        pass

    @abstractmethod
    def _make_create_request(self):
        pass

    @abstractmethod
    def _extract_data_from_search_response(self, response):
        pass

    def add(self, data):
        self._logger.info(u'Adding documents to {}...'.format(self.index_name))
        helpers.bulk(self._client, imap(self._make_document, data))
        self._logger.info(u'Refreshing {}...'.format(self.index_name))
        self._client.indices.refresh(index=self.index_name)

    def search(self, query, size):
        self._logger.info(u'Searching for {} in {} (returning max {})'.format(query, self.index_name, size))
        request_body = self._make_search_request(query)
        response = self._client.search(index=self.index_name, body=request_body, size=size)
        return self._extract_data_from_search_response(response)

    def reset_index(self):
        self._logger.info(u'Reseting {}...'.format(self.index_name))
        if self._index_exists():
            self._delete_index()
        self._create_index()

    def _index_exists(self):
        return self._client.indices.exists(self.index_name)

    def _delete_index(self):
        self._logger.info(u'Deleting {}...'.format(self.index_name))
        self._client.indices.delete(index=self.index_name)

    def _create_index(self):
        self._logger.info(u'Creating {}...'.format(self.index_name))
        request_body = self._make_create_request()
        self._client.indices.create(index=self.index_name, body=request_body)

class PageIndex(TermIndex):
    def __init__(self):
        super(PageIndex, self).__init__()
        self._document_type_name = 'page'
        self._index_name = 'pages'

    @property
    def index_name(self):
        return self._index_name

    def _make_document(self, item):
        term, rank = item
        return {
            '_index': self._index_name,
            '_type': self._document_type_name,
            'term': term.replace('_', ' '),
            'rank': rank
        }

    def _make_search_request(self, query):
        return {
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

    def _make_create_request(self):
        return {
            "settings": {
                "number_of_shards": 1,
                "analysis": {
                    "filter": ESDefs.join(ESDefs.autocomplete_filter(), ESDefs.my_asciifolding_filter()),
                    "analyzer": ESDefs.autocomplete_analyzer()
                }
            },
            'mappings': {
                self._document_type_name: {
                    'properties': {
                        'term': {
                            'index': 'analyzed',
                            'analyzer': ESDefs.autocomplete_analyzer.name,
                            'search_analyzer': 'standard',
                            'type': 'string',
                            "index_options": "docs" # ignore term frequency
                        },
                        'rank': {
                            'index': 'not_analyzed',
                            'type': 'double'
                        }
                    }
                }
            }
        }

    def _extract_data_from_search_response(self, response):
        return [hit['_source']['term'] for hit in response['hits']['hits']]

class CategoryIndex(TermIndex):
    def __init__(self):
        super(CategoryIndex, self).__init__()
        self._document_type_name = 'category'
        self._index_name = 'categories'

    @property
    def index_name(self):
        return self._index_name

    def _make_document(self, item):
        term, size = item
        return {
            '_index': self._index_name,
            '_type': self._document_type_name,
            'term': term.replace('_', ' '),
            'size': size
        }

    def _make_search_request(self, query):
        return {
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
                        "field": "size",
                        "modifier": "log1p"
                    }
                }
            }
        }

    def _make_create_request(self):
        return {
            "settings": {
                "number_of_shards": 1,
                "analysis": {
                    "filter": ESDefs.join(ESDefs.autocomplete_filter(), ESDefs.my_asciifolding_filter()),
                    "analyzer": ESDefs.autocomplete_analyzer()
                }
            },
            'mappings': {
                self._document_type_name: {
                    'properties': {
                        'term': {
                            'index': 'analyzed',
                            'analyzer': ESDefs.autocomplete_analyzer.name,
                            'search_analyzer': 'standard',
                            'type': 'string',
                            "index_options": "docs" # ignore term frequency
                        },
                        'size': {
                            'index': 'not_analyzed',
                            'type': 'integer'
                        }
                    }
                }
            }
        }

    def _extract_data_from_search_response(self, response):
        return [(hit['_source']['term'], hit['_source']['size']) for hit in response['hits']['hits']]
