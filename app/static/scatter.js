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
      coords.setDomain(bounds);
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

  function loadPoints() {
    var topLeft = coords.invert([0, 0]);
    var bottomRight = coords.invert(getUsableSize());

    return $.getJSON($SCRIPT_ROOT + 'points!'+topLeft[0]+'!'+topLeft[1]+'!'+bottomRight[0]+'!'+bottomRight[1]);
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
        .attr("cx", function(p) { return coords.apply([p.x, p.y])[0]; })
        .attr("cy", function(p) { return coords.apply([p.x, p.y])[1]; });
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

  function zoomed() {
    coords.setZoomTransform(d3.event.transform);

    svgWithMargin.selectAll(".dot")
      .attr("cx", function(p) { return coords.apply([p.x, p.y])[0]; })
      .attr("cy", function(p) { return coords.apply([p.x, p.y])[1]; });
  }

  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var r = 3.5;

  var coords = new CoordsConverter();
  coords.setViewportSize(getUsableSize());
  coords.setZoomTransform(d3.zoomIdentity);

  var svg = d3.select("div#container")
    .append("svg")
    .classed("svg-content", true);

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

  loadBounds()
    .then(setScales())
    .then(loadPoints)
    .then(setPoints())
    .then(setTip());
});