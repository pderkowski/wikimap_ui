var d3 = require('d3');
var FlatMultiset = require('./flatmultiset');
var CollisionDetector = require('./collisiondetector');
var Converters = require('./converters');

var Renderer = function(canvas) {
  var that = this;

  this._renderedPoints = new FlatMultiset();
  this._name2priority = Object.create(null);
  this._name2color = Object.create(null);
  this._name2points = Object.create(null);
  this._lastScale = 1;
  this._lastZ = 0;

  this.setZoom = function (transform) {
    canvas.activeArea.attr("transform", transform);

    var scale = transform.k;
    if (that._lastScale != scale) {
      that._lastScale = scale; // getR and getFontSize depend on _lastScale
      that._lastZ = Math.log2(scale);

      // dont scale dots
      d3.selectAll(".dot")
        .attr("r", function(p) { return getR(p.z); });

      updateLabelPositionsAndSizes();
      updateLabelVisibility();
    }
  };

  this.add = function (name, points, priority, color) {
    that._name2points[name] = points;
    that._name2priority[name] = priority;
    that._name2color[name] = color;
    that.show(name);
  };

  this.show = function (name) {
    var points = that._name2points[name];
    that._renderedPoints.add(name, getPointIds(points));
    addPoints(points);
    addLabels(points);
  };

  this.remove = function (name) {
    delete that._name2priority[name];
    delete that._name2color[name];
    delete that._name2points[name];
    that.hide(name);
  };

  this.hide = function (name) {
    var ids = that._renderedPoints.getElements(name);
    that._renderedPoints.remove(name);

    var removed = d3.set(ids.filter(function (id) { return !that._renderedPoints.hasElement(id); }));
    var updated = d3.set(ids.filter(function (id) { return  that._renderedPoints.hasElement(id); }));

    d3.selectAll('.dot')
      .filter(function (p) { return removed.has(p.id); })
      .remove();

    d3.selectAll('.wikimap-label')
      .filter(function (p) { return removed.has(p.id); })
      .remove();

    updateFill(d3.selectAll('.dot')
      .filter(function (p) { return updated.has(p.id); }));

    updateLabelVisibility();
  };

  this.has = function (name) {
    return that._renderedPoints.hasHandle(name);
  };

  this.redrawAll = function () {
    var all = d3.selectAll(".dot")
      .attr("cx", function(p) { return Converters.data2viewbox([p.x, p.y])[0]; })
      .attr("cy", function(p) { return Converters.data2viewbox([p.x, p.y])[1]; })
      .attr("r", function(p) { return getR(p.z); });

    updateFill(all);
    updateLabelPositionsAndSizes();
    updateLabelVisibility();
  };

  this.changeColor = function (name, color) {
    that._name2color[name] = color;

    var updated = d3.set(that._renderedPoints.getElements(name));

    updateFill(d3.selectAll('.dot')
      .filter(function (p) { return updated.has(p.id); }));
  };

  function getFontSize() {
    var base = 10;
    return base / that._lastScale;
  }

  function addPoints(points) {
    var selection = d3.select('.canvas-dots')
      .selectAll('.dot')
      .data(points, function (p) { return p.id; });

    var changed = selection
      .enter() // add new points
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function(p) { return Converters.data2viewbox([+p.x, +p.y])[0]; })
      .attr("cy", function(p) { return Converters.data2viewbox([+p.x, +p.y])[1]; })
      .attr("r", function(p) { return getR(p.z); })
      .on("mouseover", canvas.tip.show)
      .on("mouseout", canvas.tip.hide)
      .merge(selection); // merge with updated points

    updateFill(changed);
  }

  function addLabels(points) {
    var maxLength = 15;

    var fontSize = getFontSize();
    var labels = d3.select('.canvas-labels')
      // .style("font-size", fontSize+"px")
      .selectAll('.wikimap-label')
      .data(points, function (p) { return p.id; })
      .enter(); // add new points

    labels.append("text")
      .classed("wikimap-label", true)
      .text(function (p) {
        if (p.title.length <= maxLength) {
          return p.title;
        } else {
          return p.title.substring(0, 12)+'...';
        }
      });

    updateLabelPositionsAndSizes();
    updateLabelVisibility();
  }

  function updateFill(selection) {
    selection.style('fill', function (p) { return getColor(p.id); });
  }

  function updateLabelPositionsAndSizes() {
    var fontSize = getFontSize();
    d3.select('.canvas-labels')
      .style("font-size", fontSize+"px")
      .selectAll('.wikimap-label')
      .attr("x", function (p) { return Converters.data2viewbox([+p.x, +p.y])[0]; })
      .attr("y", function (p) { return Converters.data2viewbox([+p.x, +p.y])[1] + getR(p.z) + fontSize / 6; })
      .attr("dy", "1em");
  }

  function updateLabelVisibility(debug) {
    var maxSize = getMaxRectSize();
    var collisionDetector = new CollisionDetector(maxSize);

    canvas.activeArea
      .select(".debug")
      .remove();

    if (debug) {
      canvas.activeArea
        .append("g")
        .classed("debug", true);
    }

    function addRect(rect) {
      d3.select(".debug")
        .append("rect")
        .attr("x", function () { return rect.cx - rect.width / 2; })
        .attr("y", function () { return rect.cy - rect.height / 2; })
        .attr("width", function () { return rect.width; })
        .attr("height", function () { return rect.height; })
        .style("stroke-width", 1 / that._lastScale)
        .style("stroke", "red");
    }

    // first insert dots to make sure that labels don't collide with them
    d3.selectAll('.dot')
      .each(function (p) {
        // this points to the respective DOM element
        var rect = {
          cx: this.getAttribute("cx"),
          cy: this.getAttribute("cy"),
          width: 2 * this.getAttribute("r"),
          height: 2 * this.getAttribute("r"),
        };

        if (debug) {
          addRect(rect);
        }
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

        if (debug) {
          addRect(rect);
        }

        if (collisionDetector.isColliding(rect)) {
          return "hidden"; // collision, don't display
        } else {
          collisionDetector.add(rect);
          return "visible";
        }
      });
  }

  function getColor(id) {
    var names = that._renderedPoints.getHandles(id);
    var highestPriorityNames = [];

    var highestPriority = 0;
    for (var i = 0; i < names.length; ++i) {
      var n = names[i];
      var priority = that._name2priority[n];

      if (priority == highestPriority) {
        highestPriorityNames.push(n);
      } else if (priority > highestPriority) {
        highestPriorityNames = [n];
        highestPriority = priority;
      }
    }

    var candidates = highestPriorityNames.map(function (n) { return that._name2color[n]; });
    return candidates[0];
  }

  function getR(z) {
    var base = 3;
    var step = 2;
    var diff = Math.max(Math.min(that._lastZ - z, 2), 0);
    return (base + diff * step) / that._lastScale;
  }

  function getPointIds(points) {
    return points.map(function (p) { return p.id; });
  }

  function getMaxRectSize() {
    var maxTextSize = [0, 0];
    d3.selectAll(".wikimap-label")
      .each(function () {
        //this points to the label
        var bbox = this.getBBox();
        maxTextSize[0] = Math.max(maxTextSize[0], bbox.width);
        maxTextSize[1] = Math.max(maxTextSize[1], bbox.height);
      })

    var r = getR(0); // max possible radius of a dot

    return [Math.max(2 * r, maxTextSize[0]), Math.max(2 * r, maxTextSize[1])];
  }
};

module.exports = Renderer;