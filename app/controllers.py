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
    range_ = data.getBounds()
    return jsonify(helpers.unpackRange(range_))

@bp.route("/points!<float:xMin>!<float:yMin>!<float:xMax>!<float:yMax>")
def getPoints(xMin, yMin, xMax, yMax):
    range_ = helpers.packRange(xMin, yMin, xMax, yMax)
    points = data.getPoints(range_)
    unpacked = helpers.unpackPoints(points)
    json = jsonify(unpacked)
    current_app.logger.debug('Returning {} points.'.format(len(points)))
    return json

@bp.route("/grid!<float:xMin>!<float:yMin>!<float:xMax>!<float:yMax>!<int:zoomLevel>")
def getGrid(xMin, yMin, xMax, yMax, zoomLevel):
    range_ = helpers.packRange(xMin, yMin, xMax, yMax)
    axes = data.getGrid(range_, zoomLevel)
    json = jsonify(helpers.unpackAxes(axes))
    current_app.logger.debug('Returning axes: {}x{}.'.format(len(axes.x), len(axes.y)))
    return json