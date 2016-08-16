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

    Points getPoints(const Range& range, int zoomLevel) const;
    Axes getGrid(const Range& range, int zoomLevel) const;

private:
    Bounds getEnclosingBounds() const;
    Bounds getOverlappingBounds(const Bounds& bounds) const;

    PartitionTree tree_;
    Grid grid_;
};


