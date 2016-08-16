#include "bounds.hpp"
#include <cassert>
#include <limits>
#include <cmath>
#include <algorithm>

Point::Point(double x, double y)
: x(x), y(y)
{ }

Bounds::Bounds(const Point& topLeft, const Point& bottomRight)
: topLeft_(topLeft), bottomRight_(bottomRight)
{
    assert(topLeft_.x <= bottomRight_.x && topLeft_.y <= bottomRight_.y);
}

bool Bounds::contain(const Point& p) const {
    return topLeft_.x <= p.x && p.x < bottomRight_.x
        && topLeft_.y <= p.y && p.y < bottomRight_.y;
}

bool Bounds::contain(const Bounds& b) const {
    return topLeft_.x <= b.topLeft_.x
        && topLeft_.y <= b.topLeft_.y
        && bottomRight_.x >= b.bottomRight_.x
        && bottomRight_.y >= b.bottomRight_.y;
}

double Bounds::getWidth() const {
    return bottomRight_.x - topLeft_.x;
}

double Bounds::getHeight() const {
    return bottomRight_.y - topLeft_.y;
}

Bounds Bounds::getTopLeftQuadrant() const {
    const auto& tl = topLeft_;
    const auto& br = bottomRight_;

    return Bounds(tl,
                  Point((tl.x + br.x) / 2.0, (tl.y + br.y) / 2.0));
}

Bounds Bounds::getTopRightQuadrant() const {
    const auto& tl = topLeft_;
    const auto& br = bottomRight_;

    return Bounds(Point((tl.x + br.x) / 2.0, tl.y),
                  Point(br.x, (tl.y + br.y) / 2.0));
}

Bounds Bounds::getBottomRightQuadrant() const {
    const auto& tl = topLeft_;
    const auto& br = bottomRight_;

    return Bounds(Point((tl.x + br.x) / 2.0, (tl.y + br.y) / 2.0),
                  br);
}

Bounds Bounds::getBottomLeftQuadrant() const {
    const auto& tl = topLeft_;
    const auto& br = bottomRight_;

    return Bounds(Point(tl.x, (tl.y + br.y) / 2.0),
                  Point((tl.x + br.x) / 2.0, br.y));
}

Point Bounds::getMidpoint() const {
    return Point((topLeft_.x + bottomRight_.x) / 2, (topLeft_.y + bottomRight_.y) / 2);
}

Bounds Bounds::intersect(const Bounds& other) const {
    auto tl = Point(std::max(topLeft_.x, other.topLeft_.x), std::max(topLeft_.y, other.topLeft_.y));
    auto br = Point(std::min(bottomRight_.x, other.bottomRight_.x), std::min(bottomRight_.y, other.bottomRight_.y));

    return Bounds(tl, br);
}

bool operator == (const Bounds& lhs, const Bounds& rhs) {
    return lhs.topLeft_ == rhs.topLeft_ && lhs.bottomRight_ == rhs.bottomRight_;
}

namespace helpers {

Bounds getBounds(const std::vector<Point>& points) {
    assert(points.size() > 0);

    auto xMax = - std::numeric_limits<double>::infinity();
    auto xMin =   std::numeric_limits<double>::infinity();

    auto yMax = - std::numeric_limits<double>::infinity();
    auto yMin =   std::numeric_limits<double>::infinity();

    for (const auto& p : points) {
        xMax = std::max(xMax, p.x);
        xMin = std::min(xMin, p.x);

        yMax = std::max(yMax, p.y);
        yMin = std::min(yMin, p.y);
    }

    xMax = nextGreater(xMax);
    yMax = nextGreater(yMax);

    return Bounds(Point(xMin, yMin), Point(xMax, yMax));
}

double nextGreater(double x) {
    return std::nextafter(x, std::numeric_limits<double>::max());
}

double nextSmaller(double x) {
    return std::nextafter(x, std::numeric_limits<double>::min());
}

Bounds getClosedBounds(const Bounds& openBounds) {
    auto topLeft = openBounds.getTopLeftCorner();
    auto bottomRight = openBounds.getBottomRightCorner();

    auto closedBottomRight = Point(nextSmaller(bottomRight.x), nextSmaller(bottomRight.y));

    Bounds closedBounds(topLeft, closedBottomRight);

    assert(openBounds.contain(closedBounds));
    assert(!closedBounds.contain(openBounds));

    return closedBounds;
}

}
