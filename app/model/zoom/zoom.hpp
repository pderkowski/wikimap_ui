#pragma once

#include <vector>
#include "bounds.hpp"
#include "partitiontree.hpp"
#include "grid.hpp"

class Axes;

class Zoom {
public:
    typedef std::vector<Point> Points;

public:
    Zoom(const Points& points, int pointsPerTile);

    Points getPoints(const Bounds& bounds, int zoomLevel) const;
    Axes getGrid(const Bounds& bounds, int zoomLevel) const;
    Bounds getEnclosingBounds() const;

private:
    Bounds getOverlappingBounds(const Bounds& bounds) const;

    PartitionTree tree_;
    Grid grid_;
};

struct Axes {
    Grid::Axis x;
    Grid::Axis y;
};
