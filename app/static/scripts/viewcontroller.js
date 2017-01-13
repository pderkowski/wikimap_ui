var d3 = require('d3');
var View = require('./view');
var Data = require('./data');
var Converters = require('./converters');

// This class "controls" what is "viewed" by zooming, centering and resizing the "view".
var ViewController = function (view) {
  var that = this;
  that.$ = $(this);

  // the way zoom works in d3 is:
  // - zoomBehavior is created with d3.zoom()
  // - zoomBehavior is bound to a target object (precisely, a selection, so multiple objects allowed) with selection.call(zoomBehavior)
  // - zoomBehavior does not store the zoom state by itself, it is more of a template (defines events and properties) and assigns the state in bound objects
  // - zoomBehavior can listen to events. The handler can be set using zoomBehavior.on(eventName, handler).
  //   We only use the "zoom" event, so hereafter everything concerning events is said about this one.
  // - the zoom state can be modified in two ways:
  //    * by user interaction (this changes the state stored in objects and fires the event)
  //    * programmatically by calling object.call(zoomBehavior.transform, assignedTransform). This also fires the event.
  //      Note: this shows that a single zoomBehavior can be bound to many objects, but the zoom state is independent for every object
  this.zoom = function (transform) {
    view.canvas.content.call(zoomBehavior.transform, transform);
  };

  this.resetZoom = function () {
    that.zoom(d3.zoomIdentity);
  };

  this.centerOn = function (name) {
    Data.Point.get(name)
      .then(function (datapoint) {
        var center = Converters.view2viewbox([view.canvas.getSize()[0] / 2, view.canvas.getSize()[1] / 2]);
        var point = Converters.data2viewbox([datapoint.x, datapoint.y]);
        var transform = getZoomTransform().translate(center[0] - point[0], center[1] - point[1]);
        that.zoom(transform);
      });
  };

  var zoomBehavior = defineZoomBehavior();
  bindZoomBehaviorTo(view.canvas.content, zoomBehavior);
  bindResizeHandlerTo(window, applyResize);
  bindDotClickHandlerTo(view.canvas.dots, function (dot) { that.$.trigger('pointClicked', [dot]); });

  this.start = function () {
    applyResize();
  };

  function defineZoomBehavior() {
    return d3.zoom()
      .scaleExtent([1, Infinity])
      .on("start", emitMousedown) // poor man's event propagation
      .on("zoom", function() { applyZoom(d3.event.transform); });
  }

  function bindZoomBehaviorTo(selection, behavior) {
    selection.call(behavior);
  }

  function applyZoom(transform) {
    Converters.setZoom(transform);
    view.renderer.setZoom(transform);

    var tlPoint = Converters.view2data([0, 0]);
    var brPoint = Converters.view2data(view.canvas.getSize());
    var zoomLevel = getZoomLevel(transform);

    var tlIdx = Converters.data2index(tlPoint, zoomLevel);
    var brIdx = Converters.data2index(brPoint, zoomLevel);
    view.drawTiles(tlIdx, brIdx, zoomLevel);
  }

  function getZoomTransform() {
    return d3.zoomTransform(view.canvas.content.node());
  }

  function applyResize() {
    view.canvas.stretchToFit();

    var newSize = view.canvas.getSize();
    Converters.setViewboxSize(newSize);

    that.resetZoom();
    view.renderer.redrawAll();

  }

  function bindResizeHandlerTo(element, handler) {
    function resizeThrottler() {
      var that = this;
      // ignore resize events as long as an actualResizeHandler execution is in the queue
      if (!this.resizeTimeout) {
        this.resizeTimeout = setTimeout(function() {
          that.resizeTimeout = null;
          handler();
         }, 66); // The actualResizeHandler will execute at a rate of 15fps
      }
    }

    element.addEventListener("resize", resizeThrottler, false);
  }

  function bindDotClickHandlerTo(selection, handler) {
    selection.on("click", function (p) {
      if (d3.event.defaultPrevented) {
        return;
      }

      var selection = d3.select(d3.event.target); // we listen on a group of dots, this gets the specific dot
      handler(selection.datum());
    });
  }

  function emitMousedown () {
    $(view.canvas.content.node()).trigger("mousedown");
  }

  function getZoomLevel(transform) {
    var scale = transform.k;
    return Math.max(0, Math.floor(Math.log2(scale)));
  }

  return that;
};

module.exports = ViewController;
