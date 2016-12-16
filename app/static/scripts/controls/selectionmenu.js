var Button = require('./button');
var Icons = require('./icons');
var ColorPicker = require('./colorpicker');
var Control = require('./control');
var Data = require('../data');

var MenuItem = function (label, color, options) {
  var that = Control($('<li>').classify('menu-item'), options);

  var $label = $('<div>').classify('item-label').text(label || "").appendTo(that.$);
  var $buttons = $('<div>').classify('button-container').appendTo(that.$);

  $label.addTooltipIfOverflows();

  that.toggleButton = Button({ icon: Icons.eye });
  that.toggleButton.$.click(function () { that.$.trigger('toggle', [$label.text()]); });
  that.toggleButton.$.click(function () { that.toggleButton.$.toggleClass("deactivated"); });

  that.removeButton = Button({ icon: Icons.close });
  that.removeButton.$.click(function () { that.$.trigger('remove', [$label.text()]); });

  that.colorPicker = ColorPicker({ icon: Icons.circle });
  that.colorPicker.changeColor(color);
  that.colorPicker.$.on('select', function (event, color) { event.stopPropagation(); that.$.trigger('color', [$label.text(), color]); });

  $buttons.append(that.colorPicker.$, that.toggleButton.$, that.removeButton.$);

  return that;
};

var SelectionMenu = function (options) {
  var that = Control($('<ul>').classify('selection-menu'), options);

  var items = Object.create(null);

  that.add = function (name, color) {
    if (!items[name]) {
      var item = MenuItem(name, color, { hook: that.$ });
      items[name] = item;
    }
  };

  that.remove = function (name) {
    if (items[name]) {
      items[name].$.remove();
      delete items[name];
    }
  };

  var unselectedPoints = MenuItem('Unselected points', Data.Colors.getDefault(), { hook: that.$ });
  unselectedPoints.removeButton.disable();
  unselectedPoints.$
    .on('toggle', function (event) { event.stopPropagation(); that.$.trigger('toggleUnselected'); })
    .on('color', function (event, name, color) { event.stopPropagation(); that.$.trigger('colorUnselected', [color]); });

  return that;
};

module.exports = SelectionMenu;
