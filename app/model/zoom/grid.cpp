#include "grid.hpp"
#include <cassert>
#include <limits>

const double infinity = std::numeric_limits<double>::infinity();

Grid::Grid(const Bounds& bounds, int maxLevel)
{
    assert(maxLevel >= 0);

    auto tl = bounds.getTopLeftCorner();
    auto br = bounds.getBottomRightCorner();

    fillAxes(xAxes_, tl.x, br.x, maxLevel);
    fillAxes(yAxes_, tl.y, br.y, maxLevel);
}

void Grid::fillAxes(std::vector<Axis>& axes, double from, double to, int maxLevel) {
    assert(from < to);

    axes.clear();

    axes.push_back(Axis({ -infinity, from, to, infinity }));

    for (int i = 1; i <= maxLevel; ++i) {
        axes.push_back(Axis{});

        axes.back().push_back(axes[i - 1][0]);

        for (int t = 1; t < axes[i - 1].size() - 2; ++t) {
            auto tick = axes[i - 1][t];
            auto nextTick = axes[i - 1][t + 1];

            axes.back().push_back(tick);
            axes.back().push_back((tick + nextTick) / 2.0);
        }

        axes.back().push_back(axes[i - 1][axes[i - 1].size() - 2]);
        axes.back().push_back(axes[i - 1][axes[i - 1].size() - 1]);
    }
}

Grid::Axis Grid::getXAxis(double from, double to, int level) const {
    return getAxis(xAxes_, from, to, level);
}

Grid::Axis Grid::getYAxis(double from, double to, int level) const {
    return getAxis(yAxes_, from, to, level);
}

Grid::Axis Grid::getAxis(const std::vector<Axis>& axes, double from, double to, int level) const {
    assert(level >= 0);
    assert(level < axes.size());
    assert(from < to);

    const auto& axis = axes[level];

    assert(!axis.empty());

    auto start = helpers::getLastLessOrEqual(axis, from);
    auto end = helpers::getFirstGreaterOrEqual(axis, to);

    if (end != axis.end()) {
        ++end; // include element pointed to by end in the final range
    }

    return Axis(start, end);
}