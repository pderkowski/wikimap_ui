#include <vector>
#include <algorithm>
#include <limits>
#include <cmath>
#include "catch.hpp"
#include "bounds.hpp"

TEST_CASE("Point2D comparison returns true for equivalent points and false otherwise", "[point]") {
    Point2D p1(0, 0);
    Point2D p2(0, 0);
    Point2D p3(0, 1);
    Point2D p4(1, 0);

    REQUIRE(p1 == p2);
    REQUIRE((p1 == p3) == false);
    REQUIRE((p1 == p4) == false);
}

TEST_CASE("Bounds.contain returns true for points inside", "[bounds]") {
    Bounds bounds(Point2D(-1, -1), Point2D(1, 1));

    SECTION("definitely inside") {
        Point2D p(0, 0);
        REQUIRE(bounds.contain(p)==true);
    }

    SECTION("on the left edge") {
        Point2D l(-1, 0);
        REQUIRE(bounds.contain(l)==true);
    }

    SECTION("on the top edge") {
        Point2D t(0, -1);
        REQUIRE(bounds.contain(t)==true);
    }

    SECTION("top-left corner") {
        Point2D tl(-1, -1);
        REQUIRE(bounds.contain(tl)==true);
    }
}

TEST_CASE("Bounds::contain returns true for bounds inside", "[bounds]") {
    Bounds bounds(Point2D(0, 0), Point2D(2, 2));

    REQUIRE(bounds.contain(Bounds(Point2D(0, 0), Point2D(1, 1))) == true);
    REQUIRE(bounds.contain(Bounds(Point2D(1, 1), Point2D(2, 2))) == true);
    REQUIRE(bounds.contain(Bounds(Point2D(0, 0), Point2D(2, 2))) == true);
    REQUIRE(bounds.contain(Bounds(Point2D(0.5, 0.5), Point2D(1.5, 1.5))) == true);
}

TEST_CASE("Bounds::contain returns false for bounds outside", "[bounds]") {
    Bounds bounds(Point2D(0, 0), Point2D(2, 2));

    REQUIRE(bounds.contain(Bounds(Point2D(-2, -2), Point2D(-1, -1))) == false);
    REQUIRE(bounds.contain(Bounds(Point2D(-2, -2), Point2D(3, 3))) == false);
    REQUIRE(bounds.contain(Bounds(Point2D(-2, -2), Point2D(1, 1))) == false);
}

TEST_CASE("Bounds.contain returns false for points outside", "[bounds]") {
    Bounds bounds(Point2D(-1, -1), Point2D(1, 1));

    SECTION("definitely outside") {
        Point2D p(2, 2);
        REQUIRE(bounds.contain(p)==false);
    }

    SECTION("on the right edge") {
        Point2D l(1, 0);
        REQUIRE(bounds.contain(l)==false);
    }

    SECTION("on the bottom edge") {
        Point2D t(0, 1);
        REQUIRE(bounds.contain(t)==false);
    }

    SECTION("top-right corner") {
        Point2D tr(1, -1);
        REQUIRE(bounds.contain(tr)==false);
    }

    SECTION("bottom-right corner") {
        Point2D br(1, 1);
        REQUIRE(bounds.contain(br)==false);
    }

    SECTION("bottom-left corner") {
        Point2D bl(-1, 1);
        REQUIRE(bounds.contain(bl)==false);
    }
}

void shiftPoints(std::vector<Point2D>& points, double xShift, double yShift) {
    for (auto& p : points) {
        p.x += xShift;
        p.y += yShift;
    }
}

