var TileCache = function () {
  var that = this;

  var cache = new LRUCache(1000, Number.MAX_SAFE_INTEGER); // don't expire cache

  this.get = function (xIndex, yIndex, level) {
    var key = [xIndex, yIndex, level];
    var item = cache.get(key);

    if (item) {
      return item; // it's a promise
    } else {
      var request = new $.Deferred(); // create a promise and place it in cache

      cache.set(key, request.promise());

      loadPoints(xIndex, yIndex, level)
        .done(function (points) {
          request.resolve(points);
        });

      return request.promise();
    }
  };

  function loadPoints(xIndex, yIndex, level) {
    return $.getJSON($SCRIPT_ROOT + 'points!'+xIndex+'!'+yIndex+'!'+level);
  }
};

var TileIndexer = function () {
  var that = this;

  this.getTileRange = function (pointRange, level) {
    var tl = pointRange[0];
    var br = pointRange[1];

    var tlXIndex = Math.max(Math.floor(xFloatIndex(tl[0], level)), 0);
    var tlYIndex = Math.max(Math.floor(yFloatIndex(tl[1], level)), 0);

    var brXIndex = Math.min(Math.ceil(xFloatIndex(br[0], level)), maxIndex(level));
    var brYIndex = Math.min(Math.ceil(yFloatIndex(br[1], level)), maxIndex(level));

    return [[tlXIndex, tlYIndex], [brXIndex, brYIndex]];
  };

  this.setBounds = function (bounds) {
    that._bounds = bounds;
  };

  function xFloatIndex (x, level) {
    var factor = (x - that._bounds.xMin) / (that._bounds.xMax - that._bounds.xMin);
    return factor * (maxIndex(level) + 1);
  };

  function yFloatIndex (y, level) {
    var factor = (y - that._bounds.yMin) / (that._bounds.yMax - that._bounds.yMin);
    return factor * (maxIndex(level) + 1);
  };

  function maxIndex (level) {
    return Math.pow(2, level) - 1;
  };
};

var CoordsConverter = function () {
  var that = this;

  this.invertAll = function (point) {
    return that.invertTransition(that.invertZoom(point));
  };

  this.invertTransition = function (point) {
    return that._transitionTransform.invert(point);
  };

  this.invertZoom = function (point) {
    return that._zoomTransform.invert(point);
  };

  this.applyTransition = function (point) {
    return that._transitionTransform.apply(point);
  };

  this.applyZoom = function (point) {
    return that._zoomTransform.apply(point);
  };

  this.setZoomTransform = function (transform) {
    that._zoomTransform = transform;
  };

  this.setViewportSize = function (size) {
    that._viewportSize = size;

    if (that._domain) {
      that._updateTransitionTransform();
    }
  };

  this.setDomain = function(bounds) {
    that._domain = bounds;

    if (that._viewportSize) {
      that._updateTransitionTransform();
    }
  };

  this._updateTransitionTransform = function() {
    var xm = that._domain.xMin;
    var ym = that._domain.yMin;
    var XM = that._domain.xMax;
    var YM = that._domain.yMax;

    var boundsWidth = XM - xm;
    var boundsHeight = YM - ym;

    var viewportWidth = that._viewportSize[0];
    var viewportHeight = that._viewportSize[1];

    var scale = 0.9 * Math.min(viewportWidth / boundsWidth, viewportHeight / boundsHeight);

    var xMid = (xm + XM) / 2;
    var yMid = (ym + YM) / 2;
    var vxMid = viewportWidth / 2;
    var vyMid = viewportHeight / 2;

    var xTranslation = vxMid - scale * xMid;
    var yTranslation = vyMid - scale * yMid;

    that._transitionTransform = d3.zoomIdentity.translate(xTranslation, yTranslation).scale(scale);
  };
};

