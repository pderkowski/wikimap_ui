import random
from zoom import Zoom, Range, Point2D, Index
from flask import current_app

class Data(object):
    def __init__(self):
        self.zoom = None

    def load(self, fileName):
        print 'Loading data from {}...'.format(fileName)
        points = []
        with open(fileName, 'r') as file:
            for line in file:
                words = line.split()
                x = float(words[0])
                y = float(words[1])
                name = words[2]
                points.append(Point2D(x, y, name))

        print 'Loaded {} points.'.format(len(points))

        print 'Creating zoom object...'

        self.zoom = Zoom(points, 100)

        print 'Created zoom object with max depth {}.'.format(self.zoom.getMaxDepth())

    def getPoints(self, index):
        return self.zoom.getPoints(index)

    def getBounds(self):
        return self.zoom.getBounds()

data = Data()