var d3 = require('d3');
var Converters = require('./converters');
var CollisionDetector = require('./collisiondetector');

var LabelRenderer = function (parent, canvas) {
  var that = this;

  var debug = false;
  if (debug) {
    canvas.content
      .append("g")
      .classed("debug", true);
  }

  this.show = function (points) {
    var labels = d3.select('.canvas-labels')
      .selectAll('.wikimap-label')
      .data(points, function (p) { return p.id; })
      .enter() // add new points
      .append("text")
      .classed("wikimap-label", true)
      .text(function (p) { return trimIfLongerThan(p.title, 20); });

    that.updatePositions();
    that.updateVisibility();
  };

  this.hide = function (points) {
    d3.selectAll('.wikimap-label')
      .filter(function (p) { return points[p.id]; })
      .remove();

    that.updateVisibility();
  };

  this.updatePositions = function () {
    d3.select('.canvas-labels')
      .selectAll('.wikimap-label')
      .attr("dy", "1em")
      .attr("x", function (p) { return Converters.data2view([+p.x, +p.y])[0]; })
      .attr("y", function (p) { return Converters.data2view([+p.x, +p.y])[1] + parent.getRadius(p.z) + canvas.fontSize / 6; });
  };

  this.updateVisibility = function () {
    var maxSize = getMaxRectSize();
    var collisionDetector = new CollisionDetector(maxSize);

    // first insert dots to make sure that labels don't collide with them
    d3.selectAll('.dot')
      .each(function (p) {
        // this points to the respective DOM element
        var pos = Converters.data2view([p.x, p.y]);
        var rect = {
          cx: pos[0],
          cy: pos[1],
          width: 2 * this.getAttribute("r"),
          height: 2 * this.getAttribute("r"),
        };

        if (debug) { addDebugRect(rect); }
        collisionDetector.add(rect);
      });

    d3.selectAll('.wikimap-label')
      .attr("visibility", function (p) {
        // this points to the respective DOM element
        var bbox = this.getBBox();
        var rect = {
          cx: bbox.x + bbox.width / 2,
          cy: bbox.y + bbox.height / 2,
          width: bbox.width,
          height: bbox.height,
        };

        if (debug) { addDebugRect(rect); }

        if (collisionDetector.isColliding(rect)) {
          return "hidden"; // collision, don't display
        } else {
          collisionDetector.add(rect);
          return "visible";
        }
      });
  };

  function trimIfLongerThan(string, length) {
    return (string.length <= length)? string : string.substring(0, length - 3)+'...';
  }

  function getMaxRectSize() {
    var maxTextSize = [0, 0];
    d3.selectAll(".wikimap-label")
      .each(function () {
        //this points to the label
        var bbox = this.getBBox();
        maxTextSize[0] = Math.max(maxTextSize[0], bbox.width);
        maxTextSize[1] = Math.max(maxTextSize[1], bbox.height);
      });

    var r = parent.getRadius(0); // max possible radius of a dot

    return [Math.max(2 * r, maxTextSize[0]), Math.max(2 * r, maxTextSize[1])];
  }

  function addDebugRect(rect) {
    d3.select(".debug")
      .append("rect")
      .attr("x", function () { return rect.cx - rect.width / 2; })
      .attr("y", function () { return rect.cy - rect.height / 2; })
      .attr("width", function () { return rect.width; })
      .attr("height", function () { return rect.height; })
      .style("stroke-width", 1)
      .style("stroke", "red");
  }
};

module.exports = LabelRenderer;
