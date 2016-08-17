#include "zoom.hpp"
#include <vector>
#include <algorithm>
#include <cassert>

Zoom::Zoom(const std::vector<Point>& points, int pointsPerTile)
: tree_(points, pointsPerTile), grid_(tree_.getBounds(), tree_.getDepth())
{ }

std::vector<Point> Zoom::getPoints(int xIndex, int yIndex, int zoomLevel) const {
    auto bucket = tree_.getBucket(BucketCoords(xIndex, yIndex, zoomLevel));
    return bucket.getPoints();
}

Axes Zoom::getGrid(const Range& range, int zoomLevel) const {
    auto tl = range.topLeft;
    auto br = range.bottomRight;

    return Axes{ grid_.getXAxis(tl.x, br.x, zoomLevel), grid_.getYAxis(tl.y, br.y, zoomLevel) };
}