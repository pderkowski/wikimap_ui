var Register = require('./register');
var Data = require('./data');
// The class that manages fetching and drawing the tiles.
// Drawing a tile may involve:
// - fetching the data from the server if it is not cached
// - rendering if it is not yet drawn
// The first operation implies the delay, during which more calls to the draw method
// can be made, so that when the data finally arrives from the server it may no longer be needed.
// The second one is expensive, so we want to avoid doing it needlessly.
// These reasons make drawing a tile somewhat more complicated.
var TileDrawer = function (renderer, color) {
  var that = this;

  var register = new Register();

  this._color = color;
  this._enabled = true;

  this.draw = function (tiles) {
    // a new request invalidates the previous one
    register.clearRequested()     // so whatever was requested and not processed is no longer needed
    register.retireCompleted();   // and whatever was processed should be removed at next opportunity

    tiles.forEach(function (t) {
      var tile = t.toString();
      if (renderer.has(tile)) {
        register.complete(tile);      // nothing more to do with this tile
      } else {
        register.request(tile);   // mark the tile as requested
      }
    });

    register.getRequested().forEach(function (tile) {
      drawTile(tile);             // do the actual processing
    });
  };

  this.redraw = function () {
    renderer.redrawAll();
  };

  this.changeColor = function (color) {
    that._color = color;
    register.getPresent().forEach(function (t) {
      renderer.changeColor(t, color);
    });
  };

  this.enable = function () {
    that._enabled = true;
    that.draw(register.getNeeded());
  };

  this.disable = function () {
    that._enabled = false;
    removeTiles(register.getPresent());
  }

  this.isEnabled = function () {
    return that._enabled;
  };

  function drawTile (tile) {
    // console.log("requesting "+tile);
    Data.Tile.get(tile)
      .then(function (points) {
        // console.log("drawing "+tile);
        if (register.isRequested(tile)) {
          if (that._enabled && !renderer.has(tile)) {
            // console.log("added");
            renderer.add(tile, points, 0, that._color);
          }
          register.complete(tile);
          // console.log("completed");
        } else {
          // console.log("dismissed");
          register.dismiss(tile);
        }
      })
      .then(function () {
        collectGarbage()
      });
  };

  function collectGarbage() {
    if (!register.hasRequested()) { // only trigger the removal of old tiles if none are expected soon
      // console.log("triggered garbage collecting");
      removeTiles(register.getRetired());
      register.clearRetired();
    }
  }

  function removeTiles(tiles) {
    tiles.forEach(function (tile) {
      if (renderer.has(tile)) {
        renderer.remove(tile);
        // console.log("Removed "+tile);
      }
    });
  };
};

module.exports = TileDrawer;