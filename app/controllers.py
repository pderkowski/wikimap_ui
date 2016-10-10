from flask import render_template, request, url_for, jsonify, Blueprint, current_app, g
from app.models import data
import helpers
import logging

bp = Blueprint('routes', __name__, template_folder='templates', static_folder='static')

def doSearch(query, index, limit):
    queryResults = index.search(query, limit)
    current_app.logger.debug('Query: {} yielded {}'.format(query, queryResults[:]))
    json = jsonify(queryResults)
    current_app.logger.debug('Returning: {} '.format(json))
    return json

@bp.before_request
def before_request():
    g.termIndex = current_app.termIndex
    g.pointIndex = current_app.pointIndex
    g.categoryIndex = current_app.categoryIndex

@bp.route("/")
def renderChart():
    if not request.script_root:
        request.script_root = url_for('routes.renderChart', _external=True)
    return render_template('chart.html')

@bp.route("/bounds")
def getBounds():
    range_ = data.getBounds()
    depth = data.getMaxDepth()
    return jsonify({ 'range': helpers.serializeRange(range_), 'maxDepth': depth })

@bp.route("/points!<int:xIndex>!<int:yIndex>!<int:zoomLevel>")
def getPoints(xIndex, yIndex, zoomLevel):
    requestedIndex = helpers.deserializeIndex(xIndex, yIndex, zoomLevel)
    datapoints = data.getDatapoints(requestedIndex)
    current_app.logger.debug('Returning {} datapoints for ({},{},{}).'.format(len(datapoints), requestedIndex.x, requestedIndex.y, requestedIndex.level))
    return jsonify(helpers.serializeDatapoints(datapoints))

@bp.route('/search')
def search():
    query = request.args.get('title')
    return doSearch(query, g.termIndex, limit=5)

@bp.route('/point')
def getPoint():
    query = request.args.get('title')
    return doSearch(query, g.pointIndex, limit=1)

@bp.route('/category')
def getCategory():
    query = request.args.get('title')
    return doSearch(query, g.categoryIndex, limit=1)