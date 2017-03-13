var Register = function () {
  var that = this;

  this._requested = []; // items that are not yet present
  this._completed = []; // items that are present and should be kept
  this._retired = [];   // items that are present and should be removed
  // These 3 categories are supposed to be disjoint sets with unique elements.

  this.request = function (item) {
    addTo(that._requested, item);
    removeFrom(that._completed, item);
    removeFrom(that._retired, item);
  };

  this.complete = function (item) {
    removeFrom(that._requested, item);
    addTo(that._completed, item);
    removeFrom(that._retired, item);
  };

  this.retire = function (item) {
    removeFrom(that._requested, item);
    removeFrom(that._completed, item);
    addTo(that._retired, item);
  };

  this.dismiss = function (item) {
    removeFrom(that._requested, item);
  };

  this.isRequested = function (item) {
    return has(that._requested, item);
  };

  this.isCompleted = function (item) {
    return has(that._completed, item);
  };

  this.isRetired = function (item) {
    return has(that._retired, item);
  };

  this.isPresent = function (item) {
    return that.isRetired(item) || that.isCompleted(item);
  };

  this.clearRequested = function () {
    that._requested = [];
  };

  this.clearRetired = function () {
    that._retired = [];
  };

  this.retireCompleted = function () {
    that._retired = that._retired.concat(that._completed);
    that._completed = [];
  };

  this.getPresent = function () {
    return that._retired.concat(that._completed);
  };

  this.getNeeded = function () {
    return that._completed.concat(that._requested);
  };

  this.getRetired = function () {
    return that._retired;
  };

  this.getRequested = function () {
    return that._requested;
  };

  this.hasRequested = function () {
    return that._requested.length > 0;
  };

  function addTo(set, item) {
    if (set.indexOf(item) < 0) {
      set.push(item);
    }
  }

  function removeFrom(set, item) {
    var idx = set.indexOf(item);
    if (idx >= 0) {
      set.splice(idx, 1);
    }
  }

  function has(set, item) {
    return set.indexOf(item) >= 0;
  }
};

module.exports = Register;