var Cache = require('./cache');
var TileScheduler = require('./tilescheduler');
var $ = require('jquery');

var CategoryDrawer = function (renderer) {
  var that = this;
  init();

  this.draw = function (name) {
    var needed = that._scheduler.add([name]);

    needed.forEach(function (name) {
      that._cache.get(name)
        .then(function (points) {
          console.log('point len: '+points.length);
          if (that._scheduler.isExpecting(name) && !renderer.has(name)) {
            renderer.add(name, points, 1);
            that._scheduler.finish(name);
          } else {
            that._scheduler.dismiss(name);
          }
        });
      });
  };

  this.remove = function (names) {
    names.forEach(function (n) {
      if (renderer.has(n)) {
        renderer.remove(n);
      }
    });
  };

  function init() {
    that._cache = new Cache(50,
      function (c) { return c; },
      function (c) { return $.getJSON($SCRIPT_ROOT + 'category?title='+c); });
    that._scheduler = new TileScheduler(that.remove);
  }
};

module.exports = CategoryDrawer;