from app import app
from flask import render_template, request, url_for, jsonify
import model

@app.route("/")
def chart():
    if not request.script_root:
        # this assumes that the 'index' view function handles the path '/'
        request.script_root = url_for('chart', _external=True)
    return render_template('chart.html')

@app.route("/data")
def data():
    bounds = model.getInitialBounds()
    data = model.getSortedData(5)
    data['bounds'] = bounds
    return jsonify(data)