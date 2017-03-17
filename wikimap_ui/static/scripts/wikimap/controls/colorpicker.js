var Button = require('./button');
var Icons = require('./icons');
var ColorPalette = require('./colorpalette');
var Control = require('./control');

var ColorPicker = function (options) {
  var that = Control($('<div>').classify('colorpicker'), options);

  options.hook = that.$;
  var button = Button(options);
  var palette = ColorPalette({ hook: that.$, columns: 5 });

  that.$.click(function () { palette.show(); });
  palette.$.on('select', function (event, selectedColor) { event.stopPropagation(); that.changeColor(selectedColor); });

  that.changeColor = function (color) {
    button.icon.css('fill', color);
    that.$.trigger('select', [color]);
  };

  return that;
};

module.exports = ColorPicker;
