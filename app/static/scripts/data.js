var Cache = require('./cache');
var Colors = require('./colors');

var Bounds = function () {
  function url() { return $SCRIPT_ROOT + 'bounds'; }

  this.get = function () { return $.getJSON(url()); };
};

var Tile = function () {
  function url(x, y, z) {
    return $SCRIPT_ROOT + 'points!'+x+'!'+y+'!'+z
  }

  var cache = new Cache(1000,
    function (x, y, z) { return x+','+y+','+z; },
    function (x, y, z) { return $.getJSON(url(x, y, z)); });

  this.get = function (name) {
    var args = name.split(',');
    return cache.get(args[0], args[1], args[2]);
  };
};

var Category = function () {
  function url(c) {
    return $SCRIPT_ROOT + 'category?title=' + c;
  }

  var cache = new Cache(100,
    function (c) { return c; },
    function (c) { return $.getJSON(url(c)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

var Point = function () {
  function url(p) {
    return $SCRIPT_ROOT + 'point?title=' + p;
  }

  var cache = new Cache(100,
    function (p) { return p; },
    function (p) { return $.getJSON(url(p)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

var Term = function () {
  function url(t) {
    return $SCRIPT_ROOT+'search?title='+t;
  }

  var cache = new Cache(1000,
    function (t) { return t; },
    function (t) { return $.getJSON(url(t)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

var Details = function () {
  function url(p) {
    return $SCRIPT_ROOT+'details?title='+p;
  }

  var cache = new Cache(100,
    function (p) { return p; },
    function (p) { return $.getJSON(url(t)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

module.exports = {
  Bounds: new Bounds(),
  Tile: new Tile(),
  Category: new Category(),
  Point: new Point(),
  Term: new Term(),
  Colors: new Colors(),
  Details: new Details()
};