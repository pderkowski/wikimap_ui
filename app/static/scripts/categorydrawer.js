var CategoryDrawer = function (data, renderer) {
  var that = this;

  this.add = function (name, color) {
    data.getCategory(name)
      .then(function (points) {
        if (!renderer.has(name)) {
          renderer.add(name, points, 1, color);
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

  this.changeColor = function (name, color) {
    if (renderer.has(name)) {
      renderer.changeColor(name, color);
    }
  };
};

module.exports = CategoryDrawer;