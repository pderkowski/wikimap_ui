import os
import shelve
from terms import TermIndex
from common.Zoom import ZoomIndex
from common.SQLTableDefs import WikimapCategoriesTable, WikimapPointsTable
from itertools import izip, repeat, imap
from operator import itemgetter

class Datapoint(object):
    def __init__(self, id_, title, x, y, index, highDimNeighs, highDimDists, lowDimNeighs, lowDimDists):
        self.id = id_
        self.title = title.replace('_', ' ')
        self.x = x
        self.y = y
        self.z = len(index)
        self.highDimNeighs = [n.replace('_', ' ') for n in highDimNeighs]
        self.highDimDists = highDimDists
        self.lowDimNeighs = [n.replace('_', ' ') for n in lowDimNeighs]
        self.lowDimDists = lowDimDists

class Category(object):
    def __init__(self, title, ids):
        self.title = title.replace('_', ' ')
        self.ids = ids

class Bounds(object):
    def __init__(self, boundsTuple):
        self.xMin = boundsTuple[0]
        self.yMin = boundsTuple[1]
        self.xMax = boundsTuple[2]
        self.yMax = boundsTuple[3]

class Data(object):
    def __init__(self, dataPath):
        self._datapointsPath = os.path.join(dataPath, 'wikimapPoints.db')
        self._categoriesPath = os.path.join(dataPath, 'wikimapCategories.db')
        self._termIdxPath = os.path.join(dataPath, 'term.idx')
        self._zoomIndexPath = os.path.join(dataPath, 'zoom.idx')
        self._metadataPath = os.path.join(dataPath, 'metadata.db')

        self._zoomIndex = ZoomIndex(self._zoomIndexPath).load()
        self._termIndex = self._loadTermIndex()

    def getBounds(self):
        metadata = shelve.open(self._metadataPath, 'r')
        return Bounds(metadata['bounds'])

    def getSimilarTerms(self, term, limit):
        return self._termIndex.search(term, limit)

    def getDatapointsByCategory(self, category):
        ids = self.getCategoryByTitle(category).ids
        return self.getDatapointsByIds(ids)

    def getDatapointsByZoom(self, zoom):
        ids = self._zoomIndex.get(zoom)
        return self.getDatapointsByIds(ids)

    def getDatapointsByIds(self, ids):
        table = WikimapPointsTable(self._datapointsPath)
        return [Datapoint(*args) for args in table.selectByIds(ids)]

    def getDatapointByTitle(self, title):
        title = title.replace(' ', '_')
        table = WikimapPointsTable(self._datapointsPath)
        return Datapoint(*table.selectByTitle(title).next())

    def getCategoryByTitle(self, title):
        title = title.replace(' ', '_')
        table = WikimapCategoriesTable(self._categoriesPath)
        return Category(*table.selectByTitle(title).next())

    def _loadTermIndex(self):
        termIndex = TermIndex(self._termIdxPath)
        if termIndex.isEmpty():
            print "Adding terms from ", self._datapointsPath
            datapoints = WikimapPointsTable(self._datapointsPath)
            termIndex.add(izip(imap(itemgetter(0), datapoints.selectTitles()), repeat(False)))

            print "Adding terms from ", self._categoriesPath
            categories = WikimapCategoriesTable(self._categoriesPath)
            termIndex.add(izip(imap(itemgetter(0), categories.selectTitles()), repeat(True)))
        return termIndex
