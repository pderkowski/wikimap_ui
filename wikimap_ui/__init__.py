import os
from flask import Flask
from utils import MyEncoder, SelectColumns

def create_app(data_path):
    app = Flask(__name__)

    from models.data import Data
    app.data = Data(data_path)

    from controllers import bp
    app.register_blueprint(bp)

    app.secret_key = os.urandom(24)
    app.json_encoder = MyEncoder

    return app
