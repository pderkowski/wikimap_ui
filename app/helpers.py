from flask import jsonify

def unpackBounds(bounds):
    tl = bounds.getTopLeftCorner()
    br = bounds.getBottomRightCorner()
    return { 'xMin': tl.x, 'yMin': tl.y, 'xMax': br.x, 'yMax': br.y }

def unpackPoints(points):
    return { 'x': [p.x for p in points], 'y': [p.y for p in points] }