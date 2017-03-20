var Renderer = require('./renderer');
var Canvas = require('./canvas');
var Data = require('./data');
var Converters = require('./converters');
var Zoom = require('./zoom');
var Elements = require('./viewelements');

var View = function () {
  var that = this;
  that.$ = $(this);

  this._canvas = Canvas();
  this._renderer = new Renderer(this._canvas);

  this._tiles = new Elements.Tiles(this._renderer, getId());

  that._zoom = Zoom(this._canvas.d3content);
  that._zoom.$
    .on("zoom", function (e, transform) { applyZoom(transform); });

  var id2element = Object.create(null);
  id2element[this._tiles.getId()] = this._tiles;

  this.addCategory = function (name, color) {
    var id = getId();
    id2element[id] = new Elements.Category(that._renderer, id, name, color);
    return id;
  };

  this.addPoint = function (name, color) {
    var id = getId();
    id2element[id] = new Elements.Point(that._renderer, id, name, color);
    return id;
  };

  this.addInlinks = function (name, color) {
    var id = getId();
    id2element[id] = new Elements.Inlinks(that._renderer, id, name, color);
    return id;
  };

  this.addOutlinks = function (name, color) {
    var id = getId();
    id2element[id] = new Elements.Outlinks(that._renderer, id, name, color);
    return id;
  };

  this.remove = function (id) {
    id2element[id].remove();
  };

  this.toggle = function (id) {
    id2element[id].toggle();
  };

  this.changeColor = function (id, color) {
    id2element[id].changeColor(color);
  };

  this.resize = function () {
    that._canvas.stretchToFit();

    Converters.setViewboxSize(that._canvas.getSize());

    that._zoom.reset();
    that._renderer.redrawAll();
  };

  this.centerOn = function (name) {
    Data.Point.get(name)
      .then(function (datapoint) {
        var center = Converters.view2viewbox(that._canvas.getCenter());
        var point = Converters.data2viewbox([datapoint.x, datapoint.y]);
        var transform = that._zoom.get().translate(center[0] - point[0], center[1] - point[1]);
        that._zoom.set(transform);
      });
  };

  function getId() {
    if (this.nextId === undefined) {
      this.nextId = 0;
    }
    return (this.nextId++).toString();
  }

  function getZoomLevel(transform) {
    var scale = transform.k;
    return Math.max(0, Math.floor(Math.log2(scale)));
  }

  function applyZoom(transform) {
    Converters.setZoom(transform);
    that._renderer.setZoom(transform);

    var tlPoint = Converters.view2data([0, 0]);
    var brPoint = Converters.view2data(that._canvas.getSize());
    var zoomLevel = getZoomLevel(transform);

    var tlIdx = Converters.data2index(tlPoint, zoomLevel);
    var brIdx = Converters.data2index(brPoint, zoomLevel);
    that._tiles.draw(tlIdx, brIdx, zoomLevel);
  }

  return that;
};

module.exports = View;