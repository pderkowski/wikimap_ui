#include "zoom.hpp"
#include <vector>
#include <algorithm>
#include <cassert>
#include "indexer.hpp"

Zoom::Zoom(const std::vector<Point>& points, int pointsPerTile)
: tree_(points, pointsPerTile)
{ }

std::vector<Point> Zoom::getPoints(const Index& index) const {
    Indexer indexer(tree_.getBounds());
    auto point = indexer.indexToPoint(index);
    auto bucket = tree_.getBucket(point, index.level);
    return bucket.getPoints();
}

Index Zoom::getClosestAvailableIndex(const Index& index) const {
    Indexer indexer(tree_.getBounds());

    auto point = indexer.indexToPoint(index);
    auto actualLevel = tree_.getDepthAtPoint(point);

    return indexer.pointToIndex(point, actualLevel);
}
