var TileIndexer = function () {
  var that = this;

  this.getTileRange = function (pointRange, level) {
    var tl = pointRange[0];
    var br = pointRange[1];

    var tlXIndex = Math.max(Math.round(that._xFloatIndex(tl[0], level) - 1), 0);
    var tlYIndex = Math.max(Math.round(that._yFloatIndex(tl[1], level) - 1), 0);

    var brXIndex = Math.min(Math.round(that._xFloatIndex(br[0], level) + 1), that._maxIndex(level));
    var brYIndex = Math.min(Math.round(that._yFloatIndex(br[1], level) + 1), that._maxIndex(level));

    return [[tlXIndex, tlYIndex], [brXIndex, brYIndex]];
  };

  this.setBounds = function (bounds) {
    that._bounds = bounds;
  };

  this._xFloatIndex = function (x, level) {
    var factor = (x - that._bounds.xMin) / (that._bounds.xMax - that._bounds.xMin);
    return factor * (that._maxIndex(level) + 1);
  };

  this._yFloatIndex = function (y, level) {
    var factor = (y - that._bounds.yMin) / (that._bounds.yMax - that._bounds.yMin);
    return factor * (that._maxIndex(level) + 1);
  };

  this._maxIndex = function (level) {
    return Math.pow(2, level) - 1;
  };
}

var CoordsConverter = function () {
  var that = this;

  this.invert = function (point) {
    return that._transitionTransform.invert(that._zoomTransform.invert(point));
  };

  this.apply = function (point) {
    return that._zoomTransform.apply(that._transitionTransform.apply(point));
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

  this.setDomain = function (bounds) {
    that._domain = bounds;

    if (that._viewportSize) {
      that._updateTransitionTransform();
    }
  };

  this._updateTransitionTransform = function () {
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
}

$(document).ready(function() {
  function setScales() {
    return function (bounds) {
      converter.setDomain(bounds);
      indexer.setBounds(bounds);
    }
  }

  function getDisplaySize() {
    var displayWidth = document.getElementById('container').offsetWidth;
    var displayHeight = document.getElementById('container').offsetHeight;
    return [+displayWidth, +displayHeight];
  }

  function getUsableSize() {
    var displaySize = getDisplaySize();
    return [displaySize[0] - margin.left - margin.right, displaySize[1] - margin.top - margin.bottom];
  }

  function loadBounds() {
    return $.getJSON($SCRIPT_ROOT + 'bounds');
  }

  function getPointsRequestString() {
    return 'points!0!0!0';
  }

  function loadPoints() {
    return $.getJSON($SCRIPT_ROOT + getPointsRequestString());
  }

  function setPoints() {
    return function (points) {
      points.forEach(function(p) {
        p.x = +p.x;
        p.y = +p.y;
      });

      return svgWithMargin.selectAll(".dot")
        .data(points)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", r)
        .attr("cx", function(p) { return converter.apply([p.x, p.y])[0]; })
        .attr("cy", function(p) { return converter.apply([p.x, p.y])[1]; });
    }
  }

  function setTip() {
    return function (dots) {
      var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(p) {
          return "x: "+p.x+" y: "+p.y;
        });

      svg.call(tip);

      dots.on("mouseover", tip.show)
        .on("mouseout", tip.hide);
      }
  }

  function redrawPoints() {
    svgWithMargin.selectAll(".dot")
      .attr("cx", function(p) { return converter.apply([p.x, p.y])[0]; })
      .attr("cy", function(p) { return converter.apply([p.x, p.y])[1]; });
  }

  function redrawRects() {
    d3.selectAll("rect")
      .attr("width", getUsableSize()[0])
      .attr("height", getUsableSize()[1]);
  }

  function zoomed() {
    converter.setZoomTransform(d3.event.transform);
    redrawPoints();

    var tl = converter.invert([0, 0]);
    var br = converter.invert(getUsableSize());
    var level = getZoomLevel(d3.event.transform.k);
    var range = indexer.getTileRange([tl, br], level);
    requestTileRange(range, level);
    // console.log('['+range[0][0]+','+range[0][1]+'],['+range[1][0]+','+range[1][1]+']');
  }

  function resized(container) {
    converter.setViewportSize(getUsableSize());
    redrawPoints();
    redrawRects();
  }

  function getZoomLevel(scale) {
    return Math.max(0, Math.floor(Math.log2(scale)));
  }

  function requestTileRange(range, level) {
    for (var i = range[0][0]; i < range[1][0]; i++) {
      for (var j = range[0][1]; j < range[1][1]; j++) {
        requestTile(i, j, level);
      }
    }
  }

  function requestTile(x, y, level) {
    console.log('Tile ('+x+','+y+'): fetching points.');
    $.getJSON($SCRIPT_ROOT+'points!'+x+'!'+y+'!'+level)
      .done(function (points) {
        console.log('Tile ('+x+','+y+'): fetched '+points.length+' points.');
      });
  }





  var margin = { top: 15, right: 15, bottom: 15, left: 15 };
  var r = 3.5;

  var converter = new CoordsConverter();
  converter.setViewportSize(getUsableSize());
  converter.setZoomTransform(d3.zoomIdentity);

  var indexer = new TileIndexer();

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

  var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom", zoomed);

  svg.call(zoom);

  var erd = elementResizeDetectorMaker({ strategy: "scroll" });
  erd.listenTo(document.getElementById("container"), resized);

  loadBounds()
    .then(setScales())
    .then(loadPoints)
    .then(setPoints())
    .then(setTip());
});