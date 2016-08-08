from flask import jsonify

def boundsToJSON(bounds):
    return jsonify({ 'xMin': bounds.topLeft.x, 'yMin': bounds.topLeft.y, 'xMax': bounds.bottomRight.x, 'yMax': bounds.bottomRight.y })

def pointsToJSON(points):
    return jsonify({ 'x': [p[0] for p in points], 'y': [p[1] for p in points] })