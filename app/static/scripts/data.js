var Cache = require('./cache');

var Data = function (converters) {
  var that = this;

  var tileCache = new Cache(1000,
    function (x, y, z) { return x+','+y+','+z; },
    function (x, y, z) { return $.getJSON($SCRIPT_ROOT + 'points!'+x+'!'+y+'!'+z); });

  var categoryCache = new Cache(50,
    function (c) { return c; },
    function (c) { return $.getJSON($SCRIPT_ROOT + 'category?title='+c); });

  this.init = function () {
    return $.getJSON($SCRIPT_ROOT + 'bounds')
      .then(function (db) {
        var dataBounds = [[db.xMin, db.yMin], [db.xMax, db.yMax]];
        converters.setDataBounds(dataBounds);
      });
  };

  this.getTile = function (tile) {
    var args = tile.split(',');
    return tileCache.get(args[0], args[1], args[2]);
  };

  this.getCategory = function (category) {
    return categoryCache.get(category);
  };
};

module.exports = Data;