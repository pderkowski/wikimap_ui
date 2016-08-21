#pragma once

#include <vector>
#include <array>
#include <vector>
#include "bounds.hpp"
#include "node.hpp"

class Bucket {
public:
    explicit Bucket(const Node* node);

    std::vector<Point> getPoints() const { return node_->getPoints(); }

private:
    friend bool operator == (const Bucket& lhs, const Bucket& rhs);

private:
    const Node* node_;
};

bool operator == (const Bucket& lhs, const Bucket& rhs);

class PartitionTree {
public:
    PartitionTree(const Bounds& bounds, int bucketCapacity);
    PartitionTree(const std::vector<Point>& points, int bucketCapacity);

    PartitionTree(const PartitionTree& other) = delete;
    PartitionTree& operator = (const PartitionTree& other) = delete;

    ~PartitionTree();

    void insert(const Point& p);

    Bucket getBucket(const Point& p, int level) const;

    Bounds getBounds() const { return root_->getBounds(); }

    int getMaxDepth() const { return root_->getMaxDepth(); }
    int getDepthAtPoint(const Point& p) const { return root_->getDepthAtPoint(p); }

private:

    Node* root_;
};


