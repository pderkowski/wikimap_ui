var CategoryDrawer = require('./categorydrawer');
var TileDrawer = require('./tiledrawer');
var Renderer = require('./renderer');

var View = function (canvas, converters, data, color) {
  var renderer = new Renderer(canvas, converters);
  var categoryDrawer = new CategoryDrawer(data, renderer);
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

  this.addCategory = function (name, color) {
    categoryDrawer.add(name, color);
  };

  this.removeCategory = function (name) {
    categoryDrawer.remove(name);
  };

  this.hasCategory = function (name) {
    return categoryDrawer.has(name);
  };

  this.showCategory = function (name) {
    categoryDrawer.show(name);
  };

  this.hideCategory = function (name) {
    categoryDrawer.hide(name);
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

  this.changeCategoryColor = function (name, color) {
    categoryDrawer.changeColor(name, color);
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