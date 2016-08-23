#include <cassert>
#include <cmath>
#include <iterator>
#include <algorithm>
#include "partitiontree.hpp"
#include "node.hpp"

PartitionTree::PartitionTree(const Bounds& bounds, int nodeCapacity)
: root_(new Node(bounds, nodeCapacity)), indexer_(root_->getBounds())
{ }

PartitionTree::~PartitionTree() {
    delete root_;
}

void PartitionTree::insert(const Point2D& p, const Data& data) {
    root_->insert(p, data);
}

Datapoints PartitionTree::getDatapoints(const Index& index) const {
    auto p = indexer_.indexToPoint(index);

    assert(root_->contains(p));

    Node* current = root_;
    int l = 0;
    for ( ; !current->isLeaf() && l < index.level; ++l) {
        current = current->getChildContainingPoint(p);
    }

    if (l == index.level) {
        return current->getDatapoints();
    } else {
        auto all = current->getDatapoints();
        decltype(all) filtered;
        auto bounds = indexer_.indexToBounds(index);
        std::copy_if(all.begin(), all.end(), std::back_inserter(filtered), [&bounds] (const Datapoint& d) {
            return bounds.contain(d.point.to2D());
        });
        return filtered;
    }
}
