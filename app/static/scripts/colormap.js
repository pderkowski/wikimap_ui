var ColorMap = function () {
  var that = this;

  var name2colors = Object.create(null);

  this.get = function (name) {
    return name2colors[name];
  };

  this.set = function (name, color) {
    name2colors[name] = color;
  };

  this.remove = function (name, color) {
    if (name in name2colors) {
      delete name2colors[name];
    }
  };

  this.chooseRandom = function () {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
};

module.exports = ColorMap;