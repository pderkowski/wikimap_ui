var Cache = require('./cache');
var TileIndexer = require('./tileindexer');
var TileScheduler = require('./tilescheduler');
var d3 = require('d3');
var $ = require('jquery');

var TileDrawer = function (renderer, converter, svg) {
  var that = this;

  var cache = new Cache(1000,
    function (x, y, z) { return x+','+y+','+z; },
    function (x, y, z) { return $.getJSON($SCRIPT_ROOT + 'points!'+x+'!'+y+'!'+z); });
  var indexer = new TileIndexer();
  var scheduler = new TileScheduler(removeTiles);

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

  // this.select = function (ids) {
  //   renderer.select(ids);
  // };

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
    var requested = embed(range, level);
    var needed = scheduler.replace(requested.map(function (t) { return t.toString(); }));

    needed.forEach(drawTile);
  };

  function drawTile (tile) {
    var args = tile.split(',');
    return cache.get(args[0], args[1], args[2])
      .then(function (points) {
        if (scheduler.isExpecting(tile) && !renderer.has(tile)) {
          renderer.add(tile, points, 0);
          scheduler.finish(tile);
          // console.log('Drawn ' + tile);
        } else {
          scheduler.dismiss(tile);
        }
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

  function removeTiles(tiles) {
    tiles.forEach(function (t) {
      if (renderer.has(t)) {
        renderer.remove(t);
        // console.log('Removed ' + t);
      }
    });
  };

  function getZoomLevel(scale) {
    return Math.max(0, Math.floor(Math.log2(scale)));
  };
};

module.exports = TileDrawer;