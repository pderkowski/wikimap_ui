function loadBounds() {
  return $.getJSON($SCRIPT_ROOT + 'bounds');
}

function setBounds(x, y) {
  return function (bounds) {
    x.domain([ bounds.xMin, bounds.xMax ]).nice();
    y.domain([ bounds.yMin, bounds.yMax ]).nice();

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

function setPoints(svg, x, y) {
  return function (points) {
    points.forEach(function(p) {
      p.x = +p.x;
      p.y = +p.y;
    });

    svg.selectAll(".dot")
        .data(points)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(p) { return x(p.x); })
        .attr("cy", function(p) { return y(p.y); });
  }
}

$(document).ready(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = document.getElementById('container').offsetWidth - margin.left - margin.right,
      height = document.getElementById('container').offsetHeight - margin.top - margin.bottom;

  var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var svg = d3.select("#container").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  loadBounds()
    .then(setBounds(x, y))
    .then(loadPoints)
    .then(setPoints(svg, x, y));
});