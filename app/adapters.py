from utils import pipe, Object2Dict, SelectColumns, RenameColumns

def fullDatapointsInfo(datapoints):
    return pipe(datapoints, Object2Dict, RenameColumns(('zIndex', 'z')), list)

def basicDatapointInfo(datapoints):
    return pipe(fullDatapointsInfo(datapoints), SelectColumns(['id', 'title', 'x', 'y', 'z']), list)
