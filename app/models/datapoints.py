import sqlite3
import os
import zoom

class Datapoint(object):
    def __init__(self, id, title, x, y, z):
        self.id = id
        self.title = title
        self.x = x
        self.y = y
        self.z = z

class Datapoints(object):
    def __init__(self, datapointsDbPath, datapointsPath):
        self._dbPath = datapointsDbPath
        self._datapointsPath = datapointsPath

        self._loadZoomIndex()
        self._loadDatabase()

    def getBounds(self):
        return self._zoomIndex.getBounds()

    def getMaxDepth(self):
        return self._zoomIndex.getMaxDepth()

    def getDatapointsByIndex(self, index):
        ids = [dp.id for dp in self._zoomIndex.getDatapoints(index)]
        return self.getDatapointsByIds(ids)

    def getDatapointsByIds(self, ids):
        placeholders = ','.join(['?']*len(ids))
        query = """
            SELECT
                id, title, x, y, zIdx
            FROM
                datapoints
            WHERE
                id IN ({})
            """.format(placeholders)

        con = self._openDatabase()
        cursor = con.cursor()
        cursor.execute(query, ids)
        return [Datapoint(id=r[0], title=r[1], x=r[2], y=r[3], z=r[4]) for r in cursor]

    def getDatapointByTitle(self, title):
        query = """
            SELECT
                id, title, x, y, zIdx
            FROM
                datapoints
            WHERE
                title = ?
            """

        con = self._openDatabase()
        res = con.execute(query, (title,))[0]
        return Datapoint(id=res.id, title=res.title, x=res.x, y=res.y, z=res.z)

    def _loadZoomIndex(self):
        print 'Loading zoom index...'

        with open(self._datapointsPath, 'r') as file:
            points = []
            for line in file:
                words = line.split()

                x = float(words[0])
                y = float(words[1])
                id_ = int(words[3])

                points.append(zoom.Datapoint(x, y, id_))

            self._zoomIndex = zoom.Zoom(points, 100)

    def _loadDatabase(self):
        print 'Loading database...'

        if not os.path.isfile(self._dbPath):
            con = self._createDatabase()

    def _openDatabase(self):
        con = sqlite3.connect(self._dbPath)

        con.execute("PRAGMA synchronous = OFF")
        con.execute("PRAGMA journal_mode = OFF")
        con.execute("PRAGMA cache_size = -100000")

        return con

    def _createDatabase(self):
        con = self._openDatabase()

        con.execute("DROP TABLE IF EXISTS datapoints;")
        con.execute("""
            CREATE TABLE datapoints (
                id          INTEGER     NOT NULL    PRIMARY KEY,
                title       TEXT        NOT NULL,
                x           REAL        NOT NULL,
                y           REAL        NOT NULL,
                xIdx        INTEGER     NOT NULL,
                yIdx        INTEGER     NOT NULL,
                zIdx        INTEGER     NOT NULL
            );""")
        con.execute('CREATE UNIQUE INDEX title_idx ON datapoints(title);')

        con.executemany('INSERT INTO datapoints VALUES (?, ?, ?, ?, ?, ?, ?)', self._iterateDatapoints())
        con.commit()

        return con

    def _iterateDatapoints(self):
        with open(self._datapointsPath, 'r') as file:
            for line in file:
                words = line.split()

                x = float(words[0])
                y = float(words[1])
                title = unicode(words[2], encoding='utf8').replace('_', ' ') # replace underscores with spaces for natural presentation
                id_ = int(words[3])
                index = self._zoomIndex.getIndexById(id_)
                xIdx, yIdx, zIdx = index.x, index.y, index.z
                yield id_, title, x, y, xIdx, yIdx, zIdx