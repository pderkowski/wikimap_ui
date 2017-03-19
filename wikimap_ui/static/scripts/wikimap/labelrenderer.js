var d3 = require('d3');
var Converters = require('./converters');
var CollisionDetector = require('./collisiondetector');

var LabelRenderer = function (parent, canvas) {
  var that = this;

  var debug = false;
  if (debug) {
    canvas.d3content
      .append("g")
      .classed("debug", true);
  }

  this.show = function (points) {
    var labels = canvas.d3labels
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
    canvas.d3labels
      .selectAll('.wikimap-label')
      .attr("x", function (p) { return Converters.data2view([+p.x, +p.y])[0]; })
      .attr("y", function (p) { return Converters.data2view([+p.x, +p.y])[1] + parent.getRadius(p.z) + canvas.fontSize + 2; });

    if (debug) { that.updateVisibility(); }
  };

  this.updateVisibility = function () {
    // function logBounds(bounds) {
    //   console.log('['+bounds[0][0].toFixed(1)+', '+bounds[0][1].toFixed(1)+'] ['+bounds[1][0].toFixed(1)+', '+bounds[1][1].toFixed(1)+']');
    // }

    var bounds = getBounds();
    var bucketSize = [200, 30];

    var collisionDetector = new CollisionDetector.BCollisionDetector(bounds, bucketSize);

    if (debug) { clearDebugRects(); }

    // first insert dots to make sure that labels don't collide with them
    d3.selectAll('.dot')
      .each(function (p) {
        var bbox = this.getBBox();
        var rect = {
          cx: bbox.x + bbox.width / 2,
          cy: bbox.y + bbox.height / 2,
          width: bbox.width,
          height: bbox.height
        };

        if (debug) { addDebugRect(rect); }
        collisionDetector.add(rect);
      });

    var id2bbox = Object.create(null);
    d3.selectAll('.wikimap-label')
      .each(function (p) {
        id2bbox[p.id] = this.getBBox();
      });

    d3.selectAll('.wikimap-label')
      .attr("visibility", function (p) {
        var bbox = id2bbox[p.id];
        var rect = {
          cx: bbox.x + bbox.width / 2,
          cy: bbox.y + bbox.height / 2,
          width: bbox.width,
          height: bbox.height
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

  function clearDebugRects() {
    d3.select(".debug")
      .selectAll("rect")
      .remove();
  }

  function getBounds() {
    var origin = canvas.content.getBoundingClientRect(); // the (0, 0) point of labels and dots may not be (0, 0) of the window
    var rect1 = canvas.labels.getBoundingClientRect();
    var rect2 = canvas.dots.getBoundingClientRect();
    var bounds = [[Math.min(rect1.left, rect2.left), Math.min(rect1.top, rect2.top)], [Math.max(rect1.right, rect2.right), Math.max(rect1.bottom, rect2.bottom)]];
    bounds[0][0] -= origin.left;
    bounds[1][0] -= origin.left;
    bounds[0][1] -= origin.top;
    bounds[1][1] -= origin.top;
    return bounds;
  }
};

module.exports = LabelRenderer;
