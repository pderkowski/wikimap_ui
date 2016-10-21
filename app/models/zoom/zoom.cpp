#include "zoom.hpp"
#include "indexer.hpp"
#include "datapoint.hpp"
#include <algorithm>
#include <iterator>

Zoom::Zoom(const Datapoints& datapoints, int pointsPerTile)
: tree_(helpers::getBounds(helpers::getPoints(datapoints)), pointsPerTile), revIndex_()
{
    for (int i = 0; i < datapoints.size(); ++i) {
        auto dp = datapoints[i];
        auto index = tree_.insert(dp);
        revIndex_.mapId2Index(dp.id, index);
    }
}

namespace helpers {

Points getPoints(const Datapoints& dps) {
    Points res;
    res.reserve(dps.size());
    std::transform(dps.begin(), dps.end(), std::back_inserter(res), [] (const Datapoint& dp) { return dp.p; });
    return res;
}

}