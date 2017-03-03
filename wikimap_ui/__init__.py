import os
from flask import Flask
from utils import MyEncoder, SelectColumns
from itertools import izip, repeat

def create_app(data_path):
    app = Flask(__name__)

    from app.models.data import Data
    app.data = Data(data_path)

    from app.controllers import bp
    app.register_blueprint(bp)

    app.secret_key = os.urandom(24)
    app.json_encoder = MyEncoder

    return app

def init_term_index(data_path):
    from app.models.data import Data
    data = Data(data_path)

    from app.models.terms import Terms
    terms = Terms()
    terms.reset_index()
    terms.add(izip(SelectColumns(0)(data.getDatapointTitles()), repeat(False)))
    terms.add(izip(SelectColumns(0)(data.getCategoryTitles()), repeat(True)))
