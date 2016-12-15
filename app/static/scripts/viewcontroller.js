var d3 = require('d3');
var View = require('./view');
var Data = require('./data');

// This class "controls" what is "viewed" by zooming, centering and resizing the "view".
// It is also responsible for setting and maintaining the "view" parts of the converters,
// that is calling the setViewboxSize and setZoom methods.
var ViewController = function (canvas, converters, interface) {
  var that = this;

  this._view = new View(canvas, converters);

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
    canvas.content.call(zoomBehavior.transform, transform);
  };

  this.resetZoom = function () {
    that.zoom(d3.zoomIdentity);
  };

  var zoomBehavior = defineZoomBehavior();
  bindZoomBehaviorTo(canvas.content, zoomBehavior);

  bindResizeHandlerTo(window, applyResize);

  bindDotClickHandlerTo(canvas.dots, interface.showDetails);

  applyResize();

  this.addCategorySelection = this._view.addCategorySelection;
  this.addPointSelection = this._view.addPointSelection;
  this.removeSelection = this._view.removeSelection;
  this.hasSelection = this._view.hasSelection;
  this.hideSelection = this._view.hideSelection;
  this.showSelection = this._view.showSelection;
  this.changeSelectionColor = this._view.changeSelectionColor;
  this.changeUnselectedPointsColor = this._view.changeUnselectedPointsColor;
  this.hasUnselectedPoints = this._view.hasUnselectedPoints;
  this.hideUnselectedPoints = this._view.hideUnselectedPoints;
  this.showUnselectedPoints = this._view.showUnselectedPoints;

  this.centerOn = function (name) {
    Data.Point.get(name)
      .then(function (datapoint) {
        var center = converters.view2viewbox([canvas.getSize()[0] / 2, canvas.getSize()[1] / 2]);
        var point = converters.data2viewbox([datapoint.x, datapoint.y]);
        var transform = getZoomTransform().translate(center[0] - point[0], center[1] - point[1]);
        that.zoom(transform);
      });
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
    converters.setZoom(transform);
    that._view.setZoom(transform);
  }

  function getZoomTransform() {
    return d3.zoomTransform(canvas.content.node());
  }

  function applyResize() {
    canvas.stretchToFit();

    var newSize = canvas.getSize();
    converters.setViewboxSize(newSize);

    that.resetZoom();
    that._view.redraw();
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
    $(canvas.content.node()).trigger("mousedown");
  }
};

module.exports = ViewController;
