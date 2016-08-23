#include "zoom.hpp"
#include <vector>
#include <algorithm>
#include <cassert>
#include "indexer.hpp"

Zoom::Zoom(const Points2D& points, int pointsPerTile)
: tree_(points, pointsPerTile)
{ }

Points2D Zoom::getPoints(const Index& index) const {
    return tree_.getPoints(index);
}

