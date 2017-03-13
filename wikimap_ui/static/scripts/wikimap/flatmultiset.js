var FlatMultiset = function () {
  var that = this;

  // hashmaps
  var handle2elems = Object.create(null);
  var elem2handles = Object.create(null);

  this.add = function (handle, elems) {
    if (handle in handle2elems) {
      console.log('Cannot add handle ' + handle + ': it already exists.');
    } else {
      handle2elems[handle] = elems;

      elems.forEach(function (el) {
        if (el in elem2handles) {
          elem2handles[el].push(handle);
        } else {
          elem2handles[el] = [handle];
        }
      });
    }
  };

  this.remove = function (handle) {
    if (!(handle in handle2elems)) {
      console.log('Cannot remove handle '+ handle + ': it does not exist.');
    } else {
      var elems = handle2elems[handle];
      delete handle2elems[handle];

      elems.forEach(function (el) {
        if (elem2handles[el].length == 1 && elem2handles[el][0] == handle) { // most cases should fall here
          delete elem2handles[el];
        } else {
          var idx = elem2handles[el].indexOf(handle);
          if (idx > -1) {
            elem2handles[el].splice(idx, 1);
          }
        }
      });
    }
  };

  this.getHandles = function (el) {
    return elem2handles[el];
  };

  this.getElements = function (handle) {
    return handle2elems[handle];
  };

  this.hasElement = function (el) {
    return el in elem2handles;
  };

  this.hasHandle = function (handle) {
    return handle in handle2elems;
  };
};

module.exports = FlatMultiset;