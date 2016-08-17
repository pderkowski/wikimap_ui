#include "zoom.hpp"
#include <vector>
#include <algorithm>
#include <cassert>

Zoom::Zoom(const std::vector<Point>& points, int pointsPerTile)
: tree_(points, pointsPerTile)
{ }

std::vector<Point> Zoom::getPoints(int xIndex, int yIndex, int zoomLevel) const {
    auto bucket = tree_.getBucket(BucketCoords(xIndex, yIndex, zoomLevel));
    return bucket.getPoints();
}
