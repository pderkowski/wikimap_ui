#pragma once

#include <vector>
#include <array>
#include <vector>
#include "bounds.hpp"
#include "node.hpp"

class BucketCoords {
public:
    BucketCoords(int x, int y, int level);

    int x() const { return x_; }
    int y() const { return y_; }
    int level() const { return level_; }

private:
    int x_;
    int y_;
    int level_;
};

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

    BucketCoords getBucketCoords(const Point& p, int level) const;

    Bucket getBucket(const Point& p, int level) const;
    Bucket getBucket(const BucketCoords& coords) const;

    Bounds getBounds() const { return root_->getBounds(); }

    int getDepth() const { return root_->getDepth(); }

private:
    Point bucketCoordsToPoint(const BucketCoords& coords) const;

    Node* root_;
};


