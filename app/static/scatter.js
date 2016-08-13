function getDisplaySize() {
  var displayWidth = document.getElementById('container').offsetWidth;
  var displayHeight = document.getElementById('container').offsetHeight;
  return [+displayWidth, +displayHeight];
}

function getUsableSize(margin) {
  var displaySize = getDisplaySize();
  return [displaySize[0] - margin.left - margin.right, displaySize[1] - margin.top - margin.bottom];
}

function loadBounds() {
  return $.getJSON($SCRIPT_ROOT + 'bounds');
}

function setViewBoxSize(svg) {
    var minDim = Math.min.apply(Math, getDisplaySize());
    svg.attr("viewBox", "0 0 "+minDim+" "+minDim);
}

function setScales(margin, scales) {
  return function (bounds) {
    var xm = bounds.xMin;
    var ym = bounds.yMin;
    var XM = bounds.xMax;
    var YM = bounds.yMax;

    var boundsWidth = XM - xm;
    var boundsHeight = YM - ym;

    if (boundsWidth > boundsHeight) {
      var d = boundsWidth - boundsHeight;
      ym -= (d / 2);
      YM += (d / 2);
    } else {
      var d = boundsHeight - boundsWidth;
      xm -= (d / 2);
      XM += (d / 2);
    }

    var minDim = Math.min.apply(Math, getUsableSize(margin));

    scales.x.domain([ xm, XM ])
      .range([0, minDim]);

    scales.y.domain([ ym, YM ])
      .range([minDim, 0]);

    return bounds;
  }
}

function loadPoints(bounds) {
  var xMin = bounds.xMin;
  var yMin = bounds.yMin;
  var xMax = bounds.xMax;
  var yMax = bounds.yMax;

  return $.getJSON($SCRIPT_ROOT + 'points!'+xMin+'!'+yMin+'!'+xMax+'!'+yMax);
}

function setPoints(g, scales) {
  return function (points) {
    points.forEach(function(p) {
      p.x = +p.x;
      p.y = +p.y;
    });

    return g.selectAll(".dot")
      .data(points)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(p) { return scales.x(p.x); })
      .attr("cy", function(p) { return scales.y(p.y); });
  }
}

function setTip(svg) {
  return function (dots) {
    var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(p) {
        return "x: " + p.x + " y: " + p.y;
      });

    svg.call(tip);

    dots.on("mouseover", tip.show)
      .on("mouseout", tip.hide);
    }
}

$(document).ready(function() {
  var scales = {
    "x": d3.scaleLinear(),
    "y": d3.scaleLinear()
  }

  var svg = d3.select("div#container")
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("svg-content-responsive", true);

  setViewBoxSize(svg);

  var margin = { top: 30, right: 30, bottom: 30, left: 30 };

  var svgWithMarginAndZoom = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .append("g");

  var zoom = d3.zoom()
    .scaleExtent([1.0, Infinity])
    .on("zoom", function () {
      svgWithMarginAndZoom.attr("transform", d3.event.transform);
    });

  svg.call(zoom);

  loadBounds()
    .then(setScales(margin, scales))
    .then(loadPoints)
    .then(setPoints(svgWithMarginAndZoom, scales))
    .then(setTip(svg));
});