var TileCache = require('./tilecache');
var TileIndexer = require('./tileindexer');
var CoordsConverter = require('./coordsconverter');
var TileRenderer = require('./tilerenderer');
var d3 = require('d3');
var $ = require('jquery');

var TileDrawer = function (svg, hackScale) {
  var that = this;

  var drawnTiles = {};
  var pendingTiles = {};
  var requiredTiles = {};

  var converter = new CoordsConverter();
  var cache = new TileCache();
  var indexer = new TileIndexer();
  var renderer = new TileRenderer(svg, converter, hackScale);

  var zoom_ = d3.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom", function() { doZoom(d3.event.transform); });

  svg.call(zoom_);

  this.init = function (size, dataBounds) {
    that._size = size;
    that._maxZoomLevel = dataBounds.maxDepth;

    converter.setViewportSize(size);
    converter.setDomain(dataBounds.range);
    indexer.setBounds(dataBounds.range);

    that.zoom(d3.zoomIdentity);
  };

  this.zoom = function (transform) {
    zoom_.transform(svg, transform);
  };

  this.resize = function (size) {
    that._size = size;

    converter.setViewportSize(size);
  };

  this.centerOn = function(point) {
    var size = that._size;

    var screenCenter = [size[0] / 2, size[1] / 2];
    var pointCoords = converter.applyTransition(point);

    var scale = Math.pow(2, that._maxZoomLevel);
    var newTransform = d3.zoomIdentity
      .translate(screenCenter[0] - scale * pointCoords[0], screenCenter[1] - scale * pointCoords[1])
      .scale(scale);

    that.zoom(newTransform);
  };

  this.select = function (ids) {
    renderer.select(ids);
  };

  function doZoom(transform) {
    converter.setZoomTransform(transform);
    renderer.setZoomTransform(transform);

    var tl = converter.invertAll([0, 0]);
    var br = converter.invertAll(that._size);
    var level = getZoomLevel(transform.k);
    var range = indexer.getTileRange([tl, br], level);

    draw(range, level);
  }

  function draw (range, level) {
    var requestedTiles = embed(range, level);

    resetRequiredTiles(requestedTiles);

    var drawingActions = drawTiles(requestedTiles);

    $.when.apply($, drawingActions)
      .done(function () {
        renderer.show();
        removeStaleTiles();
      });
  };

  function drawTiles (tiles) {
    var drawingActions = [];

    tiles.forEach(function (tile) {
      if (!(tile in pendingTiles) && !(tile in drawnTiles)) {
        pendingTiles[tile] = true;
        var action = drawTile(tile)
          .done(function (drawn) {
            drawnTiles[tile] = drawn;
            delete pendingTiles[tile];
          });

        drawingActions.push(action);
      }
    });

    return drawingActions;
  };

  function drawTile (tile) {
    return cache.get(tile[0], tile[1], tile[2])
      .then(function (points) {
        return renderer.add(tile, points);
      });
  };

  function embed (range, level) {
    var embedded = [];

    for (var i = range[0][0]; i <= range[1][0]; i++) {
      for (var j = range[0][1]; j <= range[1][1]; j++) {
        embedded.push([i, j, level]);
      }
    }

    return embedded;
  };

  function resetRequiredTiles(requestedTiles) {
    requiredTiles = {};
    requestedTiles.forEach(function(tile) {
      requiredTiles[tile] = true;
    });
  };

  // this method needs to be fixed - it should not be able to remove tiles touched by ANY newer request (not only the newest one) (need LRU for tiles for that)
  function removeStaleTiles() {
    for (var tile in drawnTiles) {
      if (drawnTiles.hasOwnProperty(tile) && !(tile in requiredTiles)) {
        removeTile(tile);
      }
    }

    renderer.show();
  };

  function removeTile(tile) {
    if (tile in drawnTiles) {
      renderer.remove(tile);
      delete drawnTiles[tile];
    }
  };

  function getZoomLevel(scale) {
    return Math.max(0, Math.floor(Math.log2(scale)));
  };
};

module.exports = TileDrawer;