var TileRenderer = function(svg, converter) {
  var that = this;

  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(p) {
      return p.name;
    });

  var targetOpacity = 0.5;

  svg.call(tip);

  this.setZoomTransform = function(transform) {
    that._zoomTransform = transform;

    svg.selectAll("g")
      .attr("transform", transform);
  };

  this.add = function(tile, points) {
    var g = svg.append("g")
      .attr("id", getTileId(tile))
      .attr("transform", that._zoomTransform)
      .style("opacity", 0);

    var dots = g.selectAll(".dot")
      .data(points)
      .enter()
      .append("circle")
      .attr("class", "dot");

    dots.attr("r", function(p) { return Math.pow(2, 2 - p.z); })
      .attr("cx", function(p) { return converter.applyTransition([+p.x, +p.y])[0]; })
      .attr("cy", function(p) { return converter.applyTransition([+p.x, +p.y])[1]; });

    dots.on("mouseover", tip.show)
      .on("mouseout", tip.hide)

    return g;
  };

  this.show = function() {
    svg.selectAll("g")
      .style("opacity", targetOpacity);
  };

  this.remove = function(tile) {
    var selector = "#"+getTileId(tile);
    d3.select(selector)
      .remove();
  };

  this.redrawAll = function() {
    svg.selectAll(".dot")
      .attr("cx", function(p) { return converter.applyTransition([p.x, p.y])[0]; })
      .attr("cy", function(p) { return converter.applyTransition([p.x, p.y])[1]; });
  };

  function getTileId(tile) {
    return "tile-"+String(tile).replace(new RegExp(',', 'g'), '-');
  }
};

var TileDrawer = function (svg) {
  var that = this;

  var drawnTiles = {};
  var pendingTiles = {};
  var requiredTiles = {};

  var converter = new CoordsConverter();
  var cache = new TileCache();
  var indexer = new TileIndexer();
  var renderer = new TileRenderer(svg, converter);

  this.init = function (size, dataBounds) {
    that._size = size;

    converter.setViewportSize(size);
    converter.setZoomTransform(d3.zoomIdentity);
    converter.setDomain(dataBounds);
    indexer.setBounds(dataBounds);
  };

  this.zoom = function (transform) {
    converter.setZoomTransform(transform);
    renderer.setZoomTransform(transform);

    var tl = converter.invertAll([0, 0]);
    var br = converter.invertAll(that._size);
    var level = getZoomLevel(transform.k);
    var range = indexer.getTileRange([tl, br], level);

    draw(range, level);
  };

  this.resize = function (size) {
    that._size = size;

    converter.setViewportSize(size);
    renderer.redrawAll();

    d3.selectAll("rect")
      .attr("width", size[0])
      .attr("height", size[1]);
  };

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


$(document).ready(function() {
  function loadBounds() {
    return $.getJSON($SCRIPT_ROOT + 'bounds');
  }

  function getUsableSize () {
    var displayWidth = document.getElementById('container').offsetWidth;
    var displayHeight = document.getElementById('container').offsetHeight;
    return [displayWidth - margin.left - margin.right, displayHeight - margin.top - margin.bottom];
  }

  var margin = { top: 15, right: 15, bottom: 15, left: 15 };
  var svg = d3.select(".svg-content");

  svg.append("clipPath")
    .attr("id", "margin-clip")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", getUsableSize()[0])
    .attr("height", getUsableSize()[1]);

  svg.append("rect")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", getUsableSize()[0])
    .attr("height", getUsableSize()[1]);

  var svgWithMargin = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("clip-path", "url(#margin-clip)");

  var drawer = new TileDrawer(svgWithMargin);

  var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom", function() { drawer.zoom(d3.event.transform); });

  svg.call(zoom);

  var erd = elementResizeDetectorMaker({ strategy: "scroll" });
  erd.listenTo(document.getElementById("container"), function () { drawer.resize(getUsableSize()); });

  loadBounds()
    .then(function (dataBounds) { drawer.init(getUsableSize(), dataBounds); })
    .then(function () { drawer.zoom(d3.zoomIdentity); });
});