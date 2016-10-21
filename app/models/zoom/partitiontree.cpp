#include <cassert>
#include <cmath>
#include <iterator>
#include <algorithm>
#include "partitiontree.hpp"
#include "node.hpp"

PartitionTree::PartitionTree(const Bounds& bounds, int nodeCapacity)
: root_(new Node(bounds, Index{0, 0, 0}, nodeCapacity)), indexer_(root_->getBounds())
{ }

PartitionTree::~PartitionTree() {
    delete root_;
}

Index PartitionTree::insert(const Datapoint& dp) {
    return root_->insert(dp);
}

Datapoints PartitionTree::getDatapoints(const Index& index) const {
    auto p = indexer_.indexToPoint(index);

    assert(root_->contains(p));

    Node* current = root_;
    int l = 0;
    for ( ; !current->isLeaf() && l < index.z; ++l) {
        current = current->getChildContainingPoint(p);
    }

    if (l == index.z) {
        return current->getDatapoints();
    } else {
        auto all = current->getDatapoints();
        decltype(all) filtered;
        auto bounds = indexer_.indexToBounds(index);
        std::copy_if(all.begin(), all.end(), std::back_inserter(filtered), [&bounds] (const Datapoint& d) {
            return bounds.contain(d.p);
        });
        return filtered;
    }
}
