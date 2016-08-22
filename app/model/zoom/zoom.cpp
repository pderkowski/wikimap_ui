#include "zoom.hpp"
#include <vector>
#include <algorithm>
#include <cassert>
#include "indexer.hpp"

Zoom::Zoom(const std::vector<Point>& points, int pointsPerTile)
: tree_(points, pointsPerTile)
{ }

std::vector<Point> Zoom::getPoints(const Index& index) const {
    return tree_.getPoints(index);
}

