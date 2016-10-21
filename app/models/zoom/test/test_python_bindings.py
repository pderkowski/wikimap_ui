#!/usr/bin/env python
import unittest
from app.models.zoom import Point, Range, Zoom, Index, Datapoint

def contains(containing, contained):
    return all(p in containing for p in contained)

def equals(pointList1, pointList2):
    return contains(pointList1, pointList2) and contains(pointList2, pointList1)

class TestPoint2D(unittest.TestCase):
    def test_accessors(self):
        point = Point(1.0, 1.0)
        self.assertEqual(point.x, 1.0)
        self.assertEqual(point.y, 1.0)

        point.x = 2.0
        point.y = 2.0

        self.assertEqual(point.x, 2.0)
        self.assertEqual(point.y, 2.0)

    def test_equality(self):
        point = Point(1, 1)
        point2 = Point(1, 1)

        self.assertTrue(point == point2)

class TestDatapoint(unittest.TestCase):
    def test_accessors(self):
        point = Point(1, 1)
        id1 = 0
        datapoint = Datapoint(point, id1)

        self.assertTrue(datapoint.p == point)
        self.assertTrue(datapoint.id == id1)

        point2 = Point(2, 2)
        id2 = 0
        datapoint.p = point2
        datapoint.id = id2

        self.assertTrue(datapoint.p == point2)
        self.assertTrue(datapoint.id == id2)

class TestZoom(unittest.TestCase):
    def sampleZoom(self):
        datapoints = [Datapoint(0, 0, 0), Datapoint(1, 0, 1), Datapoint(1, 1, 2), Datapoint(0, 1, 3)]
        z = Zoom(datapoints, 100)

        return datapoints, z

    def test_getDatapoints(self):
        datapoints, z = self.sampleZoom()

        index = Index(0, 0, 0)
        self.assertTrue(equals(datapoints, z.getDatapoints(index)))

    def test_getMaxDepth(self):
        datapoints, z = self.sampleZoom()

        self.assertEqual(z.getMaxDepth(), 0)

class TestRange(unittest.TestCase):
    def test_accessors(self):
        p1 = Point(0, 0)
        p2 = Point(1, 1)
        range_ = Range(p1, p2)

        self.assertEqual(range_.topLeft, p1)
        self.assertEqual(range_.bottomRight, p2)

class TestIndex(unittest.TestCase):
    def test_accessors(self):
        index = Index(1, 2, 3)

        self.assertEqual(index.x, 1)
        self.assertEqual(index.y, 2)
        self.assertEqual(index.z, 3)

    def test_equality(self):
        index = Index(1, 2, 3)
        index2 = Index(1, 2, 3)

        self.assertTrue(index, index2)

if __name__ == '__main__':
    unittest.main()
