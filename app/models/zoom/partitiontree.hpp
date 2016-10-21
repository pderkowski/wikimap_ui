#pragma once

#include <vector>
#include <array>
#include <vector>
#include "bounds.hpp"
#include "node.hpp"
#include "indexer.hpp"
#include "datapoint.hpp"

class PartitionTree {
public:
    PartitionTree(const Bounds& bounds, int bucketCapacity);

    PartitionTree(const PartitionTree& other) = delete;
    PartitionTree& operator = (const PartitionTree& other) = delete;

    ~PartitionTree();

    Index insert(const Datapoint& dp);

    Datapoints getDatapoints(const Index& index) const;

    Bounds getBounds() const { return root_->getBounds(); }

    int getMaxDepth() const { return root_->getMaxDepth(); }
    int getDepthAtPoint(const Point& p) const { return root_->getDepthAtPoint(p); }

private:
    Node* root_;
    Indexer indexer_;
};


