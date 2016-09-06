import os
from flask import Flask

def createApp(dataPath):
    app = Flask(__name__)

    from app.models import data
    data.load(dataPath)

    from app.models import index
    index.load(dataPath)

    from app.controllers import bp
    app.register_blueprint(bp)

    app.secret_key = os.urandom(24)

    return app