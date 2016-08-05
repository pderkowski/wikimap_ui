import random

class Point(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def toDict(self):
        return { 'x': self.x, 'y': self.y }

class Bounds(object):
    def __init__(self, topLeft, bottomRight):
        self.topLeft = topLeft
        self.bottomRight = bottomRight

    def toDict(self):
        return { 'topLeft': self.topLeft.toDict(), 'bottomRight': self.bottomRight.toDict() }

def getSortedData(pointsNo):
    tuples = [(random.random(), random.random(), "a") for i in xrange(pointsNo)]
    tuples = sorted(tuples, key=lambda x: x[0])
    return { 'x': [t[0] for t in tuples], 'y': [t[1] for t in tuples], 'titles': [t[2] for t in tuples] }

initialBounds = Bounds(Point(0.0, 0.0), Point(1.0, 1.0))

def getInitialBounds():
    return initialBounds.toDict()