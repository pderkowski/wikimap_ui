#!/usr/bin/env python
import unittest
from app.model.zoom import Point2D, Point3D, Range, Zoom, Index

def contains(containing, contained):
    return all(p in containing for p in contained)

def equals(pointList1, pointList2):
    return contains(pointList1, pointList2) and contains(pointList2, pointList1)

class TestPoint2D(unittest.TestCase):
    def test_accessors(self):
        point = Point2D(1.0, 1.0, "abc")
        self.assertEqual(point.x, 1.0)
        self.assertEqual(point.y, 1.0)
        self.assertEqual(point.name, "abc")

        point.x = 2.0
        point.y = 2.0
        point.name = "cba"

        self.assertEqual(point.x, 2.0)
        self.assertEqual(point.y, 2.0)
        self.assertEqual(point.name, "cba")

    def test_equality(self):
        point = Point2D(1, 1)
        point2 = Point2D(1, 1)

        self.assertTrue(point == point2)

class TestPoint3D(unittest.TestCase):
    def test_accessors(self):
        point = Point3D(1.0, 1.0, 1.0, "abc")
        self.assertEqual(point.x, 1.0)
        self.assertEqual(point.y, 1.0)
        self.assertEqual(point.z, 1.0)
        self.assertEqual(point.name, "abc")

        point.x = 2.0
        point.y = 2.0
        point.z = 2.0
        point.name = "cba"

        self.assertEqual(point.x, 2.0)
        self.assertEqual(point.y, 2.0)
        self.assertEqual(point.z, 2.0)
        self.assertEqual(point.name, "cba")

    def test_equality(self):
        point = Point3D(1, 1, 1)
        point2 = Point3D(1, 1, 1)

        self.assertTrue(point == point2)

class TestZoom(unittest.TestCase):
    def test_getPoints(self):
        points = [Point2D(0, 0), Point2D(1, 0), Point2D(1, 1), Point2D(0, 1)]
        z = Zoom(points, 100)

        index = Index(0, 0, 0)
        points2 = z.getPoints(index)
        self.assertTrue(equals(points, points2))

    def test_getMaxDepth(self):
        points = [Point2D(0, 0), Point2D(1, 0), Point2D(1, 1), Point2D(0, 1)]
        z = Zoom(points, 100)

        self.assertEqual(z.getMaxDepth(), 0)

class TestRange(unittest.TestCase):
    def test_accessors(self):
        p1 = Point2D(0, 0)
        p2 = Point2D(1, 1)
        range_ = Range(p1, p2)

        self.assertEqual(range_.topLeft, p1)
        self.assertEqual(range_.bottomRight, p2)

class TestIndex(unittest.TestCase):
    def test_accessors(self):
        index = Index(1, 2, 3)

        self.assertEqual(index.x, 1)
        self.assertEqual(index.y, 2)
        self.assertEqual(index.level, 3)

    def test_equality(self):
        index = Index(1, 2, 3)
        index2 = Index(1, 2, 3)

        self.assertTrue(index, index2)

if __name__ == '__main__':
    unittest.main()
