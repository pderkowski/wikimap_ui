from itertools import imap
from models import Datapoint, Bounds, SearchResult
from flask.json import JSONEncoder

def pipe(iterator, *transforms):
    for t in transforms:
        iterator = t(iterator)
    return iterator

class Object2Dict(object):
    def __init__(self, iterator):
        self.iterator = iterator

    def __iter__(self):
        return imap(vars, self.iterator)

class SelectColumns(object):
    def __init__(self, columns):
        self.columns = columns if isinstance(columns, list) else [columns]
        self.iterator = None

    def __call__(self, iterator):
        self.iterator = iterator
        return self

    def __iter__(self):
        def select(e):
            return {c: e[c] for c in self.columns}

        return imap(select, self.iterator)

class RenameColumns(object):
    def __init__(self, columns):
        self.columns = columns if isinstance(columns, list) else [columns]
        self.iterator = None

    def __call__(self, iterator):
        self.iterator = iterator
        return self

    def __iter__(self):
        def rename(e):
            for old, new in self.columns:
                e[new] = e.pop(old)
            return e

        return imap(rename, self.iterator)

def prepareDatapoints(datapoints):
    return pipe(datapoints, Object2Dict, list)

def prepareBasicDatapoints(datapoints):
    return pipe(prepareDatapoints(datapoints), SelectColumns(['id', 'title', 'x', 'y', 'z']), list)

def prepareBounds(bounds):
    return [[bounds.xMin, bounds.yMin], [bounds.xMax, bounds.yMax]]

class MyEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, (Datapoint, Bounds, SearchResult)):
            return o.__dict__
        else:
            return JSONEncoder.default(self, o)
