var d3 = require('d3');
var d3tip = require('d3-tip');
var FlatMultiset = require('./flatmultiset');

var Renderer = function(svg, converter, hackScale) {
  var that = this;

  init();

  this.setZoomTransform = function(transform) {
    that._all.attr("transform", transform);

    var scale = transform.k;
    if (that._lastScale != scale) {
      that._lastScale = scale; // getR and getFontSize depend on _lastScale

      // dont scale dots
      d3.selectAll(".dot")
        .attr("r", function(p) { return getR(p.z); });

      d3.selectAll(".label")
        .attr("y", function(p) { return converter.applyTransition([+p.x, +p.y])[1] + 1.05 * getR(p.z); })
        .style("font-size", getFontSize()+"px");
    }
  };

  this.add = function(name, points) {
    that._renderedPoints.add(name, getPointIds(points));
    that._name2color[name] = chooseColor();

    addPoints(points);
    addLabels(points);
  };

  this.has = function (name) {
    return that._renderedPoints.hasHandle(name);
  }

  this.remove = function(name) {
    var ids = that._renderedPoints.getElements(name);
    that._renderedPoints.remove(name);
    delete that._name2color[name];

    var removed = d3.set(ids.filter(function (id) { return !that._renderedPoints.hasElement(id); }));
    var updated = d3.set(ids.filter(function (id) { return  that._renderedPoints.hasElement(id); }));

    d3.selectAll('.dot')
      .filter(function (p) { return removed.has(p.id); })
      .remove();

    d3.selectAll('.label')
      .filter(function (p) { return removed.has(p.id); })
      .remove();

    updateFill(d3.selectAll('.dot')
      .filter(function (p) { return updated.has(p.id); }));
  };

  this.redrawAll = function() {
    d3.selectAll(".dot")
      .attr("cx", function(p) { return converter.applyTransition([p.x, p.y])[0]; })
      .attr("cy", function(p) { return converter.applyTransition([p.x, p.y])[1]; });
  };

  function getFontSize() {
    var base = 10;
    return hackScale * base / that._lastScale;
  }

  function addPoints(points) {
    var selection = d3.select('.dots')
      .selectAll('.dot')
      .data(points, function (p) { return p.id; });

    var changed = selection
      .enter() // add new points
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function(p) { return converter.applyTransition([+p.x, +p.y])[0]; })
      .attr("cy", function(p) { return converter.applyTransition([+p.x, +p.y])[1]; })
      .attr("r", function(p) { return getR(p.z); })
      .on("mouseover", that._tip.show)
      .on("mouseout", that._tip.hide)
      .merge(selection); // merge with updated points

    updateFill(changed);
  }

  function addLabels(points) {
    var maxLength = 15;

    var selection = d3.select('.labels')
      .selectAll('.label')
      .data(points, function (p) { return p.id; })
      .enter() // add new points
      .append("text")
      .classed("label", true)
      .text(function(p) {
        if (p.name.length <= maxLength) {
          return p.name;
        } else {
          return p.name.substring(0, 12)+'...';
        }
      })
      .style("font-size", getFontSize()+"px")
      .attr("x", function(p) { return converter.applyTransition([+p.x, +p.y])[0]; })
      .attr("y", function(p) { return converter.applyTransition([+p.x, +p.y])[1] + 1.05 * getR(p.z); })
      .attr("dy", "1em");
  }

  function init() {
    that._all = svg.append("g")
      .attr("id", "all");

    that._all.append("g")
      .classed("dots", true);

    that._all.append("g")
      .classed("labels", true);

    that._renderedPoints = new FlatMultiset();
    that._name2color = Object.create(null);
    that._lastScale = 1;

    that._tip = d3tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(p) {
        return p.name;
      });

    svg.call(that._tip);
  }

  function updateFill(selection) {
    selection
      .style('fill', function (p) { return getColor(p.id); });
  }

  function getColor(id) {
    var names = that._renderedPoints.getHandles(id);
    var colors = names.map(function (n) { return that._name2color[n]; });
    return colors[0];
  }

  function getR(z) {
    var base = 6;
    var coef = 0.8;
    return hackScale * base * Math.pow(coef, z) / that._lastScale;
  }

  function getPointIds(points) {
    return points.map(function (p) { return p.id; });
  }

  function chooseColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
};

module.exports = Renderer;