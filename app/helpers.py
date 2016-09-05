from flask import jsonify
from models import Point2D, Range, Index

def serializeRange(range_):
    tl = range_.topLeft
    br = range_.bottomRight
    return { 'xMin': tl.x, 'yMin': tl.y, 'xMax': br.x, 'yMax': br.y }

def serializeDatapoints(datapoints):
    return [{ 'x': d.point.x, 'y': d.point.y, 'z': d.point.z, 'name': d.data.name } for d in datapoints]

def deserializeRange(xMin, yMin, xMax, yMax):
    tl = Point2D(xMin, yMin)
    br = Point2D(xMax, yMax)
    return Range(tl, br)

def deserializeIndex(xIndex, yIndex, zoomLevel):
    return Index(xIndex, yIndex, zoomLevel)

def serializeIndex(index):
    return [index.x, index.y, index.level]
