import os
from flask import Flask

def createApp(pointsPath, categoriesPath):
    app = Flask(__name__)

    from app.models import data
    data.load(pointsPath)

    termIdxPath = os.path.join('indices', "termIdx")
    pointIdxPath = os.path.join("indices", "pointIdx")
    categoryIdxPath = os.path.join("indices", "categoryIdx")

    from app.models import TermIndex, PointIndex, CategoryIndex

    app.termIndex = TermIndex(termIdxPath, pointsPath, categoriesPath).load()
    app.pointIndex = PointIndex(pointIdxPath, pointsPath).load()
    app.categoryIndex = CategoryIndex(categoryIdxPath, categoriesPath).load()

    from app.controllers import bp

    app.register_blueprint(bp)

    app.secret_key = os.urandom(24)

    return app