#pragma once

struct Index {
public:
    Index(int x, int y, int z)
    : x(x), y(y), z(z)
    { }

    Index getTopLeftSubindex() const { return Index{x * 2, y * 2, z + 1}; }
    Index getTopRightSubindex() const { return Index{x * 2 + 1, y * 2, z + 1}; }
    Index getBottomRightSubindex() const { return Index{x * 2 + 1, y * 2 + 1, z + 1}; }
    Index getBottomLeftSubindex() const { return Index{x * 2, y * 2 + 1, z + 1}; }

    int x;
    int y;
    int z;

    bool operator == (const Index& other) const {
        return x == other.x && y == other.y && z == other.z;
    }
};
