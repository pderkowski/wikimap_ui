from flask import render_template, request, url_for, jsonify, Blueprint, current_app
from app.model import data
import helpers
import logging

bp = Blueprint('routes', __name__, template_folder='templates', static_folder='static')

@bp.route("/")
def renderChart():
    if not request.script_root:
        request.script_root = url_for('routes.renderChart', _external=True)
    return render_template('chart.html')

@bp.route("/bounds")
def getBounds():
    bounds = data.getEnclosingBounds()
    unpacked = helpers.unpackBounds(bounds)
    return jsonify(unpacked)

@bp.route("/points!<float:xMin>!<float:yMin>!<float:xMax>!<float:yMax>")
def getPoints(xMin, yMin, xMax, yMax):
    bounds = helpers.packBounds(xMin, yMin, xMax, yMax)
    points = data.getPointsSortedByX(bounds)
    unpacked = helpers.unpackPoints(points)
    json = jsonify(unpacked)
    current_app.logger.debug('Returning {} points.'.format(len(points)))
    return json