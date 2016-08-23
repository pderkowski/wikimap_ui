#pragma once

#include <vector>
#include "bounds.hpp"
#include "partitiontree.hpp"
#include "point.hpp"
#include "indexer.hpp"

class Zoom {
public:
    Zoom(const Points2D& points, const std::vector<Data>& data, int pointsPerTile);

    Datapoints getDatapoints(const Index& index) const;
    Range getBounds() const { return tree_.getBounds(); }
    int getMaxDepth() const { return tree_.getMaxDepth(); }

private:
    PartitionTree tree_;
};


