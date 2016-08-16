#include "catch.hpp"
#include "grid.hpp"
#include "bounds.hpp"
#include <algorithm>
#include <cmath>
#include <climits>

TEST_CASE("Axes have correct sizes and are sorted.", "[grid]") {
    Bounds bounds(Point(0, 0), Point(1, 1));

    int depth = 5;
    Grid grid(bounds, depth);

    for (int i = 0; i <= depth; ++i) {
        auto xAxis = grid.getXAxis(-0.5, 1.5, i);
        auto yAxis = grid.getYAxis(-0.5, 1.5, i);

        int correctSize = (i == 0)? 4 : (3 + (int)pow(2, i));

        REQUIRE(xAxis.size() == correctSize);
        REQUIRE(yAxis.size() == correctSize);

        REQUIRE(std::is_sorted(xAxis.begin(), xAxis.end()));
        REQUIRE(std::is_sorted(yAxis.begin(), yAxis.end()));
    }
}

TEST_CASE("Grid ticks match bounds partitions.", "[grid]") {
    Bounds bounds(Point(0, 0), Point(1.0 / 3, 1.0 / 3));

    Grid grid(bounds, 3);

    auto inf = std::numeric_limits<double>::infinity();
    auto negInf = -inf;

    auto t0 = bounds.getTopLeftQuadrant().getTopLeftQuadrant().getTopLeftQuadrant().getTopLeftCorner().x;
    auto t1 = bounds.getTopLeftQuadrant().getTopLeftQuadrant().getBottomRightQuadrant().getTopLeftCorner().x;
    auto t2 = bounds.getTopLeftQuadrant().getBottomRightQuadrant().getTopLeftQuadrant().getTopLeftCorner().x;
    auto t3 = bounds.getTopLeftQuadrant().getBottomRightQuadrant().getBottomRightQuadrant().getTopLeftCorner().x;
    auto t4 = bounds.getBottomRightQuadrant().getTopLeftQuadrant().getTopLeftQuadrant().getTopLeftCorner().x;
    auto t5 = bounds.getBottomRightQuadrant().getTopLeftQuadrant().getBottomRightQuadrant().getTopLeftCorner().x;
    auto t6 = bounds.getBottomRightQuadrant().getBottomRightQuadrant().getTopLeftQuadrant().getTopLeftCorner().x;
    auto t7 = bounds.getBottomRightQuadrant().getBottomRightQuadrant().getBottomRightQuadrant().getTopLeftCorner().x;
    auto t8 = bounds.getBottomRightQuadrant().getBottomRightQuadrant().getBottomRightQuadrant().getBottomRightCorner().x;

    std::vector<decltype(t0)> ticks0 = { negInf, t0, t8, inf };
    decltype(ticks0) ticks1 = { negInf, t0, t4, t8, inf };
    decltype(ticks0) ticks2 = { negInf, t0, t2, t4, t6, t8, inf };
    decltype(ticks0) ticks3 = { negInf, t0, t1, t2, t3, t4, t5, t6, t7, t8, inf };

    auto xAxis0 = grid.getXAxis(-0.5, 0.5, 0);
    auto xAxis1 = grid.getXAxis(-0.5, 0.5, 1);
    auto xAxis2 = grid.getXAxis(-0.5, 0.5, 2);
    auto xAxis3 = grid.getXAxis(-0.5, 0.5, 3);

    auto yAxis0 = grid.getYAxis(-0.5, 0.5, 0);
    auto yAxis1 = grid.getYAxis(-0.5, 0.5, 1);
    auto yAxis2 = grid.getYAxis(-0.5, 0.5, 2);
    auto yAxis3 = grid.getYAxis(-0.5, 0.5, 3);

    REQUIRE(xAxis0 == ticks0);
    REQUIRE(xAxis1 == ticks1);
    REQUIRE(xAxis2 == ticks2);
    REQUIRE(xAxis3 == ticks3);

    REQUIRE(yAxis0 == ticks0);
    REQUIRE(yAxis1 == ticks1);
    REQUIRE(yAxis2 == ticks2);
    REQUIRE(yAxis3 == ticks3);
}

TEST_CASE("Getting ranges of axes returns a correct range.", "[grid]") {
    Bounds bounds(Point(0, 0), Point(1, 1));

    Grid grid(bounds, 3);

    auto inf = std::numeric_limits<double>::infinity();
    auto negInf = -inf;

    Grid::Axis ticks;
    ticks.push_back(negInf);
    for (int i = 0; i <= 8; ++i) { ticks.push_back(i / 8.0); }
    ticks.push_back(inf);

    SECTION ("(Negative) infinity and a first (last) tick if a range beyond bounds is requested.", "[grid]") {
        auto firstTwo = decltype(ticks)(ticks.begin(), ticks.begin() + 2);
        auto lastTwo = decltype(ticks)(ticks.end() - 2, ticks.end());

        REQUIRE(grid.getXAxis(-0.5, -0.1, 0) == firstTwo);
        REQUIRE(grid.getXAxis(-0.5, -0.1, 1) == firstTwo);
        REQUIRE(grid.getXAxis(-0.5, -0.1, 2) == firstTwo);
        REQUIRE(grid.getXAxis(-0.5, -0.1, 3) == firstTwo);

        REQUIRE(grid.getYAxis(1.1, 1.5, 0) == lastTwo);
        REQUIRE(grid.getYAxis(1.1, 1.5, 1) == lastTwo);
        REQUIRE(grid.getYAxis(1.1, 1.5, 2) == lastTwo);
        REQUIRE(grid.getYAxis(1.1, 1.5, 3) == lastTwo);
    }

    SECTION ("A correct slice if a range inside bounds is requested.", "[grid]") {
        double from = 1 / 8.0;
        double to = 5 / 8.0;

        auto expectedSliceLevel0 = decltype(ticks)({ ticks[1], ticks[9] });
        auto expectedSliceLevel1 = decltype(ticks)({ ticks[1], ticks[5], ticks[9] });
        auto expectedSliceLevel2 = decltype(ticks)({ ticks[1], ticks[3], ticks[5], ticks[7] });
        auto expectedSliceLevel3 = decltype(ticks)(ticks.begin() + 2, ticks.begin() + 7);

        REQUIRE(grid.getXAxis(from, to, 0) == expectedSliceLevel0);
        REQUIRE(grid.getXAxis(from, to, 1) == expectedSliceLevel1);
        REQUIRE(grid.getXAxis(from, to, 2) == expectedSliceLevel2);
        REQUIRE(grid.getXAxis(from, to, 3) == expectedSliceLevel3);

        REQUIRE(grid.getYAxis(from, to, 0) == expectedSliceLevel0);
        REQUIRE(grid.getYAxis(from, to, 1) == expectedSliceLevel1);
        REQUIRE(grid.getYAxis(from, to, 2) == expectedSliceLevel2);
        REQUIRE(grid.getYAxis(from, to, 3) == expectedSliceLevel3);
    }
}