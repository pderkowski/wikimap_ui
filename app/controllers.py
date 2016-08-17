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

@bp.route("/points!<int:xIndex>!<int:yIndex>!<int:level>")
def getPoints(xIndex, yIndex, level):
    points = data.getPoints(xIndex, yIndex, level)
    unpacked = helpers.unpackPoints(points)
    json = jsonify(unpacked)
    current_app.logger.debug('Returning {} points.'.format(len(points)))
    return json