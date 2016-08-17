from flask import jsonify
from model import Point, Range

def unpackRange(range_):
    tl = range_.topLeft
    br = range_.bottomRight
    return { 'xMin': tl.x, 'yMin': tl.y, 'xMax': br.x, 'yMax': br.y }

def unpackPoints(points):
    return [{ 'x': p.x, 'y': p.y } for p in points]

def packRange(xMin, yMin, xMax, yMax):
    tl = Point(xMin, yMin)
    br = Point(xMax, yMax)
    return Range(tl, br)

def unpackAxes(axes):
    return { 'x': axes.x, 'y': axes.y }