from flask import render_template, request, url_for, jsonify, Blueprint, current_app, g
from models import Index
from adapters import basicDatapointInfo, fullDatapointsInfo

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
    bounds = g.data.getBounds()
    return jsonify(bounds)

@bp.route("/points!<int:xIndex>!<int:yIndex>!<int:zoomLevel>")
def getPoints(xIndex, yIndex, zoomLevel):
    current_app.logger.debug('Requested tile: ({},{},{}).'.format(xIndex, yIndex, zoomLevel))
    datapoints = g.data.getDatapointsByIndex(Index(xIndex, yIndex, zoomLevel))
    current_app.logger.debug('Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(basicDatapointInfo(datapoints))

@bp.route('/search')
def search():
    term = request.args.get('title')
    similars = g.data.getSimilarTerms(term, 5)
    current_app.logger.debug('Searching for: {}'.format(term))
    return jsonify(similars)

@bp.route('/point')
def getPoint():
    title = request.args.get('title')
    datapoint = g.data.getDatapointByTitle(title)
    return jsonify(fullDatapointsInfo([datapoint])[0])

@bp.route('/category')
def getCategory():
    category = request.args.get('title')
    current_app.logger.debug('Requested category: {}'.format(category))
    datapoints = g.data.getDatapointsByCategory(category)
    current_app.logger.debug('Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(basicDatapointInfo(datapoints))
