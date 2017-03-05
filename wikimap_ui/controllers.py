from flask import render_template, request, url_for, jsonify, Blueprint, current_app, g
from models import Zoom
from utils import prepareDatapoints, prepareBasicDatapoints, prepareBounds

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
    return jsonify(prepareBounds(bounds))

@bp.route("/points!<int:x>!<int:y>!<int:z>")
def getPoints(x, y, z):
    current_app.logger.debug(u'Requested tile: ({},{},{}).'.format(x, y, z))
    datapoints = g.data.getDatapointsByZoom(Zoom(x, y, z))
    current_app.logger.debug(u'Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(prepareBasicDatapoints(datapoints))

@bp.route('/search')
def search():
    term = request.args.get('term')
    pages = g.data.searchPages(term, 5)
    categories = g.data.searchCategories(term, 5)
    current_app.logger.debug(u'Searching for: {}'.format(term))
    return jsonify(pages + categories)

@bp.route('/point')
def getPoint():
    title = request.args.get('title')
    datapoint = g.data.getDatapointByTitle(title)
    return jsonify(prepareBasicDatapoints([datapoint])[0])

@bp.route('/details')
def getDetails():
    title = request.args.get('title')
    datapoint = g.data.getDatapointByTitle(title)
    return jsonify(prepareDatapoints([datapoint])[0])

@bp.route('/inlinks')
def getInlinks():
    title = request.args.get('title')
    linkIds = g.data.getInlinksByTitle(title)
    datapoints = g.data.getDatapointsByIds(linkIds)
    current_app.logger.debug(u'Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(prepareBasicDatapoints(datapoints))

@bp.route('/outlinks')
def getOutlinks():
    title = request.args.get('title')
    linkIds = g.data.getOutlinksByTitle(title)
    datapoints = g.data.getDatapointsByIds(linkIds)
    current_app.logger.debug(u'Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(prepareBasicDatapoints(datapoints))

@bp.route('/category')
def getCategory():
    category = request.args.get('title')
    current_app.logger.debug(u'Requested category: {}'.format(category))
    datapoints = g.data.getDatapointsByCategory(category)
    current_app.logger.debug(u'Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(prepareBasicDatapoints(datapoints))