TEST_CASE("Bounds quadrant getters return correct sub-bounds.", "[bounds]") {
    Bounds bounds(Point2D(0, 0), Point2D(2, 2));

    std::vector<Point2D> insidePoints = {
        Point2D(0.0, 0.0), Point2D(0.5, 0.0),
        Point2D(0.0, 0.5), Point2D(0.5, 0.5)
    };
    std::vector<Point2D> outsidePoints = {
        Point2D(-0.5, -0.5), Point2D(0.0, -0.5), Point2D(0.5, -0.5), Point2D(1.0, -0.5), Point2D(1.5, -0.5),
        Point2D(-0.5,  0.0),                                     Point2D(1.0,  0.0), Point2D(1.5,  0.0),
        Point2D(-0.5,  0.5),                                     Point2D(1.0,  0.5), Point2D(1.5,  0.5),
        Point2D(-0.5,  1.0),                                     Point2D(1.0,  1.0), Point2D(1.5,  1.0),
        Point2D(-0.5,  1.5), Point2D(0.0,  1.5), Point2D(0.5,  1.5), Point2D(1.0,  1.5), Point2D(1.5,  1.5)
    };

    SECTION("top-left quadrant") {
        auto q = bounds.getTopLeftQuadrant();

        double xShift = 0.0;
        double yShift = 0.0;

        shiftPoints(insidePoints, xShift, yShift);
        shiftPoints(outsidePoints, xShift, yShift);

        REQUIRE(std::all_of(insidePoints.begin(), insidePoints.end(), [&q] (const Point2D& p) { return q.contain(p); }) == true);
        REQUIRE(std::all_of(outsidePoints.begin(), outsidePoints.end(), [&q] (const Point2D& p) { return !q.contain(p); }) == true);
    }

    SECTION("top-right quadrant") {
        auto q = bounds.getTopRightQuadrant();

        double xShift = 1.0;
        double yShift = 0.0;

        shiftPoints(insidePoints, xShift, yShift);
        shiftPoints(outsidePoints, xShift, yShift);

        REQUIRE(std::all_of(insidePoints.begin(), insidePoints.end(), [&q] (const Point2D& p) { return q.contain(p); }) == true);
        REQUIRE(std::all_of(outsidePoints.begin(), outsidePoints.end(), [&q] (const Point2D& p) { return !q.contain(p); }) == true);
    }

    SECTION("bottom-right quadrant") {
        auto q = bounds.getBottomRightQuadrant();

        double xShift = 1.0;
        double yShift = 1.0;

        shiftPoints(insidePoints, xShift, yShift);
        shiftPoints(outsidePoints, xShift, yShift);

        REQUIRE(std::all_of(insidePoints.begin(), insidePoints.end(), [&q] (const Point2D& p) { return q.contain(p); }) == true);
        REQUIRE(std::all_of(outsidePoints.begin(), outsidePoints.end(), [&q] (const Point2D& p) { return !q.contain(p); }) == true);
    }

    SECTION("bottom-left quadrant") {
        auto q = bounds.getBottomLeftQuadrant();

        double xShift = 0.0;
        double yShift = 1.0;

        shiftPoints(insidePoints, xShift, yShift);
        shiftPoints(outsidePoints, xShift, yShift);

        REQUIRE(std::all_of(insidePoints.begin(), insidePoints.end(), [&q] (const Point2D& p) { return q.contain(p); }) == true);
        REQUIRE(std::all_of(outsidePoints.begin(), outsidePoints.end(), [&q] (const Point2D& p) { return !q.contain(p); }) == true);
    }
}

TEST_CASE("helpers::getBounds returns smallest bounds such that all points are contained", "[bounds]") {
    double doubleMin = std::numeric_limits<double>::min();
    double doubleMax = std::numeric_limits<double>::max();

    Point2D p1(1, 0);
    Point2D p2(2, 1);
    Point2D p3(1, 2);
    Point2D p4(0, 1);

    std::vector<Point2D> points { p1, p2, p3, p4 };

    auto bounds = helpers::getBounds(points);

    Point2D topLeft(0, 0);
    Point2D bottomRight(2, 2);

    SECTION("All points inside") {
        REQUIRE(std::all_of(points.begin(), points.end(), [&bounds] (const Point2D& p) { return bounds.contain(p); }) == true);
        REQUIRE(bounds.contain(topLeft) == true);
        REQUIRE(bounds.contain(bottomRight) == true);
    }

    SECTION("Top bound cannot be any greater") {
        topLeft.y = std::nextafter(topLeft.y, doubleMax);

        Bounds smaller(topLeft, bottomRight);
        REQUIRE(std::all_of(points.begin(), points.end(), [&smaller] (const Point2D& p) { return smaller.contain(p); }) == false);
    }

    SECTION("Left bound cannot be any greater") {
        topLeft.x = std::nextafter(topLeft.x, doubleMax);

        Bounds smaller(topLeft, bottomRight);
        REQUIRE(std::all_of(points.begin(), points.end(), [&smaller] (const Point2D& p) { return smaller.contain(p); }) == false);
    }

    SECTION("Right bound cannot be any smaller") {
        bottomRight.x = std::nextafter(bottomRight.x, doubleMin);

        Bounds smaller(topLeft, bottomRight);
        REQUIRE(std::all_of(points.begin(), points.end(), [&smaller] (const Point2D& p) { return smaller.contain(p); }) == false);
    }

    SECTION("Bottom bound cannot be any smaller") {
        bottomRight.y = std::nextafter(bottomRight.y, doubleMin);

        Bounds smaller(topLeft, bottomRight);
        REQUIRE(std::all_of(points.begin(), points.end(), [&smaller] (const Point2D& p) { return smaller.contain(p); }) == false);
    }
}

TEST_CASE("Bounds::intersect return intersection of its arguments.", "[bounds]") {
    Point2D p1(0.0, 0.0);
    Point2D p2(1.0, 1.0);
    Point2D p3(2.0, 2.0);
    Point2D p4(3.0, 3.0);

    SECTION("Overlapping bounds") {
        Bounds b1(p1, p3);
        Bounds b2(p2, p4);

        auto intersection = b1.intersect(b2);

        REQUIRE(intersection.getTopLeftCorner() == p2);
        REQUIRE(intersection.getBottomRightCorner() == p3);
    }

    SECTION("Disjoint bounds") {
        Bounds b1(p1, p2);
        Bounds b2(p2, p3);

        auto intersection = b1.intersect(b2);

        REQUIRE(intersection.getTopLeftCorner() == intersection.getBottomRightCorner());
        REQUIRE(intersection.getTopLeftCorner() == p2);
    }
}