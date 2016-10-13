var TileIndexer = function () {
  var that = this;

  this.getTileRange = function (pointRange, level) {
    var tl = pointRange[0];
    var br = pointRange[1];

    var tlXIndex = Math.max(Math.floor(xFloatIndex(tl[0], level)), 0);
    var tlYIndex = Math.max(Math.floor(yFloatIndex(tl[1], level)), 0);

    var brXIndex = Math.min(Math.ceil(xFloatIndex(br[0], level)), maxIndex(level));
    var brYIndex = Math.min(Math.ceil(yFloatIndex(br[1], level)), maxIndex(level));

    return [[tlXIndex, tlYIndex], [brXIndex, brYIndex]];
  };

  this.setBounds = function (bounds) {
    that._bounds = bounds;
  };

  function xFloatIndex (x, level) {
    var factor = (x - that._bounds.xMin) / (that._bounds.xMax - that._bounds.xMin);
    return factor * (maxIndex(level) + 1);
  };

  function yFloatIndex (y, level) {
    var factor = (y - that._bounds.yMin) / (that._bounds.yMax - that._bounds.yMin);
    return factor * (maxIndex(level) + 1);
  };

  function maxIndex (level) {
    return Math.pow(2, level) - 1;
  };
};

module.exports = TileIndexer;