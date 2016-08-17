#!/usr/bin/env python
import unittest
from app.model.zoom import Point, Range, Zoom

def contains(containing, contained):
    return all(p in containing for p in contained)

def equals(pointList1, pointList2):
    return contains(pointList1, pointList2) and contains(pointList2, pointList1)

class TestPoint(unittest.TestCase):
    def test_constructor(self):
        point = Point(1.0, 1.0)
        self.assertIs(type(point), Point)

    def test_accessors(self):
        point = Point(1.0, 1.0)
        self.assertEqual(point.x, 1.0)
        self.assertEqual(point.y, 1.0)

        point.x = 2.0
        point.y = 2.0

        self.assertEqual(point.x, 2.0)
        self.assertEqual(point.y, 2.0)

class TestZoom(unittest.TestCase):
    def test_constructor(self):
        points = [Point(0, 0), Point(1, 0), Point(1, 1), Point(0, 1)]
        z = Zoom(points, 100)
        self.assertIs(type(z), Zoom)

    def test_getPoints(self):
        points = [Point(0, 0), Point(1, 0), Point(1, 1), Point(0, 1)]
        z = Zoom(points, 100)

        points2 = z.getPoints(0, 0, 0)
        self.assertTrue(equals(points, points2))

    def test_getGrid(self):
        points = [Point(0, 0), Point(1, 0), Point(1, 1), Point(0, 1)]
        z = Zoom(points, 100)

        range_ = Range(Point(-0.5, -0.5), Point(1.5, 1.5))

        axes = z.getGrid(range_, 0)

        self.assertEqual(len(axes.x), 4)
        self.assertEqual(len(axes.y), 4)


if __name__ == '__main__':
    unittest.main()