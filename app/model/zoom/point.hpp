#pragma once

#include <cassert>
#include <vector>
#include <string>

struct Point2D {
    Point2D(double x, double y)
    : x(x), y(y)
    { }

    bool operator == (const Point2D& other) const { return x == other.x && y == other.y; }
    bool operator <= (const Point2D& other) const { return x <= other.x && y <= other.y; }

    double x;
    double y;
};

struct Point3D {
    Point3D(double x, double y, double z)
    : x(x), y(y), z(z)
    { }

    bool operator == (const Point3D& other) const { return x == other.x && y == other.y && z == other.z; }

    Point2D to2D() const { return Point2D(x, y); }

    double x;
    double y;
    double z;
};

struct Range {
public:
    Range(const Point2D& topLeft, const Point2D& bottomRight)
    : topLeft(topLeft), bottomRight(bottomRight)
    {
        assert(topLeft <= bottomRight);
    }

    Point2D topLeft;
    Point2D bottomRight;
};

typedef std::vector<Point2D> Points2D;
typedef std::vector<Point3D> Points3D;

