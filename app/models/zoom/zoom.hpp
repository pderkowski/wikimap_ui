#pragma once

#include <vector>
#include <unordered_map>
#include "bounds.hpp"
#include "partitiontree.hpp"
#include "point.hpp"
#include "reverseindex.hpp"
#include "index.hpp"

class Zoom {
public:
    Zoom(const Datapoints& points, int pointsPerTile);

    Datapoints getDatapoints(const Index& index) const { return tree_.getDatapoints(index); }
    Range getBounds() const { return tree_.getBounds(); }
    int getMaxDepth() const { return tree_.getMaxDepth(); }
    Index getIndexById(int id) const { return revIndex_.getIndexById(id); }

private:
    PartitionTree tree_;
    ReverseIndex revIndex_;
};

namespace helpers {
    Points getPoints(const Datapoints& dps);
}