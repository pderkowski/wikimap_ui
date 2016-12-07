import random
import os
from flask import current_app
from terms import TermIndex
from datapoints import Datapoints
from categories import Categories

class Data(object):
    def __init__(self, dataPath):
        datapointsPath = os.path.join(dataPath, 'visualizedPoints')
        categoriesPath = os.path.join(dataPath, 'visualizedCategories')
        termIdxPath = os.path.join(dataPath, 'term.idx')
        datapointsDbPath = os.path.join(dataPath, 'datapoints.db')

        self._loadDatapoints(datapointsDbPath, datapointsPath)
        self._loadCategories(categoriesPath)
        self._loadTerms(termIdxPath, datapointsPath, categoriesPath)

    def _loadDatapoints(self, datapointsDbPath, datapointsPath):
        self._datapoints = Datapoints(datapointsDbPath, datapointsPath)

    def _loadTerms(self, termIdxPath, datapointsPath, categoriesPath):
        self._terms = TermIndex(termIdxPath, datapointsPath, categoriesPath).load()

    def _loadCategories(self, categoriesPath):
        self._categories = Categories(categoriesPath)

    def getBounds(self):
        return self._datapoints.getBounds()

    def getMaxDepth(self):
        return self._datapoints.getMaxDepth()

    def getSimilarTerms(self, term, limit):
        return self._terms.search(term, limit)

    def getDatapointsByIndex(self, index):
        return self._datapoints.getDatapointsByIndex(index)

    def getDatapointByTitle(self, title):
        return self._datapoints.getDatapointByTitle(title)

    def getDatapointsByCategory(self, category):
        ids = self._categories.getCategoryByTitle(category).ids
        return self._datapoints.getDatapointsByIds(ids)