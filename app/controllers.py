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

@bp.route("/data")
def getData():
    points = data.getPointsSortedByX()
    bounds = data.getEnclosingBounds()
    json = jsonify({ 'bounds': helpers.unpackBounds(bounds), 'points': helpers.unpackPoints(points) })

    current_app.logger.debug(json)

    return json