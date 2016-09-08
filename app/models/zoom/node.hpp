#pragma once

#include "bounds.hpp"
#include "children.hpp"
#include <vector>

struct Data {
    explicit Data(int id, const std::string& name)
    : id(id), name(name)
    { }

    int id;
    std::string name;

    bool operator == (const Data& other) const {
        return id == other.id && name == other.name;
    }
};

struct Datapoint {
    Datapoint(const Point3D& point, const Data& data)
    : point(point), data(data)
    { }

    Point3D point;
    Data data;

    bool operator == (const Datapoint& other) const {
        return point == other.point && data == other.data;
    }
};

typedef std::vector<Datapoint> Datapoints;

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

    Datapoints getDatapoints() const { return points_; }
    Bounds getBounds() const { return bounds_; }

    int getMaxDepth() const;
    int getDepthAtPoint(const Point2D& p) const;

    bool isLeaf() const;
    bool contains(const Point2D& p) const;

    void insert(const Point2D& p, const Data& data);

private:
    void insert(const Datapoint& d);

    Node* prepareInsert(const Point2D& p);
    void doInsert(const Datapoint& d);

    bool isFull() const;

    void split();

    Children children_;

    Bounds bounds_;
    Datapoints points_;

    int capacity_;
};
