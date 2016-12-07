import os
from flask import Flask

def createApp(dataPath):
    app = Flask(__name__)

    from app.models.data import Data
    app.data = Data(dataPath)

    from app.controllers import bp
    app.register_blueprint(bp)

    app.secret_key = os.urandom(24)

    return app