var Button = require('./button');
var Icons = require('./icons');

var ColorPalette = function (colors) {
  var that = this;

  var buttons = colors.map(function (c) {
    var button = new Button(Icons.circle);
    button.changeColor(c);
    return button;
  });

  this._element = document.createElement("div");
  buttons.forEach(function (b) {
    that._element.appendChild(b.getElement());
  });
};

ColorPalette.prototype.getElement = function () {
  return this._element;
};

module.exports = ColorPalette;