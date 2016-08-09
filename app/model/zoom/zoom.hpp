#pragma once

#include <vector>
#include "bounds.hpp"
#include "partitiontree.hpp"

class Zoom {
public:
    Zoom(const std::vector<Point>& points, int pointsPerTile);

    std::vector<Point> getPoints(const Bounds& bounds, int zoomLevel) const;
    Bounds getEnclosingBounds() const;

private:
    Bounds getOverlappingBounds(const Bounds& bounds) const;

    PartitionTree tree_;
};