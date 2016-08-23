#include <cassert>
#include <cmath>
#include <iterator>
#include <algorithm>
#include "partitiontree.hpp"
#include "node.hpp"

PartitionTree::PartitionTree(const Bounds& bounds, int nodeCapacity)
: root_(new Node(bounds, nodeCapacity)), indexer_(root_->getBounds())
{ }

PartitionTree::PartitionTree(const Points2D& points, int nodeCapacity)
: root_(new Node(helpers::getBounds(points), nodeCapacity)), indexer_(root_->getBounds()) {
    for (const auto& p : points) {
        insert(p);
    }
}

PartitionTree::~PartitionTree() {
    delete root_;
}

void PartitionTree::insert(const Point2D& p) {
    root_->insert(p);
}

Points2D PartitionTree::getPoints(const Index& index) const {
    auto p = indexer_.indexToPoint(index);

    assert(root_->contains(p));

    Node* current = root_;
    int l = 0;
    for ( ; !current->isLeaf() && l < index.level; ++l) {
        current = current->getChildContainingPoint(p);
    }

    const auto& all = current->getPoints();
    if (l == index.level) {
        return all;
    } else {
        Points2D filtered;
        auto bounds = indexer_.indexToBounds(index);
        std::copy_if(all.begin(), all.end(), std::back_inserter(filtered), [&bounds] (const Point2D& p) {
            return bounds.contain(p);
        });
        return filtered;
    }
}
