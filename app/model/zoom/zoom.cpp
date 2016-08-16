#include "zoom.hpp"
#include <vector>
#include <algorithm>
#include <cassert>

Zoom::Zoom(const std::vector<Point>& points, int pointsPerTile)
: tree_(points, pointsPerTile), grid_(tree_.getBounds(), tree_.getDepth())
{ }

std::vector<Point> Zoom::getPoints(const Range& range, int zoomLevel) const {
    auto overlapping = getOverlappingBounds(Bounds(range));

    auto closedBounds = helpers::getClosedBounds(overlapping);

    auto topLeft = closedBounds.getTopLeftCorner();
    auto bottomRight = closedBounds.getBottomRightCorner();

    auto tlCoords = tree_.getBucketCoords(topLeft, zoomLevel);
    auto brCoords = tree_.getBucketCoords(bottomRight, zoomLevel);

    std::vector<Bucket> buckets;

    for (int x = tlCoords.x(); x <= brCoords.x(); ++x) {
        for (int y = tlCoords.y(); y <= brCoords.y(); ++y) {
            auto bucket = tree_.getBucket(BucketCoords(x, y, zoomLevel));
            if (std::find(buckets.begin(), buckets.end(), bucket) == buckets.end()) {
                buckets.push_back(bucket);
            }
        }
    }

    std::vector<Point> points;
    for (const auto& bucket : buckets) {
        auto bucketPoints = bucket.getPoints();
        points.insert(points.end(), bucketPoints.begin(), bucketPoints.end());
    }

    return points;
}

Bounds Zoom::getEnclosingBounds() const {
    return tree_.getBounds();
}

Bounds Zoom::getOverlappingBounds(const Bounds& bounds) const {
    auto overlapping = getEnclosingBounds().intersect(bounds);
    assert(tree_.getBounds().contain(overlapping));
    return overlapping;
}

Axes Zoom::getGrid(const Range& range, int zoomLevel) const {
    auto tl = range.topLeft;
    auto br = range.bottomRight;

    return Axes{ grid_.getXAxis(tl.x, br.x, zoomLevel), grid_.getYAxis(tl.y, br.y, zoomLevel) };
}