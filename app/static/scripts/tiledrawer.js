var Scheduler = require('./scheduler');

var TileDrawer = function (data, renderer) {
  var that = this;

  var scheduler = new Scheduler(removeTiles);

  var color = '#777';

  this.draw = function (tiles) {
    var needed = scheduler.replace(tiles.map(function (t) { return t.toString(); }));
    needed.forEach(drawTile);
  };

  this.redraw = function () {
    renderer.redrawAll();
  };

  function drawTile (tile) {
    data.getTile(tile)
      .then(function (points) {
        if (scheduler.isExpecting(tile) && !renderer.has(tile)) {
          renderer.add(tile, points, 0, color);
          scheduler.finish(tile);
        } else {
          scheduler.dismiss(tile);
        }
      });
  };

  function removeTiles(tiles) {
    tiles.forEach(function (t) {
      if (renderer.has(t)) {
        renderer.remove(t);
      }
    });
  };
};

module.exports = TileDrawer;