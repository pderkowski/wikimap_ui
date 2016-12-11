import os
import zoom
from terms import TermIndex
from common.SQLTableDefs import WikimapCategoriesTable, WikimapPointsTable
from itertools import izip, repeat, imap
from operator import itemgetter

class Datapoint(object):
    def __init__(self, id_, title, x, y, xIndex, yIndex, zIndex, highDimNeighs, highDimDists, lowDimNeighs, lowDimDists):
        self.id = id_
        self.title = title.replace('_', ' ')
        self.x = x
        self.y = y
        self.xIndex = xIndex
        self.yIndex = yIndex
        self.zIndex = zIndex
        self.highDimNeighs = highDimNeighs
        self.highDimDists = highDimDists
        self.lowDimNeighs = lowDimNeighs
        self.lowDimDists = lowDimDists

class Category(object):
    def __init__(self, title, ids):
        self.title = title.replace('_', ' ')
        self.ids = ids

class Bounds(object):
    def __init__(self, range_):
        self.xMin = range_.topLeft.x
        self.yMin = range_.topLeft.y
        self.xMax = range_.bottomRight.x
        self.yMax = range_.bottomRight.y

class Data(object):
    def __init__(self, dataPath):
        self._datapointsPath = os.path.join(dataPath, 'wikimapPoints.db')
        self._categoriesPath = os.path.join(dataPath, 'wikimapCategories.db')
        self._termIdxPath = os.path.join(dataPath, 'term.idx')

        self._zoomIndex = self._loadZoomIndex()
        self._syncDatapointsWithZoomIndex()

        self._termIndex = self._loadTermIndex()

    def getBounds(self):
        return Bounds(self._zoomIndex.getBounds())

    def getSimilarTerms(self, term, limit):
        return self._termIndex.search(term, limit)

    def getDatapointsByCategory(self, category):
        ids = self.getCategoryByTitle(category).ids
        return self.getDatapointsByIds(ids)

    def getDatapointsByIndex(self, index):
        ids = [dp.id for dp in self._zoomIndex.getDatapoints(index)]
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

    def _loadZoomIndex(self):
        print 'Loading zoom index...'

        table = WikimapPointsTable(self._datapointsPath)
        points = [zoom.Datapoint(*args) for args in table.selectCoordsAndIds()]
        return zoom.Zoom(points, 100)

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

    def _syncDatapointsWithZoomIndex(self):
        def getValues(ids):
            for id_ in ids:
                id_ = id_[0]
                idx = self._zoomIndex.getIndexById(id_)
                yield idx.x, idx.y, idx.z, id_

        table = WikimapPointsTable(self._datapointsPath)
        table.updateIndices(getValues(table.selectIds()))
