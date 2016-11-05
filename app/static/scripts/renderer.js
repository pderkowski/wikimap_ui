var d3 = require('d3');
var FlatMultiset = require('./flatmultiset');

var Renderer = function(canvas, converters) {
  var that = this;

  this._renderedPoints = new FlatMultiset();
  this._name2priority = Object.create(null);
  this._name2color = Object.create(null);
  this._name2points = Object.create(null);
  this._lastScale = 1;

  this.setZoom = function (transform) {
    canvas.activeArea.attr("transform", transform);

    var scale = transform.k;
    if (that._lastScale != scale) {
      that._lastScale = scale; // getR and getFontSize depend on _lastScale

      // dont scale dots
      d3.selectAll(".dot")
        .attr("r", function(p) { return getR(p.z); });

      d3.selectAll(".wikimap-label")
        .attr("y", function(p) { return converters.data2viewbox([+p.x, +p.y])[1] + 1.05 * getR(p.z); });

      d3.select('.canvas-labels')
        .style("font-size", getFontSize()+"px");
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
  };

  this.has = function (name) {
    return that._renderedPoints.hasHandle(name);
  };

  this.redrawAll = function () {
    var all = d3.selectAll(".dot")
      .attr("cx", function(p) { return converters.data2viewbox([p.x, p.y])[0]; })
      .attr("cy", function(p) { return converters.data2viewbox([p.x, p.y])[1]; })
      .attr("r", function(p) { return getR(p.z); });

    updateFill(all);

    d3.select('.canvas-labels')
      .style("font-size", getFontSize()+"px")
      .selectAll('.wikimap-label')
      .attr("x", function(p) { return converters.data2viewbox([+p.x, +p.y])[0]; })
      .attr("y", function(p) { return converters.data2viewbox([+p.x, +p.y])[1] + 1.05 * getR(p.z); });
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
      .attr("cx", function(p) { return converters.data2viewbox([+p.x, +p.y])[0]; })
      .attr("cy", function(p) { return converters.data2viewbox([+p.x, +p.y])[1]; })
      .attr("r", function(p) { return getR(p.z); })
      .on("mouseover", canvas.tip.show)
      .on("mouseout", canvas.tip.hide)
      .merge(selection); // merge with updated points

    updateFill(changed);
  }

  function addLabels(points) {
    var maxLength = 15;

    d3.select('.canvas-labels')
      .style("font-size", getFontSize()+"px")
      .selectAll('.wikimap-label')
      .data(points, function (p) { return p.id; })
      .enter() // add new points
      .append("text")
      .classed("wikimap-label", true)
      .text(function(p) {
        if (p.title.length <= maxLength) {
          return p.title;
        } else {
          return p.title.substring(0, 12)+'...';
        }
      })
      .attr("x", function(p) { return converters.data2viewbox([+p.x, +p.y])[0]; })
      .attr("y", function(p) { return converters.data2viewbox([+p.x, +p.y])[1] + 1.05 * getR(p.z); })
      .attr("dy", "1em");
  }

  function updateFill(selection) {
    selection.style('fill', function (p) { return getColor(p.id); });
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
      }
    }

    var candidates = highestPriorityNames.map(function (n) { return that._name2color[n]; });
    return candidates[0];
  }

  function getR(z) {
    var base = 6;
    var coef = 0.8;
    return base * Math.pow(coef, z) / that._lastScale;
  }

  function getPointIds(points) {
    return points.map(function (p) { return p.id; });
  }
};

module.exports = Renderer;