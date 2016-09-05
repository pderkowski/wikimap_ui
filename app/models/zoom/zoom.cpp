#include "zoom.hpp"
#include <vector>
#include <algorithm>
#include <cassert>
#include "indexer.hpp"

Zoom::Zoom(const Points2D& points, const std::vector<Data>& data, int pointsPerTile)
: tree_(helpers::getBounds(points), pointsPerTile)
{
    assert(points.size() == data.size());
    for (int i = 0; i < points.size(); ++i) {
        tree_.insert(points[i], data[i]);
    }
}

Datapoints Zoom::getDatapoints(const Index& index) const {
    return tree_.getDatapoints(index);
}

