#pragma once

#include <vector>
#include "bounds.hpp"
#include "partitiontree.hpp"
#include "grid.hpp"
#include "point.hpp"

class Axes;

class Zoom {
public:

public:
    Zoom(const Points& points, int pointsPerTile);

    Points getPoints(int xIndex, int yIndex, int zoomLevel) const;
    Axes getGrid(const Range& range, int zoomLevel) const;
    Range getBounds() const { return tree_.getBounds(); }

private:

    PartitionTree tree_;
    Grid grid_;
};


