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
    var bucketSize = [200, 30];
    var collisionDetector = new CollisionDetector.UBCollisionDetector(bucketSize);
    if (debug) { clearDebugRects(); }
    // first insert dots to make sure that labels don't collide with them
    d3.selectAll('.dot')
      .each(function (dot) {
        var rect = parent._points._estimateRect(dot);
        if (debug) { addDebugRect(rect); }
        collisionDetector.add(rect);
      });

    d3.selectAll('.wikimap-label')
      .attr("visibility", function (label) {
        var rect = that._estimateRect(label);
        if (debug) { addDebugRect(rect); }

        if (collisionDetector.isColliding(rect)) {
          return "hidden"; // collision, don't display
        } else {
          collisionDetector.add(rect);
          return "visible";
        }
      });
  };

  this._estimateRect = function (p) {
    var fontStyle = canvas.fontFamily + " " + canvas.fontSize+"px";
    var text = trimIfLongerThan(p.title, 20);
    var width = getTextWidth(p.title, fontStyle);
    var height = canvas.fontSize;
    return {
      cx: Converters.data2view([+p.x, +p.y])[0],
      cy: Converters.data2view([+p.x, +p.y])[1] + parent.getRadius(p.z) + canvas.fontSize / 2 + 2,
      width: width,
      height: height
    };
  };

  function getTextWidth(text, font) {
      // re-use canvas object for better performance
      var canvas = this.canvas || (this.canvas = document.createElement("canvas"));
      var context = canvas.getContext("2d");
      context.font = font;
      return context.measureText(text).width;
  }

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
};

module.exports = LabelRenderer;
