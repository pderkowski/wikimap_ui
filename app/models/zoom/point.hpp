#pragma once

#include <cassert>
#include <vector>
#include <string>

struct Point {
    Point(double x, double y)
    : x(x), y(y)
    { }

    bool operator == (const Point& other) const { return x == other.x && y == other.y; }
    bool operator <= (const Point& other) const { return x <= other.x && y <= other.y; }

    double x;
    double y;
};

struct Range {
public:
    Range(const Point& topLeft, const Point& bottomRight)
    : topLeft(topLeft), bottomRight(bottomRight)
    {
        assert(topLeft <= bottomRight);
    }

    Point topLeft;
    Point bottomRight;
};

typedef std::vector<Point> Points;

