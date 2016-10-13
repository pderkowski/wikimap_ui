var d3 = require('d3');
var d3tip = require('d3-tip');

var TileRenderer = function(svg, converter, hackScale) {
  var that = this;

  var tip = d3tip()
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
    var base = 6;
    var coef = 0.8;
    return hackScale * base * Math.pow(coef, z) / that.lastScale;
  }

  function getTileId(tile) {
    return "tile-"+String(tile).replace(new RegExp(',', 'g'), '-');
  }
};

module.exports = TileRenderer;