import os
from flask import Flask
from utils import MyEncoder

def createApp(dataPath):
    app = Flask(__name__)

    from app.models.data import Data
    app.data = Data(dataPath)

    from app.controllers import bp
    app.register_blueprint(bp)

    app.secret_key = os.urandom(24)
    app.json_encoder = MyEncoder

    return app
