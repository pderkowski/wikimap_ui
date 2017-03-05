var Cache = require('./cache');
var Colors = require('./colors');

var Bounds = function () {
  function url() { return $SCRIPT_ROOT + 'bounds'; }

  this.get = function () { return $.getJSON(url()); };
};

var Tile = function () {
  function url(x, y, z) {
    return $SCRIPT_ROOT + 'points!'+x+'!'+y+'!'+z;
  }

  var cache = new Cache(1000, function (name) {
    var args = name.split(',');
    return $.getJSON(url(args[0], args[1], args[2]));
  });

  this.get = function (name) {
    return cache.get(name);
  };
};

var Category = function () {
  function url(c) {
    return $SCRIPT_ROOT + 'category?title=' + c;
  }

  var cache = new Cache(100, function (c) { return $.getJSON(url(c)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

var Point = function () {
  function url(p) {
    return $SCRIPT_ROOT + 'point?title=' + p;
  }

  var cache = new Cache(100, function (p) { return $.getJSON(url(p)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

var Terms = function () {
  function url(t) {
    return $SCRIPT_ROOT+'search?term='+t;
  }

  var cache = new Cache(1000, function (t) { return $.getJSON(url(t)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

var Details = function () {
  function url(p) {
    return $SCRIPT_ROOT+'details?title='+p;
  }

  var cache = new Cache(100, function (p) { return $.getJSON(url(p)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

var Inlinks = function () {
  function url(p) {
    return $SCRIPT_ROOT+'inlinks?title='+p;
  }

  var cache = new Cache(100, function (p) { return $.getJSON(url(p)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

var Outlinks = function () {
  function url(p) {
    return $SCRIPT_ROOT+'outlinks?title='+p;
  }

  var cache = new Cache(100, function (p) { return $.getJSON(url(p)); });

  this.get = function (name) {
    return cache.get(name);
  };
};

module.exports = {
  Bounds: new Bounds(),
  Tile: new Tile(),
  Category: new Category(),
  Point: new Point(),
  Terms: new Terms(),
  Colors: new Colors(),
  Details: new Details(),
  Inlinks: new Inlinks(),
  Outlinks: new Outlinks()
};