import os
from flask import Flask
from utils import MyEncoder, SelectColumns

def create_app(data_path):
    app = Flask(__name__)

    from models.data import Data
    app.data = Data(data_path)

    from views import wikimap, main
    app.register_blueprint(main)
    app.register_blueprint(wikimap)

    app.secret_key = os.urandom(24)
    app.json_encoder = MyEncoder

    return app
