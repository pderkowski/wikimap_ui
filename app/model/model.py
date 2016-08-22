import random
from zoom import Zoom, Range, Point, Index

class Data(object):
    def __init__(self):
        self.zoom = None

    def load(self, fileName):
        points = []
        with open(fileName, 'r') as file:
            for line in file:
                words = line.split()
                x = float(words[0])
                y = float(words[1])
                points.append(Point(x, y))

        self.zoom = Zoom(points, 100)

    def getPoints(self, index):
        return self.zoom.getPoints(index)

    def getBounds(self):
        return self.zoom.getBounds()

data = Data()