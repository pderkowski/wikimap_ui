var Button = require('./button');
var Icons = require('./icons');
var Dismissable = require('./dismissable');
var Data = require('../data');
var Control = require('./control');

var ColorPalette = function (options) {
  var that = Control($('<div>').classify('palette'), options);
  that = Dismissable(that);

  var columns = options.columns || 4;
  var colors = options.colors || Data.Colors.getValues();

  var lastRow = null;
  for (var i = 0; i < colors.length; ++i) {
    if (i % columns == 0) {
      lastRow = $('<div>').classify('palette-row').appendTo(that.$);
    }

    var button = Button({ icon: Icons.circle, hook: lastRow });
    button.icon.css('fill', colors[i]);
    button.$.click((function (color) { return function () { that.$.trigger('select', [color]); } })(colors[i])); // bind color from current iteration to callback
  }

  that.hide = function () {
    that.$.addClass('hidden');
  };

  that.show = function () {
    that.$.removeClass("hidden");
    that.onClickOutside(that.hide);
  };

  return that
};

module.exports = ColorPalette;
