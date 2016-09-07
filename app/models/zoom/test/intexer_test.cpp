#include "catch.hpp"
#include "indexer.hpp"

TEST_CASE("Indexer::indexToPoint returns the middle point of bounds specified by the index", "[indexer]") {
    Bounds bounds(Point2D(0,0), Point2D(8,8));

    Indexer indexer(bounds);

    REQUIRE(indexer.indexToPoint(Index(0, 0, 0)) == Point2D(4, 4));

    REQUIRE(indexer.indexToPoint(Index(0, 0, 1)) == Point2D(2, 2));
    REQUIRE(indexer.indexToPoint(Index(1, 0, 1)) == Point2D(6, 2));
    REQUIRE(indexer.indexToPoint(Index(0, 1, 1)) == Point2D(2, 6));
    REQUIRE(indexer.indexToPoint(Index(1, 1, 1)) == Point2D(6, 6));

    REQUIRE(indexer.indexToPoint(Index(0, 0, 2)) == Point2D(1, 1));
    REQUIRE(indexer.indexToPoint(Index(1, 1, 2)) == Point2D(3, 3));
    REQUIRE(indexer.indexToPoint(Index(2, 2, 2)) == Point2D(5, 5));
    REQUIRE(indexer.indexToPoint(Index(3, 3, 2)) == Point2D(7, 7));
}

TEST_CASE("Indexer::pointToIndex returns a correct index for a given point", "[indexer]") {
    Bounds bounds(Point2D(0,0), Point2D(8,8));

    Indexer indexer(bounds);

    REQUIRE(indexer.pointToIndex(Point2D(4, 4), 0) == Index(0, 0, 0));

    REQUIRE(indexer.pointToIndex(Point2D(2, 2), 1) == Index(0, 0, 1));
    REQUIRE(indexer.pointToIndex(Point2D(6, 2), 1) == Index(1, 0, 1));
    REQUIRE(indexer.pointToIndex(Point2D(2, 6), 1) == Index(0, 1, 1));
    REQUIRE(indexer.pointToIndex(Point2D(6, 6), 1) == Index(1, 1, 1));

    REQUIRE(indexer.pointToIndex(Point2D(1, 1), 2) == Index(0, 0, 2));
    REQUIRE(indexer.pointToIndex(Point2D(3, 3), 2) == Index(1, 1, 2));
    REQUIRE(indexer.pointToIndex(Point2D(5, 5), 2) == Index(2, 2, 2));
    REQUIRE(indexer.pointToIndex(Point2D(7, 7), 2) == Index(3, 3, 2));
}