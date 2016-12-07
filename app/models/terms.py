import os
import shutil
from whoosh.fields import Schema, NGRAMWORDS, STORED, TEXT, ID
import whoosh
from whoosh.qparser import SimpleParser
import codecs
import cPickle
import urllib

class Term(object):
    def __init__(self, term, isCategory):
        self.term = term
        self.isCategory = isCategory

class Index(object):
    def __init__(self, idxPath):
        self._idxPath = idxPath
        self._storagePath = os.path.join(idxPath, 'storage.p')
        self._data = []
        self._nextKey = 0

    def load(self):
        if self._exists():
            self._load()
        else:
            self._create()

        return self

    def search(self, string, limit):
        query = self._parser.parse(self._normalize(string))

        with self._index.searcher() as searcher:
            results = searcher.search(query, limit=limit)
            return [self._describe(r) for r in results]

    def _exists(self):
        return os.path.isdir(self._idxPath)

    def _load(self):
        print 'Loading index {}'.format(self._idxPath)

        self._index = whoosh.index.open_dir(self._idxPath)
        self._data = cPickle.load(open(self._storagePath, 'rb'))
        self._nextKey = len(self._data)

    def _create(self):
        print 'Creating index {}'.format(self._idxPath)

        os.makedirs(self._idxPath)
        self._index = whoosh.index.create_in(self._idxPath, self._schema)
        open(self._storagePath, 'wb').close()

    def _addData(self, dataPath, extractor):
        print 'Adding data from {}'.format(dataPath)

        writer = self._index.writer(procs=4, limitmb=1024, multisegment=True)

        with codecs.open(dataPath, 'r', encoding='utf8') as file:
            for line in file:
                key, data = extractor(line)
                dataKey = self._storeData(data)
                writer.add_document(key=key, dataKey=dataKey)

        cPickle.dump(self._data, open(self._storagePath, 'wb'))
        writer.commit()

    def _storeData(self, value):
        self._data.append(value)
        self._nextKey += 1
        return self._nextKey - 1

    def _normalize(self, string):
        return urllib.unquote(string).replace(' ', '_')

    def _denormalize(self, string):
        return string.replace('_', ' ')

class TermIndex(Index):
    def __init__(self, idxPath, pointsPath, categoriesPath):
        super(TermIndex, self).__init__(idxPath)
        self._schema = Schema(key=NGRAMWORDS(minsize=2), dataKey=STORED)
        self._parser = SimpleParser('key', self._schema)
        self._pointsPath = pointsPath
        self._categoriesPath = categoriesPath

    def _create(self):
        def extractPoints(line):
            words = line.split()
            term = words[2]
            return term, (term, False) # data: term, isCategory

        def extractCategories(line):
            words = line.split()
            term = words[0]
            return term, (term, True) # data: term, isCategory

        super(TermIndex, self)._create()

        self._addData(self._pointsPath, extractPoints)
        self._addData(self._categoriesPath, extractCategories)

    def _describe(self, result):
        dataKey = result['dataKey']
        return Term(self._denormalize(self._data[dataKey][0]), self._data[dataKey][1])
