var LRUCache = require('js-lru-cache'),
    $ = require('jquery');

var Cache = function (size, key, getter) {
  var that = this;

  var cache = new LRUCache(size, Number.MAX_SAFE_INTEGER); // don't expire cache

  this.get = function () {
    var k = key.apply(null, arguments);
    var item = cache.get(k);

    if (item) {
      return item; // it's a promise
    } else {
      var request = new $.Deferred(); // create a promise and place it in cache

      cache.set(k, request.promise());

      getter.apply(null, arguments)
        .done(function (res) {
          request.resolve(res);
        });

      return request.promise();
    }
  };
};

module.exports = Cache;