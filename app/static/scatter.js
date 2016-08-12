function loadBounds() {
  return $.getJSON($SCRIPT_ROOT + 'bounds');
}

function setScales(svg, g, x, y) {
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

    var margin = { top: 30, right: 30, bottom: 30, left: 30 };

    var displayWidth = document.getElementById('container').offsetWidth;
    var displayHeight = document.getElementById('container').offsetHeight;

    var displaySize = Math.min(displayWidth, displayHeight);

    var activeAreaSize = Math.min(displayWidth - margin.left - margin.right, displayHeight - margin.top - margin.bottom);

    x.domain([ xm, XM ])
      .range([0, activeAreaSize]);

    y.domain([ ym, YM ])
      .range([activeAreaSize, 0]);

    svg.attr("viewBox", "0 0 "+displaySize+" "+displaySize);

    g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

function setPoints(g, x, y) {
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
      .attr("cx", function(p) { return x(p.x); })
      .attr("cy", function(p) { return y(p.y); });
  }
}

function setTip(tip) {
  return function (dots) {
    dots.on("mouseover", tip.show)
      .on("mouseout", tip.hide);
    }
}

$(document).ready(function() {
  var x = d3.scaleLinear();
  var y = d3.scaleLinear();

  var svg = d3.select("div#container")
    .append("div")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("svg-content-responsive", true);

  var g = svg.append("g");

  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(p) {
      return "x: " + p.x + " y: " + p.y;
    });

  svg.call(tip);

  loadBounds()
    .then(setScales(svg, g, x, y))
    .then(loadPoints)
    .then(setPoints(g, x, y))
    .then(setTip(tip));
});