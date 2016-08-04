from app import app
from flask import render_template, request, url_for, jsonify

@app.route("/")
def chart():
    if not request.script_root:
        # this assumes that the 'index' view function handles the path '/'
        request.script_root = url_for('chart', _external=True)
    return render_template('chart.html')

@app.route("/data")
def data():
    return jsonify({ 'x': [0, 1, 2, 3, 4, 5], 'y': [0, 1, 2, 3, 4, 5], 'title': ['a', 'b', 'c', 'd', 'e', 'f']})