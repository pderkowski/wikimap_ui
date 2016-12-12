var SelectionDrawer = function (data, renderer) {
  var that = this;

  this.addCategory = function (name, color) {
    data.Category.get(name)
      .then(function (points) {
        if (!renderer.has(name)) {
          renderer.add(name, points, 1, color);
        }
      });
  };

  this.addPoint = function (name, color) {
    data.Point.get(name)
      .then(function (point) {
        if (!renderer.has(name)) {
          renderer.add(name, [point], 2, color);
        }
      });
  };

  this.remove = function (name) {
    if (renderer.has(name)) {
      renderer.remove(name);
    }
  };

  this.hide = function (name) {
    if (renderer.has(name)) {
      renderer.hide(name);
    }
  };

  this.show = function (name) {
    renderer.show(name);
  };

  this.has = function (name) {
    return renderer.has(name);
  };

  this.changeColor = function (name, color) {
    renderer.changeColor(name, color);
  };
};

module.exports = SelectionDrawer;