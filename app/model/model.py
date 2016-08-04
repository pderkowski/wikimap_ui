import random

def getSortedData(pointsNo):
    tuples = [(random.random(), random.random(), "a") for i in xrange(pointsNo)]
    tuples = sorted(tuples, key=lambda x: x[0])
    return { 'x': [t[0] for t in tuples], 'y': [t[1] for t in tuples], 'titles': [t[2] for t in tuples] }