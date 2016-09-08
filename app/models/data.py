import random
import zoom
from zoom import Zoom, Range, Point2D, Index
from flask import current_app

class Data(object):
    def __init__(self):
        self.zoom = None

    def load(self, fileName):
        print 'Loading data from {}...'.format(fileName)
        points = []
        data = []
        with open(fileName, 'r') as file:
            for line in file:
                words = line.split()
                x = float(words[0])
                y = float(words[1])
                name = words[2][1:-1].replace('_', ' ') # skip quotes and replace underscores with spaces for natural presentation
                points.append(Point2D(x, y))
                data.append(zoom.Data(name))

        print 'Loaded {} points.'.format(len(points))

        print 'Creating zoom object...'

        self.zoom = Zoom(points, data, 100)

        print 'Created zoom object with max depth {}.'.format(self.zoom.getMaxDepth())

    def getDatapoints(self, index):
        return self.zoom.getDatapoints(index)

    def getBounds(self):
        return self.zoom.getBounds()

    def getMaxDepth(self):
        return self.zoom.getMaxDepth()

data = Data()