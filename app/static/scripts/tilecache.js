var LRUCache = require('js-lru-cache'),
    $ = require('jquery');

var TileCache = function () {
  var that = this;

  var cache = new LRUCache(1000, Number.MAX_SAFE_INTEGER); // don't expire cache

  this.get = function (xIndex, yIndex, level) {
    var key = [xIndex, yIndex, level];
    var item = cache.get(key);

    if (item) {
      return item; // it's a promise
    } else {
      var request = new $.Deferred(); // create a promise and place it in cache

      cache.set(key, request.promise());

      loadPoints(xIndex, yIndex, level)
        .done(function (points) {
          request.resolve(points);
        });

      return request.promise();
    }
  };

  function loadPoints(xIndex, yIndex, level) {
    return $.getJSON($SCRIPT_ROOT + 'points!'+xIndex+'!'+yIndex+'!'+level);
  }
};

module.exports = TileCache;