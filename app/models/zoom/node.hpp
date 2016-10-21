#pragma once

#include "bounds.hpp"
#include "children.hpp"
#include <vector>
#include "datapoint.hpp"
#include "point.hpp"
#include "index.hpp"

class Node {
public:
    Node(const Bounds& bounds, const Index& index, int capacity);
    Node(const Node& other) = delete;
    Node& operator = (const Node& other) = delete;
    ~Node();

    const Children& getChildren() const { return children_; }
    Children& getChildren() { return children_; }

    const Node* getChildContainingPoint(const Point& p) const;
    Node* getChildContainingPoint(const Point& p);

    Datapoints getDatapoints() const { return points_; }
    Bounds getBounds() const { return bounds_; }

    int getMaxDepth() const;
    int getDepthAtPoint(const Point& p) const;

    Index getIndex() const;

    bool isLeaf() const;
    bool contains(const Point& p) const;

    Index insert(const Datapoint& d);

private:
    Node* prepareInsert(const Point& p);

    bool isFull() const;

    void split();

    Children children_;

    Bounds bounds_;
    Datapoints points_;

    Index index_;

    int capacity_;
};
