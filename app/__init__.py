from flask import Flask

def createApp(dataPath):
    app = Flask(__name__)

    from app.model import data
    data.load(dataPath)

    from app.controllers import bp
    app.register_blueprint(bp)

    return app