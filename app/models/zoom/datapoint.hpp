#pragma once

#include <vector>
#include "point.hpp"

struct Datapoint {
    Datapoint(const Point& p, int id)
    : p(p), id(id)
    { }

    Datapoint(double x, double y, int id)
    : p(x, y), id(id)
    { }

    Point p;
    int id;

    bool operator == (const Datapoint& other) const {
        return p == other.p && id == other.id;
    }
};

typedef std::vector<Datapoint> Datapoints;