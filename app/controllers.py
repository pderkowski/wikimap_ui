from flask import render_template, request, url_for, jsonify, Blueprint, current_app, g
from app.models import data
import helpers
import logging

bp = Blueprint('routes', __name__, template_folder='templates', static_folder='static')

@bp.before_request
def before_request():
    g.data = current_app.data

@bp.route("/")
def renderChart():
    if not request.script_root:
        request.script_root = url_for('routes.renderChart', _external=True)
    return render_template('chart.html')

@bp.route("/bounds")
def getBounds():
    range_ = g.data.getBounds()
    depth = g.data.getMaxDepth()
    return jsonify({ 'range': helpers.serializeRange(range_), 'maxDepth': depth })

@bp.route("/points!<int:xIndex>!<int:yIndex>!<int:zoomLevel>")
def getPoints(xIndex, yIndex, zoomLevel):
    current_app.logger.debug('Requested tile: ({},{},{}).'.format(xIndex, yIndex, zoomLevel))
    requestedIndex = helpers.deserializeIndex(xIndex, yIndex, zoomLevel)
    datapoints = g.data.getDatapointsByIndex(requestedIndex)
    current_app.logger.debug('Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(helpers.serializeDatapoints(datapoints))

@bp.route('/search')
def search():
    term = request.args.get('title')
    similars = g.data.getSimilarTerms(term, 5)
    current_app.logger.debug('Searching for: {}'.format(term))
    json = jsonify(helpers.serializeTerms(similars))
    current_app.logger.debug('Returning: {} '.format(json))
    return json

@bp.route('/point')
def getPoint():
    query = request.args.get('title')
    return doSearch(query, g.pointIndex, limit=1)

@bp.route('/category')
def getCategory():
    category = request.args.get('title')
    current_app.logger.debug('Requested category: {}'.format(category))
    datapoints = g.data.getDatapointsByCategory(category)
    current_app.logger.debug('Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(helpers.serializeDatapoints(datapoints))