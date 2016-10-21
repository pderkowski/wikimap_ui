#include "indexer.hpp"
#include "index.hpp"
#include "bounds.hpp"
#include <cmath>

Indexer::Indexer(const Bounds& bounds)
: bounds_(bounds)
{ }

Bounds Indexer::indexToBounds(Index index) const {
    int p = (int)pow(2, index.z);

    auto bounds = bounds_;

    for (int l = 0; l < index.z; ++l) {
        int half = p / 2;

        if (index.x < half && index.y < half) {
            bounds = bounds.getTopLeftQuadrant();
        } else if (index.x >= half && index.y < half) {
            bounds = bounds.getTopRightQuadrant();
            index.x -= half;
        } else if (index.x >= half && index.y >= half) {
            bounds = bounds.getBottomRightQuadrant();
            index.x -= half;
            index.y -= half;
        } else if (index.x < half && index.y >= half) {
            bounds = bounds.getBottomLeftQuadrant();
            index.y -= half;
        } else {
            assert(0);
        }

        p = half;
    }

    return bounds;
}

Point Indexer::indexToPoint(Index index) const {
    auto bounds = indexToBounds(index);
    return bounds.getMidpoint();
}

Index Indexer::pointToIndex(const Point& p, int z) const {
    assert(bounds_.contain(p));

    auto bounds = bounds_;

    int x = 0;
    int y = 0;
    for (int l = 0; l < z; ++l) {
        auto tl = bounds.getTopLeftQuadrant();
        auto tr = bounds.getTopRightQuadrant();
        auto br = bounds.getBottomRightQuadrant();
        auto bl = bounds.getBottomLeftQuadrant();

        if (tl.contain(p)) {
            x *= 2;
            y *= 2;
            bounds = tl;
        } else if (tr.contain(p)) {
            x = 2 * x + 1;
            y *= 2;
            bounds = tr;
        } else if (br.contain(p)) {
            x = 2 * x + 1;
            y = 2 * y + 1;
            bounds = br;
        } else if (bl.contain(p)) {
            x *= 2;
            y = 2 * y + 1;
            bounds = bl;
        } else {
            assert(0);
        }
    }

    return Index{x, y, z};
}
