#pragma once

#include "point.hpp"
#include "bounds.hpp"

struct Index {
public:
    Index(int x, int y, int level)
    : x(x), y(y), level(level)
    { }

    int x;
    int y;
    int level;

    bool operator == (const Index& other) const;
};

class Indexer {
public:
    Indexer(const Bounds& bounds);

    Bounds indexToBounds(Index i) const;

    Index pointToIndex(const Point2D& p, int level) const;
    Point2D indexToPoint(Index i) const;

private:
    Bounds bounds_;
    int level_;
};