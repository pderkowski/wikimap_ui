#include "catch.hpp"
#include "node.hpp"
#include "bounds.hpp"


TEST_CASE("Given a point, Node::getChildContainingPoint returns a child node that contains this point", "[node]") {
    Data dummy{0, ""};

    Bounds bounds(Point2D(0, 0), Point2D(4, 4));

    Node node(bounds, 1);
    node.insert(Point2D(1, 1), dummy);
    node.insert(Point2D(1, 2), dummy);

    REQUIRE(node.isLeaf()==false);

    Point2D p00(0, 0), p10(1, 0), p20(2, 0), p30(3, 0),
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
    Data dummy{0, ""};

    Bounds bounds(Point2D(0, 0), Point2D(4, 4));
    Node node(bounds, 1);

    REQUIRE(node.isLeaf()==true);

    node.insert(Point2D(1, 1), dummy);
    node.insert(Point2D(1, 2), dummy);

    REQUIRE(node.isLeaf()==false);
}

TEST_CASE("Insertion to a node that is a leaf and not full, stores the point in this node without creating children", "[node]") {
    Data dummy{0, ""};

    Node node(Bounds(Point2D(0, 0), Point2D(4, 4)), 1);

    REQUIRE(node.isLeaf());

    Point2D p(2, 2);

    node.insert(p, dummy);

    REQUIRE(node.isLeaf());

    auto inserted = node.getDatapoints();

    REQUIRE((inserted.size() == 1 && inserted[0].point.to2D() == p) == true);
}

TEST_CASE("Insertion to a node that is a leaf and full, creates children and stores the point in the one containing the point", "[node]") {
    Data dummy{0, ""};

    Node node(Bounds(Point2D(0, 0), Point2D(4, 4)), 1);

    Point2D p1(3, 3);
    node.insert(p1, dummy);

    REQUIRE(node.isLeaf());

    Point2D p2(1, 1);
    node.insert(p2, dummy);

    REQUIRE(!node.isLeaf());

    Node* topLeft = node.getChildren().getTopLeft();

    REQUIRE((topLeft->getDatapoints().size() == 1 && topLeft->getDatapoints()[0].point.to2D() == p2) == true);
}

TEST_CASE("Insertion to a node that is not a leaf and full, inserts the point in a child containing the point", "[node]") {
    Data dummy{0, ""};

    Node node(Bounds(Point2D(0, 0), Point2D(4, 4)), 1);

    Point2D p1(1, 1);
    Point2D p2(3, 3);

    node.insert(p1, dummy);
    node.insert(p2, dummy);

    REQUIRE(node.isLeaf() == false);

    Point2D p3(3, 1);

    node.insert(p3, dummy);

    Node* topRight = node.getChildren().getTopRight();

    REQUIRE((topRight->getDatapoints().size() == 1 && topRight->getDatapoints()[0].point.to2D() == p3) == true);
}

TEST_CASE("Node::getMaxDepth returns a correct depth of the tree rooted in this node.", "[node]") {
    Data dummy{0, ""};

    Node node(Bounds(Point2D(0, 0), Point2D(4, 4)), 1);

    REQUIRE(node.getMaxDepth() == 0);

    node.insert(Point2D(1, 1), dummy);
    node.insert(Point2D(3, 3), dummy);

    REQUIRE(node.getMaxDepth() == 1);

    node.insert(Point2D(0, 0), dummy);

    REQUIRE(node.getMaxDepth() == 2);
}

TEST_CASE("Node::getDepthAtPoint returns correct depths at given points.", "[node]") {
    Data dummy{0, ""};

    Node node(Bounds(Point2D(0, 0), Point2D(4, 4)), 1);

    Point2D testPoint1(0.0, 0.0);
    Point2D testPoint2(2.0, 2.0);
    Point2D testPoint3(3.0, 3.0);

    REQUIRE(node.getDepthAtPoint(testPoint1)==0);
    REQUIRE(node.getDepthAtPoint(testPoint2)==0);
    REQUIRE(node.getDepthAtPoint(testPoint3)==0);

    node.insert(Point2D(2.0, 2.0), dummy);
    node.insert(Point2D(1.0, 1.0), dummy);
    node.insert(Point2D(0.0, 0.0), dummy);

    REQUIRE(node.getDepthAtPoint(testPoint1)==2);
    REQUIRE(node.getDepthAtPoint(testPoint2)==1);
    REQUIRE(node.getDepthAtPoint(testPoint3)==1);
}

TEST_CASE("Node::insert copies datapoints to lower levels on split.", "[node]") {
    Data dummy{0, ""};

    Node node(Bounds(Point2D(0, 0), Point2D(4, 4)), 2);

    node.insert(Point2D(2.0, 2.0), dummy);
    node.insert(Point2D(1.0, 1.0), dummy);
    node.insert(Point2D(0.0, 0.0), dummy);

    auto topLeft = node.getChildContainingPoint(Point2D(0, 0));
    auto datapoints = topLeft->getDatapoints();

    REQUIRE(datapoints.size() == 2);
    REQUIRE(datapoints[0].point == Point3D(1, 1, 0));
    REQUIRE(datapoints[1].point == Point3D(0, 0, 1));
}