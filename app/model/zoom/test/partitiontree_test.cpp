#include "catch.hpp"
#include "partitiontree.hpp"
#include "bounds.hpp"

TEST_CASE("Partitiontree creates and gets correct buckets", "[partitiontree]") {
    PartitionTree pt(Bounds(Point(0, 0), Point(4, 4)), 2);

    for (int i = 0; i < 4; ++i) {
        for (int j = 0; j < 4; ++j) {
            pt.insert(Point(j, i));
        }
    }

    SECTION("Partitiontree::getPoints queries return correct points.") {
        auto q1 = pt.getPoints(Index(0, 0, 0));
        auto q2 = pt.getPoints(Index(1, 0, 1));
        auto q3 = pt.getPoints(Index(1, 1, 1));
        auto q4 = pt.getPoints(Index(1, 0, 2));
        auto q5 = pt.getPoints(Index(2, 3, 2));
        auto q6 = pt.getPoints(Index(0, 0, 3));
        auto q7 = pt.getPoints(Index(1, 0, 3));

        REQUIRE((q1.size() == 2 && q1[0] == Point(0, 0) && q1[1] == Point(1, 0))==true);
        REQUIRE((q2.size() == 2 && q2[0] == Point(2, 0) && q2[1] == Point(3, 0))==true);
        REQUIRE((q3.size() == 2 && q3[0] == Point(2, 2) && q3[1] == Point(3, 2))==true);
        REQUIRE((q4.size() == 1 && q4[0] == Point(1, 0))==true);
        REQUIRE((q5.size() == 1 && q5[0] == Point(2, 3))==true);
        REQUIRE((q6.size() == 1 && q6[0] == Point(0, 0))==true);
        REQUIRE((q7.size() == 0)==true);
    }
}
