var Button = require('./button');
var Icons = require('./icons');
require('jquery-ui/ui/position');

var ColorPalette = function (element, colors, columns) {
  var that = this;

  this._element = element;
  this._$element = $(this._element);
  this._element.className = "my rounded hidden animated shaded colorpalette";
  // this._element.classList.add("controls-animated");

  var buttons = colors.map(function (c) {
    var button = new Button(Icons.circle);
    button.changeColor(c);
    button.addHandler(function (source) {
      if (that._handler) {
        that._handler(c);
      }
    });
    return button;
  });

  for (var i = 0; i < buttons.length; ++i) {
    if (i % columns == 0) {
      buttons[i].addClass("first");
    }

    this._element.appendChild(buttons[i].getElement());
  }
};

ColorPalette.prototype.getElement = function () {
  return this._element;
};

ColorPalette.prototype.setHandler = function (handler) { // handler expects color as a single argument
  this._handler = handler;
};

ColorPalette.prototype.hide = function () {
  this._element.classList.add("hide");
  this._element.classList.remove("show");

  $(document).off("mousedown");
  this._$element.off("blur");
};

ColorPalette.prototype.isVisible = function () {
  return this._element.classList.contains("show");
};

ColorPalette.prototype.show = function (position) {
  this._element.classList.add("show");
  this._element.classList.remove("hide");

  this._hideOnClickOutside();

  this._$element.attr("tabindex", -1); // required to focus div
  this._$element.focus();

  this._$element.position(position);
};

ColorPalette.prototype._isTarget = function (e) {
  return (this._$element.is(e.target) // the target of the click is the element...
    || this._$element.has(e.target).length !== 0); // ... or a descendant of the element
};

ColorPalette.prototype._hideOnClickOutside = function () {
  var that = this;

  $(document).on("mousedown", function (e) {
    if (that._isTarget(e)) { // don't blur if clicked on the palette
      e.preventDefault(); // prevent from losing focus
    } else {
      that.hide();
    }
  });

  this._$element.on("blur", function (e) { // hide if lost focus
    that.hide();
  });
};

module.exports = ColorPalette;