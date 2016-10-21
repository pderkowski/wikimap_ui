#include "catch.hpp"
#include "partitiontree.hpp"
#include "bounds.hpp"

TEST_CASE("Partitiontree creates and gets correct buckets", "[partitiontree]") {
    PartitionTree pt(Bounds(Point(0, 0), Point(4, 4)), 2);

    for (int i = 0; i < 4; ++i) {
        for (int j = 0; j < 4; ++j) {
            pt.insert(Datapoint(j, i, 0));
        }
    }

    SECTION("Partitiontree::getDatapoints queries return correct points.") {
        auto q1 = pt.getDatapoints(Index(0, 0, 0));
        auto q2 = pt.getDatapoints(Index(1, 0, 1));
        auto q3 = pt.getDatapoints(Index(1, 1, 1));
        auto q4 = pt.getDatapoints(Index(1, 0, 2));
        auto q5 = pt.getDatapoints(Index(2, 3, 2));
        auto q6 = pt.getDatapoints(Index(0, 0, 3));
        auto q7 = pt.getDatapoints(Index(1, 0, 3));

        REQUIRE((q1.size() == 2 && q1[0].p == Point(0, 0) && q1[1].p == Point(1, 0))==true);
        REQUIRE((q2.size() == 2 && q2[0].p == Point(2, 0) && q2[1].p == Point(3, 0))==true);
        REQUIRE((q3.size() == 2 && q3[0].p == Point(2, 2) && q3[1].p == Point(3, 2))==true);
        REQUIRE((q4.size() == 1 && q4[0].p == Point(1, 0))==true);
        REQUIRE((q5.size() == 1 && q5[0].p == Point(2, 3))==true);
        REQUIRE((q6.size() == 1 && q6[0].p == Point(0, 0))==true);
        REQUIRE((q7.size() == 0)==true);
    }
}
