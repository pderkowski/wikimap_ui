#pragma once

#include <vector>
#include <array>
#include <vector>
#include "bounds.hpp"
#include "node.hpp"
#include "indexer.hpp"

class PartitionTree {
public:
    PartitionTree(const Bounds& bounds, int bucketCapacity);
    PartitionTree(const std::vector<Point>& points, int bucketCapacity);

    PartitionTree(const PartitionTree& other) = delete;
    PartitionTree& operator = (const PartitionTree& other) = delete;

    ~PartitionTree();

    void insert(const Point& p);

    Points getPoints(const Index& index) const;

    Bounds getBounds() const { return root_->getBounds(); }

    int getMaxDepth() const { return root_->getMaxDepth(); }
    int getDepthAtPoint(const Point& p) const { return root_->getDepthAtPoint(p); }

private:
    Node* root_;
    Indexer indexer_;
};


