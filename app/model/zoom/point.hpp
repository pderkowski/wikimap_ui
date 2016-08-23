#pragma once

#include <cassert>
#include <vector>
#include <string>

struct Point2D {
    Point2D(double x, double y, const std::string& name = "")
    : x(x), y(y), name(name)
    { }

    bool operator == (const Point2D& other) const { return x == other.x && y == other.y && name == other.name; }
    bool operator <= (const Point2D& other) const { return x <= other.x && y <= other.y; }

    double x;
    double y;
    std::string name;
};

struct Point3D {
    Point3D(double x, double y, double z, const std::string& name = "")
    : x(x), y(y), z(z), name(name)
    { }

    bool operator == (const Point3D& other) const { return x == other.x && y == other.y && z == other.z && name == other.name; }

    double x;
    double y;
    double z;
    std::string name;
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

