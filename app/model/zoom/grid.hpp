#pragma once

#include "bounds.hpp"
#include <vector>
#include <algorithm>

class Grid {
public:
    typedef std::vector<double> Axis;

public:
    Grid(const Bounds& bounds, int maxLevel);

    Axis getXAxis(double from, double to, int level) const;
    Axis getYAxis(double from, double to, int level) const;

    int getMaxLevel() const { return xAxes_.size() - 1; }

private:
    Axis getAxis(const std::vector<Axis>& axes, double from, double to, int level) const;

    void fillAxes(std::vector<Axis>& axes, double from, double to, int maxLevel);

private:
    std::vector<Axis> xAxes_;
    std::vector<Axis> yAxes_;
};

struct Axes {
    Grid::Axis x;
    Grid::Axis y;
};

namespace helpers {

template<class T>
typename std::vector<T>::const_iterator getLastLessOrEqual(const std::vector<T>& vec, T val) {
    auto candidate = std::upper_bound(vec.begin(), vec.end(), val);

    if (candidate != vec.begin()) {
        return --candidate;
    } else {
        return candidate;
    }
}

template<class T>
typename std::vector<T>::const_iterator getFirstGreaterOrEqual(const std::vector<T>& vec, T val) {
    return std::lower_bound(vec.begin(), vec.end(), val);
}

}