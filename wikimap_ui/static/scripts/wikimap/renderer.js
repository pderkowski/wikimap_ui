var PointRenderer = require('./pointrenderer');
var LabelRenderer = require('./labelrenderer');
var FlatMultiset = require('./flatmultiset');

var Renderer = function (canvas) {
  var that = this;

  this._lastScale = 1;
  this._lastZ = 0;

  this._name2priority = Object.create(null);
  this._name2color = Object.create(null);
  this._name2points = Object.create(null);
  this._renderedPoints = new FlatMultiset();

  this._points = new PointRenderer(this, canvas);
  this._labels = new LabelRenderer(this, canvas);

  this.setZoom = function (transform) {
    that._points.updatePositions();
    that._labels.updatePositions();

    var scale = transform.k;
    if (that._lastScale != scale) {
      that._lastScale = scale;
      // that._labels.updateVisibility();
    }

    var z = Math.log2(scale);
    if (that._lastZ != z) {
      that._lastZ = z;
      that._points.updateSizes(z);
    }
  };

  this.add = function (name, points, priority, color) {
    that._name2points[name] = points;
    that._name2priority[name] = priority;
    that._name2color[name] = color;
    that.show(name);
  };

  this.remove = function (name) {
    delete that._name2priority[name];
    delete that._name2color[name];
    delete that._name2points[name];
    that.hide(name);
  };

  this.removeMany = function (names) {
    if (names.some(that.has)) {
      names.forEach(function (name) {
        delete that._name2priority[name];
        delete that._name2color[name];
        delete that._name2points[name];
      });
      that.hideMany(names);
    }
  };

  this.show = function (name) {
    var points = that._name2points[name];
    that._renderedPoints.add(name, getPointIds(points));
    doShow(points);
  };

  this.hide = function (name) {
    if (that.has(name)) {
      var removed = getPointsToRemove(name);
      doHide(removed);
    }
  };

  this.hideMany = function (names) {
    var allRemoved = Object.create(null);
    names.forEach(function (name) {
      if (that.has(name)) {
        var removed = getPointsToRemove(name);
        for (var point in removed) {
          allRemoved[point] = removed[point];
        }
      }
    });
    doHide(allRemoved);
  };

  function doShow(points) {
    that._points.show(points);
    that._labels.show(points);
  }

  function doHide(points) {
    that._points.hide(points);
    that._labels.hide(points);
  }

  function getPointsToRemove(name) {
    var ids = that._renderedPoints.getElements(name);
    that._renderedPoints.remove(name);
    var removed = Object.create(null);
    ids.filter(function (id) { return !that._renderedPoints.hasElement(id); })
      .forEach(function (id) { removed[id] = true; });
    return removed;
  }

  this.redrawAll = function () {
    that._points.updatePositions();
    that._points.updateSizes();
    that._points.updateColors();
    that._labels.updatePositions();
    that._labels.updateVisibility();
  };

  this.has = function (name) {
    return that._renderedPoints.hasHandle(name);
  };

  this.changeColor = function (name, color) {
    that._name2color[name] = color;
    that._points.updateColors();
  };

  this.getColor = function (id) {
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
  };

  this.getRadius = function(z) {
    var base = 3;
    var step = 2;
    var diff = Math.max(Math.min(that._lastZ - z, 2), 0);
    return (base + diff * step);
  };

  function getPointIds(points) {
    return points.map(function (p) { return p.id; });
  }
};

module.exports = Renderer;
