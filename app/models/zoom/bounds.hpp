#pragma once

#include <array>
#include <vector>
#include "point.hpp"

class Bounds {
public:
    Bounds(const Range& range); //implicit
    Bounds(const Point& topLeft, const Point& bottomRight);

    bool contain(const Point& p) const;
    bool contain(const Bounds& b) const;

    Bounds getTopLeftQuadrant() const;
    Bounds getTopRightQuadrant() const;
    Bounds getBottomRightQuadrant() const;
    Bounds getBottomLeftQuadrant() const;

    Point getTopLeftCorner() const { return topLeft_; }
    Point getBottomRightCorner() const { return bottomRight_; }

    double getWidth() const;
    double getHeight() const;

    Point getMidpoint() const;

    Bounds intersect(const Bounds& other) const;

    operator Range() const;

private:
    Point topLeft_;
    Point bottomRight_;

private:
    friend bool operator == (const Bounds& lhs, const Bounds& rhs);
};

bool operator == (const Bounds& lhs, const Bounds& rhs);


namespace helpers {
    Bounds getBounds(const Points& points);
    Bounds getClosedBounds(const Bounds& openBounds);

    double nextGreater(double x);
    double nextSmaller(double x);
}