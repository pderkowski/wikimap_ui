var SelectionDrawer = require('./selectiondrawer');
var TileDrawer = require('./tiledrawer');
var Renderer = require('./renderer');

var View = function (canvas, converters, data, color) {
  var renderer = new Renderer(canvas, converters);
  var selectionDrawer = new SelectionDrawer(data, renderer);
  var tileDrawer = new TileDrawer(data, renderer, color);

  this.setZoom = function (transform) {
    renderer.setZoom(transform);

    var tlPoint = converters.view2data([0, 0]);
    var brPoint = converters.view2data(canvas.getSize());
    var zoomLevel = getZoomLevel(transform);

    var tlIdx = converters.data2index(tlPoint, zoomLevel);
    var brIdx = converters.data2index(brPoint, zoomLevel);

    var tiles = enumerateTiles(tlIdx, brIdx, zoomLevel);
    tileDrawer.draw(tiles);
  };

  this.redraw = function () {
    tileDrawer.redraw();
  };

  this.addCategorySelection = function (name, color) {
    selectionDrawer.addCategory(name, color);
  };

  this.addPointSelection = function (name, color) {
    selectionDrawer.addPoint(name, color);
  };

  this.removeSelection = function (name) {
    selectionDrawer.remove(name);
  };

  this.hasSelection = function (name) {
    return selectionDrawer.has(name);
  };

  this.showSelection = function (name) {
    selectionDrawer.show(name);
  };

  this.hideSelection = function (name) {
    selectionDrawer.hide(name);
  };

  this.hasUnselectedPoints = function () {
    return tileDrawer.isEnabled();
  };

  this.showUnselectedPoints = function () {
    tileDrawer.enable();
  };

  this.hideUnselectedPoints = function () {
    tileDrawer.disable();
  };

  this.changeSelectionColor = function (name, color) {
    selectionDrawer.changeColor(name, color);
  };

  this.changeUnselectedPointsColor = function (color) {
    tileDrawer.changeColor(color);
  };

  function enumerateTiles(tlIdx, brIdx, zoomLevel) {
    var tiles = [];

    for (var i = tlIdx[0]; i <= brIdx[0]; i++) {
      for (var j = tlIdx[1]; j <= brIdx[1]; j++) {
        tiles.push([i, j, zoomLevel]);
      }
    }

    return tiles;
  };

  function getZoomLevel(transform) {
    var scale = transform.k;
    return Math.max(0, Math.floor(Math.log2(scale)));
  }
};

module.exports = View;