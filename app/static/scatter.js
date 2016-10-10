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

  this.applyAll = function (point) {
    return that.applyZoom(that.applyTransition(point));
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

var TileRenderer = function(svg, converter, hackScale) {
  var that = this;

  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(p) {
      return p.name;
    });

  var tiles = svg.append("g")
    .attr("id", "tiles");

  var selectedPoints = {};

  svg.call(tip);

  this.lastScale = 1;

  this.setZoomTransform = function(transform) {
    that._zoomTransform = transform;

    tiles.attr("transform", transform);

    var scale = transform.k;
    if (that.lastScale != scale) {
      that.lastScale = scale; // getR and getFontSize depend on lastScale

      // dont scale dots
      d3.selectAll(".dot")
        .attr("r", function(p) { return getR(p.z); })

      d3.selectAll(".labels")
        .style("font-size", getFontSize()+"px");
    }
  };

  this.add = function(tile, points) {
    var tile = tiles.append("g")
      .classed("tile", true)
      .attr("id", getTileId(tile));

    var dots = tile.append("g")
      .classed("dots", true)
      .style("fill-opacity", 0);

    dots.selectAll(".dot")
      .data(points)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function(p) { return converter.applyTransition([+p.x, +p.y])[0]; })
      .attr("cy", function(p) { return converter.applyTransition([+p.x, +p.y])[1]; })
      .attr("r", function(p) { return getR(p.z); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    setSelectionStyle(dots.selectAll(".dot"));

    var maxLength = 15;

    var labels = tile.append("g")
      .classed("labels", true)
      .style("font-size", getFontSize()+"px")
      .style("opacity", 0)
      .selectAll(".label")
      .data(points)
      .enter()
      .append("text")
      .classed("label", true)
      .text(function(p) {
        if (p.name.length <= maxLength) {
          return p.name;
        } else {
          return p.name.substring(0, 12)+'...';
        }
      })
      .attr("x", function(p) { return converter.applyTransition([+p.x, +p.y])[0]; })
      .attr("y", function(p) { return converter.applyTransition([+p.x, +p.y])[1] + 1.05 * getR(p.z); })
      .attr("dy", "1em");

    return tile;
  };

  this.show = function() {
    var dotsOpacity = 0.6;
    var labelsOpacity = 1.0;

    d3.selectAll(".dots")
      .style("fill-opacity", dotsOpacity);

    d3.selectAll(".labels")
      .style("opacity", labelsOpacity);
  };

  this.remove = function(tile) {
    var selector = "#"+getTileId(tile);
    d3.select(selector)
      .remove();
  };

  this.redrawAll = function() {
    d3.selectAll(".dot")
      .attr("cx", function(p) { return converter.applyTransition([p.x, p.y])[0]; })
      .attr("cy", function(p) { return converter.applyTransition([p.x, p.y])[1]; });
  };

  this.select = function (points) {
    selectedPoints = {};
    points.forEach(function (p) {
      selectedPoints[p] = true;
    });
    setSelectionStyle(d3.selectAll(".dot"));
  };

  function setSelectionStyle(d3selection) {
    d3selection.classed("selected", function (p) {
        return p.id in selectedPoints;
      });
  }

  function getFontSize() {
    var base = 10;
    return hackScale * base / that.lastScale;
  }

  function getR(z) {
    var base = 10;
    var coef = 0.8;
    return hackScale * base * Math.pow(coef, z) / that.lastScale;
  }

  function getTileId(tile) {
    return "tile-"+String(tile).replace(new RegExp(',', 'g'), '-');
  }
};

var TileDrawer = function (svg, hackScale) {
  var that = this;

  var drawnTiles = {};
  var pendingTiles = {};
  var requiredTiles = {};

  var selected

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


var wikimap = (function () {
  var hackScale = 8;
  var drawer;

  function loadBounds() {
    return $.getJSON($SCRIPT_ROOT + 'bounds');
  }

  function listenToResizeEvents(resizable) {
    return function () {
      var erd = elementResizeDetectorMaker({ strategy: "scroll" });
      erd.listenTo(document.getElementById("container"), function () {
        resizable.resize(getVirtualSize());

        d3.selectAll(".frame-size")
          .attr("width", getFrameSize()[0])
          .attr("height", getFrameSize()[1]);

        d3.selectAll("rect.virtual-size")
          .attr("width", getVirtualSize()[0])
          .attr("height", getVirtualSize()[1]);

        resizable.zoom(d3.zoomIdentity);
      });
    };
  }

  function getRealSize () {
    var displayWidth = document.getElementById('container').offsetWidth;
    var displayHeight = document.getElementById('container').offsetHeight;
    return [displayWidth, displayHeight];
  }

  function getFrameSize() {
    var realSize = getRealSize();
    return [realSize[0] - 1, realSize[1] - 1];
  }

  function getVirtualSize() {
    var realSize = getRealSize();
    return [hackScale * realSize[0], hackScale * realSize[1]];
  }

  function centerOn(x, y) {
    drawer.centerOn([x, y]);
  }

  function select(id) {
    drawer.select(id);
  }

  function init() {
    var svg = d3.select("#container")
      .append("svg")
      .classed("svg-content", true);

    svg.append("rect")
      .classed("frame", true)
      .classed("frame-size", true)
      .classed("background", true)
      .attr("x", 0.5)
      .attr("y", 0.5)
      .attr("width", getFrameSize()[0])
      .attr("height", getFrameSize()[1]);

    var hackSvg = svg.append("g")
      .attr("id", "hackScale")
      .attr("transform", "scale(" + (1/hackScale) + ")");

    var zoomCapture = hackSvg.append("rect")
      .classed("zoom-capture", true)
      .classed("virtual-size", true)
      .attr("width", getVirtualSize()[0])
      .attr("height", getVirtualSize()[1]);

    drawer = new TileDrawer(hackSvg, hackScale);

    loadBounds()
      .then(function (dataBounds) { drawer.init(getVirtualSize(), dataBounds); })
      .then(listenToResizeEvents(drawer));
  }

  return {
    init: init,
    centerOn: centerOn,
    select: select,
  };
})();


$(document).ready(function() {
  wikimap.init();
});