var d3 = require('d3');
var Converters = require('./converters');

var PointRenderer = function (parent, canvas) {
  var that = this;

  this.show = function (points) {
    d3.select('.canvas-dots')
      .selectAll('.dot')
      .data(points, function (p) { return p.id; })
      .enter() // add new points
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function(p) { return Converters.data2view([+p.x, +p.y])[0]; })
      .attr("cy", function(p) { return Converters.data2view([+p.x, +p.y])[1]; })
      .attr("r", function(p) { return parent.getRadius(p.z); })
      .on("mouseover", canvas.tip.show)
      .on("mouseout", canvas.tip.hide);

    that.updatePositions();
    that.updateColors();
  };

  this.hide = function (points) {
    d3.selectAll('.dot')
      .filter(function (p) { return points[p.id]; })
      .remove();

    that.updateColors();
  };

  this.updatePositions = function() {
    d3.selectAll(".dot")
      .attr("cx", function (d) { return Converters.data2view([d.x, d.y])[0]; })
      .attr("cy", function (d) { return Converters.data2view([d.x, d.y])[1]; });
  };

  this.updateColors = function() {
    d3.selectAll('.dot')
      .style('fill', function (p) { return parent.getColor(p.id); });
  };

  this.updateSizes = function() {
    d3.selectAll('.dot')
      .attr("r", function(p) { return parent.getRadius(p.z); });
  };
};

module.exports = PointRenderer;
