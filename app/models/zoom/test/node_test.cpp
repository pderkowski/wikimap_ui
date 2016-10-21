#include "catch.hpp"
#include "node.hpp"
#include "bounds.hpp"
#include "point.hpp"
#include "datapoint.hpp"

TEST_CASE("Given a point, Node::getChildContainingPoint returns a child node that contains this point", "[node]") {
    Bounds bounds(Point(0, 0), Point(4, 4));

    Node node(bounds, Index(0, 0, 0), 1);
    node.insert(Datapoint(1, 1, 0));
    node.insert(Datapoint(1, 2, 0));

    REQUIRE(node.isLeaf()==false);

    Point p00(0, 0), p10(1, 0), p20(2, 0), p30(3, 0),
          p01(0, 1), p11(1, 1), p21(2, 1), p31(3, 1),
          p02(0, 2), p12(1, 2), p22(2, 2), p32(3, 2),
          p03(0, 3), p13(1, 3), p23(2, 3), p33(3, 3);

    Node* tl = node.getChildren().getTopLeft();
    Node* tr = node.getChildren().getTopRight();
    Node* br = node.getChildren().getBottomRight();
    Node* bl = node.getChildren().getBottomLeft();

    REQUIRE(node.getChildContainingPoint(p00)==tl);
    REQUIRE(node.getChildContainingPoint(p10)==tl);
    REQUIRE(node.getChildContainingPoint(p20)==tr);
    REQUIRE(node.getChildContainingPoint(p30)==tr);
    REQUIRE(node.getChildContainingPoint(p01)==tl);
    REQUIRE(node.getChildContainingPoint(p11)==tl);
    REQUIRE(node.getChildContainingPoint(p21)==tr);
    REQUIRE(node.getChildContainingPoint(p31)==tr);
    REQUIRE(node.getChildContainingPoint(p02)==bl);
    REQUIRE(node.getChildContainingPoint(p12)==bl);
    REQUIRE(node.getChildContainingPoint(p22)==br);
    REQUIRE(node.getChildContainingPoint(p32)==br);
    REQUIRE(node.getChildContainingPoint(p03)==bl);
    REQUIRE(node.getChildContainingPoint(p13)==bl);
    REQUIRE(node.getChildContainingPoint(p23)==br);
    REQUIRE(node.getChildContainingPoint(p33)==br);
}

TEST_CASE("A node can recognize whether it is a leaf or not", "[node]") {
    Bounds bounds(Point(0, 0), Point(4, 4));
    Node node(bounds, Index(0, 0, 0), 1);

    REQUIRE(node.isLeaf()==true);

    node.insert(Datapoint(1, 1, 0));
    node.insert(Datapoint(1, 2, 0));

    REQUIRE(node.isLeaf()==false);
}

TEST_CASE("Insertion to a node that is a leaf and not full, stores the point in this node without creating children", "[node]") {
    Node node(Bounds(Point(0, 0), Point(4, 4)), Index(0, 0, 0), 1);

    REQUIRE(node.isLeaf());

    Point p(2, 2);

    node.insert(Datapoint(p, 0));

    REQUIRE(node.isLeaf());

    auto inserted = node.getDatapoints();

    REQUIRE((inserted.size() == 1 && inserted[0].p == p) == true);
}

TEST_CASE("Insertion to a node that is a leaf and full, creates children and stores the point in the one containing the point", "[node]") {
    Node node(Bounds(Point(0, 0), Point(4, 4)), Index(0, 0, 0), 1);

    Point p1(3, 3);
    node.insert(Datapoint(p1, 0));

    REQUIRE(node.isLeaf());

    Point p2(1, 1);
    node.insert(Datapoint(p2, 0));

    REQUIRE(!node.isLeaf());

    Node* topLeft = node.getChildren().getTopLeft();

    REQUIRE((topLeft->getDatapoints().size() == 1 && topLeft->getDatapoints()[0].p == p2) == true);
}

TEST_CASE("Insertion to a node that is not a leaf and full, inserts the point in a child containing the point", "[node]") {
    Node node(Bounds(Point(0, 0), Point(4, 4)), Index(0, 0, 0), 1);

    Point p1(1, 1);
    Point p2(3, 3);

    node.insert(Datapoint(p1, 0));
    node.insert(Datapoint(p2, 0));

    REQUIRE(node.isLeaf() == false);

    Point p3(3, 1);

    node.insert(Datapoint(p3, 0));

    Node* topRight = node.getChildren().getTopRight();

    REQUIRE((topRight->getDatapoints().size() == 1 && topRight->getDatapoints()[0].p == p3) == true);
}

TEST_CASE("Node::getMaxDepth returns a correct depth of the tree rooted in this node.", "[node]") {
    Node node(Bounds(Point(0, 0), Point(4, 4)), Index(0, 0, 0), 1);

    REQUIRE(node.getMaxDepth() == 0);

    Point p1(1, 1);
    Point p2(3, 3);

    node.insert(Datapoint(p1, 0));
    node.insert(Datapoint(p2, 0));

    REQUIRE(node.getMaxDepth() == 1);

    node.insert(Datapoint(0, 0, 0));

    REQUIRE(node.getMaxDepth() == 2);
}

TEST_CASE("Node::getDepthAtPoint returns correct depths at given points.", "[node]") {
    Node node(Bounds(Point(0, 0), Point(4, 4)), Index(0, 0, 0), 1);

    Point testPoint1(0.0, 0.0);
    Point testPoint2(2.0, 2.0);
    Point testPoint3(3.0, 3.0);

    REQUIRE(node.getDepthAtPoint(testPoint1)==0);
    REQUIRE(node.getDepthAtPoint(testPoint2)==0);
    REQUIRE(node.getDepthAtPoint(testPoint3)==0);

    node.insert(Datapoint(2.0, 2.0, 0));
    node.insert(Datapoint(1.0, 1.0, 0));
    node.insert(Datapoint(0.0, 0.0, 0));

    REQUIRE(node.getDepthAtPoint(testPoint1)==2);
    REQUIRE(node.getDepthAtPoint(testPoint2)==1);
    REQUIRE(node.getDepthAtPoint(testPoint3)==1);
}

TEST_CASE("Node::insert copies datapoints to lower levels on split.", "[node]") {
    Node node(Bounds(Point(0, 0), Point(4, 4)), Index(0, 0, 0), 2);

    node.insert(Datapoint(2.0, 2.0, 0));
    node.insert(Datapoint(1.0, 1.0, 0));
    node.insert(Datapoint(0.0, 0.0, 0));

    auto topLeft = node.getChildContainingPoint(Point(0, 0));
    auto datapoints = topLeft->getDatapoints();

    REQUIRE(datapoints.size() == 2);
    REQUIRE(datapoints[0].p == Point(1, 1));
    REQUIRE(datapoints[1].p == Point(0, 0));
}