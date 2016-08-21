#pragma once

#include <vector>
#include "bounds.hpp"
#include "partitiontree.hpp"
#include "point.hpp"
#include "indexer.hpp"

class Zoom {
public:

public:
    Zoom(const Points& points, int pointsPerTile);

    Points getPoints(const Index& index) const;
    Range getBounds() const { return tree_.getBounds(); }

    Index getClosestAvailableIndex(const Index& index) const;

private:
    PartitionTree tree_;
};


