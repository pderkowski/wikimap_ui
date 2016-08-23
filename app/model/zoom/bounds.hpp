#pragma once

#include <array>
#include <vector>
#include "point.hpp"

class Bounds {
public:
    Bounds(const Range& range); //implicit
    Bounds(const Point2D& topLeft, const Point2D& bottomRight);

    bool contain(const Point2D& p) const;
    bool contain(const Bounds& b) const;

    Bounds getTopLeftQuadrant() const;
    Bounds getTopRightQuadrant() const;
    Bounds getBottomRightQuadrant() const;
    Bounds getBottomLeftQuadrant() const;

    Point2D getTopLeftCorner() const { return topLeft_; }
    Point2D getBottomRightCorner() const { return bottomRight_; }

    double getWidth() const;
    double getHeight() const;

    Point2D getMidpoint() const;

    Bounds intersect(const Bounds& other) const;

    operator Range() const;

private:
    Point2D topLeft_;
    Point2D bottomRight_;

private:
    friend bool operator == (const Bounds& lhs, const Bounds& rhs);
};

bool operator == (const Bounds& lhs, const Bounds& rhs);


namespace helpers {
    Bounds getBounds(const Points2D& points);
    Bounds getClosedBounds(const Bounds& openBounds);

    double nextGreater(double x);
    double nextSmaller(double x);
}