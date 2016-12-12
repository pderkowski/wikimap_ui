from utils import pipe, Object2Dict, SelectColumns, RenameColumns

def prepareDatapoints(datapoints):
    return pipe(datapoints, Object2Dict, RenameColumns(('zIndex', 'z')), list)

def prepareBasicDatapoints(datapoints):
    return pipe(prepareDatapoints(datapoints), SelectColumns(['id', 'title', 'x', 'y', 'z']), list)

def prepareBounds(bounds):
    return [[bounds.xMin, bounds.yMin], [bounds.xMax, bounds.yMax]]
