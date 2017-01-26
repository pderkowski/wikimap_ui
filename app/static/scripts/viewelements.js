var Data = require('./data');
var TileDrawer = require('./tiledrawer');

var Selection = function (renderer, id) {
  this.renderer = renderer;
  this.id = id;
};

Selection.prototype.remove = function () {
  this.renderer.remove(this.id);
};

Selection.prototype.toggle = function () {
  if (this.renderer.has(this.id)) {
    this.renderer.hide(this.id);
  } else {
    this.renderer.show(this.id);
  }
};

Selection.prototype.changeColor = function (color) {
  this.renderer.changeColor(this.id, color);
};


var Category = function (renderer, id, name, color) {
  Selection.call(this, renderer, id);

  var that = this;
  Data.Category.get(name)
    .then(function (points) {
      that.renderer.add(id, points, 1, color);
    });
};

Category.prototype = Object.create(Selection.prototype);

var Point = function (renderer, id, name, color) {
  Selection.call(this, renderer, id);

  var that = this;
  Data.Point.get(name)
    .then(function (point) {
      renderer.add(id, [point], 2, color);
    });
};

Point.prototype = Object.create(Selection.prototype);

var Inlinks = function (renderer, id, name, color) {
  Selection.call(this, renderer, id);

  var that = this;
  Data.Inlinks.get(name)
    .then(function (points) {
      that.renderer.add(id, points, 1, color);
    });
};

Inlinks.prototype = Object.create(Selection.prototype);

var Outlinks = function (renderer, id, name, color) {
  Selection.call(this, renderer, id);

  var that = this;
  Data.Outlinks.get(name)
    .then(function (points) {
      that.renderer.add(id, points, 1, color);
    });
};

Outlinks.prototype = Object.create(Selection.prototype);


var Tiles = function (renderer, id) {
  var tileDrawer = new TileDrawer(renderer);

  this.getId = function () {
    return id;
  };

  this.toggle = function () {
    if (tileDrawer.isEnabled()) {
      tileDrawer.disable();
    } else {
      tileDrawer.enable();
    }
  };

  this.changeColor = function (color) {
    tileDrawer.changeColor(color);
  };

  this.draw = function (tlIdx, brIdx, zoomLevel) {
    tileDrawer.draw(enumerateTiles(tlIdx, brIdx, zoomLevel));
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
};

module.exports = {
  Category: Category,
  Point: Point,
  Inlinks: Inlinks,
  Outlinks: Outlinks,
  Tiles: Tiles
};