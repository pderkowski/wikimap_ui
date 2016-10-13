var d3 = require('d3');

var CoordsConverter = function () {
  var that = this;

  this.invertAll = function (point) {
    return that.invertTransition(that.invertZoom(point));
  };

  this.invertTransition = function (point) {
    return that._transitionTransform.invert(point);
  };

  this.invertZoom = function (point) {
    return that._zoomTransform.invert(point);
  };

  this.applyTransition = function (point) {
    return that._transitionTransform.apply(point);
  };

  this.applyZoom = function (point) {
    return that._zoomTransform.apply(point);
  };

  this.applyAll = function (point) {
    return that.applyZoom(that.applyTransition(point));
  };

  this.setZoomTransform = function (transform) {
    that._zoomTransform = transform;
  };

  this.setViewportSize = function (size) {
    that._viewportSize = size;

    if (that._domain) {
      that._updateTransitionTransform();
    }
  };

  this.setDomain = function(bounds) {
    that._domain = bounds;

    if (that._viewportSize) {
      that._updateTransitionTransform();
    }
  };

  this._updateTransitionTransform = function() {
    var xm = that._domain.xMin;
    var ym = that._domain.yMin;
    var XM = that._domain.xMax;
    var YM = that._domain.yMax;

    var boundsWidth = XM - xm;
    var boundsHeight = YM - ym;

    var viewportWidth = that._viewportSize[0];
    var viewportHeight = that._viewportSize[1];

    var scale = 0.9 * Math.min(viewportWidth / boundsWidth, viewportHeight / boundsHeight);

    var xMid = (xm + XM) / 2;
    var yMid = (ym + YM) / 2;
    var vxMid = viewportWidth / 2;
    var vyMid = viewportHeight / 2;

    var xTranslation = vxMid - scale * xMid;
    var yTranslation = vyMid - scale * yMid;

    that._transitionTransform = d3.zoomIdentity.translate(xTranslation, yTranslation).scale(scale);
  };
};

module.exports = CoordsConverter;