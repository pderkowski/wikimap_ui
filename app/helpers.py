from flask import jsonify
from model import Point, Bounds

def unpackBounds(bounds):
    tl = bounds.getTopLeftCorner()
    br = bounds.getBottomRightCorner()
    return { 'xMin': tl.x, 'yMin': tl.y, 'xMax': br.x, 'yMax': br.y }

def unpackPoints(points):
    return [{ 'x': p.x, 'y': p.y } for p in points]

def packBounds(xMin, yMin, xMax, yMax):
    tl = Point(xMin, yMin)
    br = Point(xMax, yMax)
    return Bounds(tl, br)