#include "node.hpp"
#include <cassert>
#include <algorithm>
#include <iterator>

Node::Node(const Bounds& bounds, int capacity)
: children_(), bounds_(bounds), points_(), capacity_(capacity)
{
    assert(capacity_ > 0);
}

Node::~Node() {
    for (auto c : children_) {
        delete c;
    }
}

bool Node::isLeaf() const {
    assert(std::all_of(children_.begin(), children_.end(), [] (const Node* c) {return c != nullptr;})  // either have 4 valid children
        || std::all_of(children_.begin(), children_.end(), [] (const Node* c) {return c == nullptr;})); // or 0


    return std::all_of(children_.begin(), children_.end(), [] (const Node* c) {return c == nullptr;});
}

bool Node::isFull() const {
    return points_.size() >= capacity_;
}

bool Node::contains(const Point2D& p) const {
    return bounds_.contain(p);
}

const Node* Node::getChildContainingPoint(const Point2D& p) const {
    assert(!isLeaf());
    assert(contains(p));

    for (const auto& child : children_) {
        if (child->contains(p))
            return child;
    }

    assert(0);
}

Node* Node::getChildContainingPoint(const Point2D& p) {
    return const_cast<Node*>(static_cast<const Node*>(this)->getChildContainingPoint(p));
}

int Node::getMaxDepth() const {
    if (isLeaf()) {
        return 0;
    } else {
        std::vector<int> depths;
        for (auto child : children_) {
            depths.push_back(child->getMaxDepth());
        }
        assert(depths.size() == 4);
        return 1 + *std::max_element(depths.begin(), depths.end());
    }
}

int Node::getDepthAtPoint(const Point2D& p) const {
    if (isLeaf()) {
        return 0;
    } else {
        return 1 + getChildContainingPoint(p)->getDepthAtPoint(p);
    }
}

void Node::split() {
    assert(isLeaf());

    children_.setTopLeft(new Node(bounds_.getTopLeftQuadrant(), capacity_));
    children_.setTopRight(new Node(bounds_.getTopRightQuadrant(), capacity_));
    children_.setBottomRight(new Node(bounds_.getBottomRightQuadrant(), capacity_));
    children_.setBottomLeft(new Node(bounds_.getBottomLeftQuadrant(), capacity_));

    auto tl = children_.getTopLeft();
    auto tr = children_.getTopRight();
    auto br = children_.getBottomRight();
    auto bl = children_.getBottomLeft();

    for (const auto& p : points_) {
        if (tl->contains(p.point.to2D())) {
            tl->insert(p);
        } else if (tr->contains(p.point.to2D())) {
            tr->insert(p);
        } else if (br->contains(p.point.to2D())) {
            br->insert(p);
        } else if (bl->contains(p.point.to2D())) {
            bl->insert(p);
        } else {
            assert(0);
        }
    }
}

Node* Node::prepareInsert(const Point2D& p) {
    if (isFull()) {
        if (isLeaf()) {
            split();
        }

        assert(!isLeaf());
        return getChildContainingPoint(p)->prepareInsert(p);
    } else {
        assert(!isFull());
        assert(isLeaf());

        return this;
    }
}

void Node::insert(const Point2D& p, const Data& data) {
    auto node = prepareInsert(p);

    auto z = getDepthAtPoint(p);
    Datapoint d{Point3D(p.x, p.y, z), data};

    node->doInsert(d);
}

void Node::insert(const Datapoint& d) {
    auto node = prepareInsert(d.point.to2D());
    node->doInsert(d);
}

void Node::doInsert(const Datapoint& d) {
    points_.push_back(d);
}