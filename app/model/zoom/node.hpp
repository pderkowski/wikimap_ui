#pragma once

#include "bounds.hpp"
#include "children.hpp"
#include <vector>

class Node {
public:
    Node(const Bounds& bounds, int capacity);
    Node(const Node& other) = delete;
    Node& operator = (const Node& other) = delete;
    ~Node();

    const Children& getChildren() const { return children_; }
    Children& getChildren() { return children_; }

    const Node* getChildContainingPoint(const Point2D& p) const;
    Node* getChildContainingPoint(const Point2D& p);

    Points2D getPoints() const { return points_; }
    Bounds getBounds() const { return bounds_; }

    int getMaxDepth() const;
    int getDepthAtPoint(const Point2D& p) const;

    bool isLeaf() const;
    bool contains(const Point2D& p) const;

    void insert(const Point2D& p);

private:
    bool isFull() const;

    void split();

    Children children_;

    Bounds bounds_;
    Points2D points_;

    int capacity_;
};
