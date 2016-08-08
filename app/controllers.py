from flask import render_template, request, url_for, jsonify, Blueprint
from app.model import data
import helpers

bp = Blueprint('routes', __name__, template_folder='templates', static_folder='static')

@bp.route("/")
def chart():
    if not request.script_root:
        # this assumes that the 'index' view function handles the path '/'
        request.script_root = url_for('routes.chart', _external=True)
    return render_template('chart.html')

@bp.route("/data")
def data():
    points = data.getPointsSortedByX()
    bounds = data.getInitialBounds()
    return jsonify({ 'bounds': helpers.boundsToJSON(bounds), 'points': helpers.pointsToJSON(points) })