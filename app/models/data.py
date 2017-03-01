import shelve
import os
from common.Terms import TermIndex
from common.Zoom import ZoomIndex
from common.SQLTables import WikimapCategoriesTable, WikimapPointsTable
from common.OtherTables import AggregatedLinksTable

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

class Bounds(object):
    def __init__(self, boundsTuple):
        self.xMin = boundsTuple[0]
        self.yMin = boundsTuple[1]
        self.xMax = boundsTuple[2]
        self.yMax = boundsTuple[3]

class Data(object):
    def __init__(self, dataPath):
        self._datapointsPath = os.path.join(dataPath, 'wikimap_points.db')
        self._categoriesPath = os.path.join(dataPath, 'wikimap_categories.db')
        self._termIdxPath = os.path.join(dataPath, 'term_index.idx')
        self._zoomIndexPath = os.path.join(dataPath, 'zoom_index.idx')
        self._metadataPath = os.path.join(dataPath, 'metadata.db')
        self._inlinksPath = os.path.join(dataPath, 'aggregated_inlinks.cdb')
        self._outlinksPath = os.path.join(dataPath, 'aggregated_outlinks.cdb')

        self._zoomIndex = ZoomIndex(self._zoomIndexPath).load()
        self._termIndex = TermIndex(self._termIdxPath)

    def getBounds(self):
        metadata = shelve.open(self._metadataPath, 'r')
        return Bounds(metadata['bounds'])

    def getSimilarTerms(self, term, limit):
        return self._termIndex.search(term, limit)

    def getDatapointsByCategory(self, category):
        table = WikimapCategoriesTable(self._categoriesPath)
        title = category.replace(' ', '_')
        ids = table.selectByTitle(title).next()[1]
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

    def getInlinksByTitle(self, title):
        datapoint = self.getDatapointByTitle(title)
        inlinks = AggregatedLinksTable(self._inlinksPath)
        return inlinks.get(datapoint.id)

    def getOutlinksByTitle(self, title):
        datapoint = self.getDatapointByTitle(title)
        outlinks = AggregatedLinksTable(self._outlinksPath)
        return outlinks.get(datapoint.id)
