from flask import jsonify
from model import Point, Range, Index

def serializeRange(range_):
    tl = range_.topLeft
    br = range_.bottomRight
    return { 'xMin': tl.x, 'yMin': tl.y, 'xMax': br.x, 'yMax': br.y }

def serializePoints(points):
    return [{ 'x': p.x, 'y': p.y, 'name': p.name } for p in points]

def deserializeRange(xMin, yMin, xMax, yMax):
    tl = Point(xMin, yMin)
    br = Point(xMax, yMax)
    return Range(tl, br)

def deserializeIndex(xIndex, yIndex, zoomLevel):
    return Index(xIndex, yIndex, zoomLevel)

def serializeIndex(index):
    return [index.x, index.y, index.level]