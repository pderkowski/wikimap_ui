from flask import render_template, request, url_for, jsonify, Blueprint, current_app
from app.models import data, index
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
    query = request.args.get('term')
    queryResults = index.search(query)
    current_app.logger.debug('SearchBox query: {} yielded {}'.format(query, queryResults[:]))
    json = jsonify(queryResults)
    current_app.logger.debug('Returning: {} '.format(json))
    return json
