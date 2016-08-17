#pragma once

#include <vector>
#include "bounds.hpp"
#include "partitiontree.hpp"
#include "point.hpp"

class Zoom {
public:

public:
    Zoom(const Points& points, int pointsPerTile);

    Points getPoints(int xIndex, int yIndex, int zoomLevel) const;
    Range getBounds() const { return tree_.getBounds(); }

private:
    PartitionTree tree_;
};


