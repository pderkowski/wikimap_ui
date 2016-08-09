import random
from zoom import Zoom, Point

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

    def getPointsSortedByX(self, bounds):
        points = self.zoom.getPoints(bounds, 0)
        return sorted(points, key=lambda p: p.x)

    def getEnclosingBounds(self):
        return self.zoom.getEnclosingBounds()

data = Data()