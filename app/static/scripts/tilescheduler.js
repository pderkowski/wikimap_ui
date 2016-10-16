var TileScheduler = function (removeCallback) { // the argument is a function to call when a tile is no longer needed
  var that = this;

  this._past = [];
  this._now = [];
  this._future = [];

  this.schedule = function (tiles) {
    that._past = setUnion(that._past, that._now); // everything that was and is now is to be removed
    that._past = setDifference(that._past, tiles); // unless it is also one of the requested tiles
    that._future = setDifference(tiles, that._now); // also don't fetch tiles that are already there
    // log('Scheduled ' + tiles);
    return that._future.slice();
  };

  this.isExpecting = function (tile) {
    return that._future.indexOf(tile) >= 0;
  };

  this.finish = function (tile) { // signal that a tile has been processed
    removeFromFuture(tile);
    addToNow(tile);
    cleanUpIfAllDone();
    // log('Finished '+ tile);
  };

  this.dismiss = function (tile) {
    removeFromFuture(tile);
    cleanUpIfAllDone();
    // log('Dismissed '+ tile);
  };

  function addToNow(tile) {
    var nowIdx = that._now.indexOf(tile);
    if (nowIdx < 0) {
      that._now.push(tile);
    }
  }

  function removeFromFuture(tile) {
    var futureIdx = that._future.indexOf(tile);
    if (futureIdx >= 0) {
      that._future.splice(futureIdx, 1);
    }
  }

  function cleanUpIfAllDone() {
    if (that._future.length == 0 && that._past.length > 0) {
      removeCallback(that._past);
      that._now = setDifference(that._now, that._past);
      that._past = [];
    }
  }

  function log(str) {
    console.log(str + ': sizes: ' + that._past.length + ' (past), ' + that._now.length + ' (now), ' + that._future.length + ' (future)');
  }

  function setDifference(subFrom, subWhat) {
    return subFrom.filter(function (e) { return subWhat.indexOf(e) < 0; });
  }

  function setUnion(s1, s2) {
    var smaller = (s1.length <= s2.length)? s1 : s2;
    var larger  = (s1.length <= s2.length)? s2 : s1;

    return larger.concat(smaller.filter(function (e) { return larger.indexOf(e) < 0; }));
  }
};

module.exports = TileScheduler;