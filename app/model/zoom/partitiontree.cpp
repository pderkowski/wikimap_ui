#include <cassert>
#include <cmath>
#include "partitiontree.hpp"
#include "node.hpp"

Bucket::Bucket(const Node* node)
: node_(node)
{ }

bool operator == (const Bucket& lhs, const Bucket& rhs) {
    return lhs.node_ == rhs.node_;
}

PartitionTree::PartitionTree(const Bounds& bounds, int nodeCapacity)
: root_(new Node(bounds, nodeCapacity))
{ }

PartitionTree::PartitionTree(const std::vector<Point>& points, int nodeCapacity)
: root_(new Node(helpers::getBounds(points), nodeCapacity)) {
    for (const auto& p : points) {
        insert(p);
    }
}

PartitionTree::~PartitionTree() {
    delete root_;
}

void PartitionTree::insert(const Point& p) {
    root_->insert(p);
}

Bucket PartitionTree::getBucket(const Point& p, int level) const {
    assert(0 <= level);
    assert(root_->contains(p));

    int l = 0;

    Node* current = root_;
    while (!current->isLeaf() && l < level) {
        current = current->getChildContainingPoint(p);
        ++l;
    }

    return Bucket(current);
}
