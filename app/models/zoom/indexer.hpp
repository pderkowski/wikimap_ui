#pragma once

#include "point.hpp"
#include "bounds.hpp"
#include "index.hpp"

class Indexer {
public:
    Indexer(const Bounds& bounds);

    Bounds indexToBounds(Index i) const;

    Index pointToIndex(const Point& p, int z) const;
    Point indexToPoint(Index i) const;

private:
    Bounds bounds_;
};