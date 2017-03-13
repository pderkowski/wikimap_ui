var LRUCache = require('js-lru-cache');

var Cache = function (size, getter) {
  var that = this;

  var cache = new LRUCache(size, Number.MAX_SAFE_INTEGER); // don't expire cache

  this.get = function (key) {
    var keyString = key.toString();
    var item = cache.get(keyString);

    if (item) {
      return item; // it's a promise
    } else {
      var request = new $.Deferred(); // create a promise and place it in cache

      cache.set(keyString, request.promise());

      getter(keyString)
        .done(function (res) {
          request.resolve(res);
        });

      return request.promise();
    }
  };
};

module.exports = Cache;