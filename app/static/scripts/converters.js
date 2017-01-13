var d3 = require('d3');

// There are 4 different coordinate systems throughout the application.
// 1. The data consists of points, each one has its intrinsic x and y values. The bounds for these values must be specified.
// 2. The viewbox is a rectangle with coordinates ranging from [0, 0] to [size[0], size[1]].
// 3. Additionally, a user can pan and zoom the viewbox, thus adding a zoom transform on top of the viewbox's coords.
//    The resulting rectangle is hereafter called the view. It has the same proportions as the viewbox, but the
//    coordinates are different (not necessarily originating in [0, 0]).
// 4. The data is partitioned into rectangular buckets on a plane. Buckets are layered one on top of another, with each layer
//    having increased granularity. For each layer, a bucket in top left corner of a plane has coordinates [0, 0]. A triple of
//    x bucket coordinate, y buckey coordinate and zoom level is called an index.

// This class provides the means to easily perform projections between these systems,
// taking into account set sizes of all 4 layers.

// Note: points and sizes are arrays of length 2. bounds is a 2-element array of points. transform is a d3 zoom transform.
// index is a 3-element array

// This function computes a transform that fits and centers all data in unzoomed display, with a small margin on each side.
function computeTransformBetween(from, to) {
  var fx = from[0][0], fy = from[0][1];
  var FX = from[1][0], FY = from[1][1];

  var tx = to[0][0], ty = to[0][1];
  var TX = to[1][0], TY = to[1][1];

  var fromWidth  = FX - fx, fromHeight = FY - fy;
  var toWidth    = TX - tx, toHeight   = TY - ty;

  var scale = 0.9 * Math.min(toWidth / fromWidth, toHeight / fromHeight);

  var fxMid = (fx + FX) / 2, fyMid = (fy + FY) / 2;
  var txMid = (tx + TX) / 2, tyMid = (ty + TY) / 2;

  var xTranslation = txMid - scale * fxMid;
  var yTranslation = tyMid - scale * fyMid;

  return d3.zoomIdentity.translate(xTranslation, yTranslation).scale(scale);
};

var Converters = function () {
  var that = this;

  this.setDataBounds = function (bounds) {
    that._dataBounds = bounds;

    if (that._viewboxSize) {
      that._data2viewboxTransform = computeTransformBetween(that._dataBounds, [[0, 0], that._viewboxSize]);
    }
  };

  this.setViewboxSize = function (size) {
    that._viewboxSize = size;

    if (that._dataBounds) {
      that._data2viewboxTransform = computeTransformBetween(that._dataBounds, [[0, 0], that._viewboxSize]);
    }
  };

  this.setZoom = function (transform) {
    that._viewbox2viewTransform = transform;
  };

  this.data2viewbox = function (point) {
    return that._data2viewboxTransform.apply(point);
  };

  this.viewbox2data = function (point) {
    return that._data2viewboxTransform.invert(point);
  };

  this.viewbox2view = function (point) {
    return that._viewbox2viewTransform.apply(point);
  };

  this.view2viewbox = function (point) {
    return that._viewbox2viewTransform.invert(point);
  };

  this.data2view = function (point) {
    return that.viewbox2view(that.data2viewbox(point));
  };

  this.view2data = function (point) {
    return that.viewbox2data(that.view2viewbox(point));
  };

  this.data2index = function (point, zoomLevel) {
    var maxIndex = Math.pow(2, zoomLevel) - 1;

    var x = point[0];
    var y = point[1];

    var xb = that._dataBounds[0][0], yb = that._dataBounds[0][1];
    var XB = that._dataBounds[1][0], YB = that._dataBounds[1][1];

    var xf = (x - xb) / (XB - xb);
    var yf = (y - yb) / (YB - yb);

    var xIdx = Math.min(maxIndex, Math.max(0, Math.floor(xf * (maxIndex + 1))));
    var yIdx = Math.min(maxIndex, Math.max(0, Math.floor(yf * (maxIndex + 1))));

    return [xIdx, yIdx, zoomLevel];
  }
};

module.exports = new Converters();