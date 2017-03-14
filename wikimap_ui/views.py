from flask import render_template, request, url_for, jsonify, Blueprint, current_app, g, redirect, abort
from models import Zoom
from utils import prepareDatapoints, prepareBasicDatapoints, prepareBounds

main = Blueprint('main', __name__, template_folder='templates', static_folder='static')

@main.route("/")
def index():
    return redirect(url_for('wikimap.wikimap_index', lang='en'))

wikimap = Blueprint('wikimap', __name__, template_folder='templates', static_folder='static', url_prefix='/<lang>')

@wikimap.before_request
def before_request(*args, **kwargs):
    g.lang = request.view_args.pop('lang')
    try:
        g.data = current_app.data[g.lang]
    except KeyError:
        abort(404)

@wikimap.route("/")
def wikimap_index():
    if not request.script_root:
        request.script_root = url_for('wikimap.wikimap_index', lang=g.lang, _external=True)
    return render_template('wikimap.html')

@wikimap.route("/bounds")
def get_bounds():
    bounds = g.data.getBounds()
    return jsonify(prepareBounds(bounds))

@wikimap.route("/points!<int:x>!<int:y>!<int:z>")
def get_points(x, y, z):
    current_app.logger.debug(u'Requested tile: ({},{},{}).'.format(x, y, z))
    datapoints = g.data.getDatapointsByZoom(Zoom(x, y, z))
    current_app.logger.debug(u'Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(prepareBasicDatapoints(datapoints))

@wikimap.route('/search')
def get_search():
    term = request.args.get('term')
    pages = g.data.searchPages(term, 5)
    categories = g.data.searchCategories(term, 5)
    current_app.logger.debug(u'Searching for: {}'.format(term))
    return jsonify(pages + categories)

@wikimap.route('/point')
def get_point():
    title = request.args.get('title')
    datapoint = g.data.getDatapointByTitle(title)
    return jsonify(prepareBasicDatapoints([datapoint])[0])

@wikimap.route('/details')
def get_details():
    title = request.args.get('title')
    datapoint = g.data.getDatapointByTitle(title)
    return jsonify(prepareDatapoints([datapoint])[0])

@wikimap.route('/inlinks')
def get_inlinks():
    title = request.args.get('title')
    linkIds = g.data.getInlinksByTitle(title)
    datapoints = g.data.getDatapointsByIds(linkIds)
    current_app.logger.debug(u'Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(prepareBasicDatapoints(datapoints))

@wikimap.route('/outlinks')
def get_outlinks():
    title = request.args.get('title')
    linkIds = g.data.getOutlinksByTitle(title)
    datapoints = g.data.getDatapointsByIds(linkIds)
    current_app.logger.debug(u'Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(prepareBasicDatapoints(datapoints))

@wikimap.route('/category')
def get_category():
    category = request.args.get('title')
    current_app.logger.debug(u'Requested category: {}'.format(category))
    datapoints = g.data.getDatapointsByCategory(category)
    current_app.logger.debug(u'Returning {} datapoints.'.format(len(datapoints)))
    return jsonify(prepareBasicDatapoints(datapoints))
