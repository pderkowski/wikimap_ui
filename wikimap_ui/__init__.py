import os
from flask import Flask
from utils import MyEncoder, SelectColumns
from models.data import Data
from views import wikimap, main

def create_app(data_path):
    app = Flask(__name__)

    app.data = Data(data_path)
    app.register_blueprint(main)
    app.register_blueprint(wikimap)
    app.secret_key = os.urandom(24)
    app.json_encoder = MyEncoder

    return app
