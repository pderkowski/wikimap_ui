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

  var values = ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf',
    '#aec7e8','#ffbb78','#98df8a','#ff9896','#c5b0d5','#c49c94','#f7b6d2','#c7c7c7','#dbdb8d','#9edae5'];

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