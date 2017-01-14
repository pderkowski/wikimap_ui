function createPickOrder(length) {
  var array = [];
  for (var i = 0; i < length; ++i) {
    array.push(i);
  }

  // shuffle
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}


var Colors = function () {
  var that = this;

  var values = ['#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928','#a6cee3']
  // ["#d25337",
  // "#dd933f",
  // "#957233",
  // "#b0ad44",
  // "#bce548",
  // "#53813b",
  // "#51b693",
  // "#6290d1",
  // "#8062cc",
  // "#c94aa8",
  // "#5d3f4d",
  // "#999999"];

  var pickOrder = createPickOrder(values.length - 1);
  var lastPick = -1;

  this.getValues = function () {
    return values;
  };

  this.pick = function () {
    var currentPick = (lastPick + 1) % (values.length - 1);
    lastPick = currentPick;
    return values[pickOrder[currentPick]];
  };

  this.getDefault = function () {
    return values[values.length - 1];
  };
};

module.exports = Colors;