var Button = require('./button');
var Icons = require('./icons');
var ColorPalette = require('./colorpalette');
var Control = require('./control');

var ColorPicker = function (options) {
  var that = Control($('<div>').classify('colorpicker'), options);

  var button = Button({ hook: that.$, icon: Icons.circle });
  var palette = ColorPalette({ hook: that.$ });

  that.$.click(function () { palette.show(); });
  palette.$.on('select', function (event, selectedColor) { event.stopPropagation(); that.changeColor(selectedColor); });

  that.changeColor = function (color) {
    button.icon.css('fill', color);
    that.$.trigger('select', [color]);
  };

  return that;
};

module.exports = ColorPicker;
