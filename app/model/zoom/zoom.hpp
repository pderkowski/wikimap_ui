#pragma once

#include <vector>
#include "bounds.hpp"
#include "partitiontree.hpp"
#include "point.hpp"
#include "indexer.hpp"

class Zoom {
public:

public:
    Zoom(const Points2D& points, int pointsPerTile);

    Points2D getPoints(const Index& index) const;
    Range getBounds() const { return tree_.getBounds(); }
    int getMaxDepth() const { return tree_.getMaxDepth(); }

private:
    PartitionTree tree_;
};


