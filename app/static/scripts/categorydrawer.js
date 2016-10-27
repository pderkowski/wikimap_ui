var Cache = require('./cache');
var $ = require('jquery');

var CategoryDrawer = function (renderer) {
  var that = this;
  init();

  this.draw = function (name) {
    that._cache.get(name)
      .then(function (points) {
        if (!renderer.has(name)) {
          renderer.add(name, points, 1);
        }
      });
  };

  this.remove = function (name) {
    if (renderer.has(name)) {
      renderer.remove(name);
    }
  };

  this.changeColor = function (name) {
    if (renderer.has(name)) {
      renderer.changeColor(name);
    }
  };

  function init() {
    that._cache = new Cache(50,
      function (c) { return c; },
      function (c) { return $.getJSON($SCRIPT_ROOT + 'category?title='+c); });
  }
};

module.exports = CategoryDrawer;