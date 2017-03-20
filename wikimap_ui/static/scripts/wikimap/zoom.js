var d3 = require('d3');

var Zoom = function (target) {
  var that = this;
  that.$ = $(this);

  var zoomBehavior = defineZoomBehavior();
  bindZoomBehaviorTo(target, zoomBehavior);

  this.set = function (transform) {
    target.call(zoomBehavior.transform, transform);
  };

  this.reset = function () {
    that.set(d3.zoomIdentity);
  };

  this.get = function () {
    return d3.zoomTransform(target.node());
  }

  function defineZoomBehavior() {
    return d3.zoom()
      .scaleExtent([1, Infinity])
      .on("start", emitMousedown) // poor man's event propagation
      .on("zoom", function() { that.$.trigger("zoom", [d3.event.transform]); });
  }

  function bindZoomBehaviorTo(selection, behavior) {
    selection.call(behavior);
  }

  function emitMousedown () {
    $(target.node()).trigger("mousedown");
  }
};

module.exports = Zoom;
