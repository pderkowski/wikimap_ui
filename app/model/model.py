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

    def getPointsSortedByX(self):
        points = self.zoom.getPoints(zoom.getInitialBounds(), 0)
        return sorted(points, key=lambda x: x[0])

    def getInitialBounds(self):
        return self.zoom.getInitialBounds()

data = Data()