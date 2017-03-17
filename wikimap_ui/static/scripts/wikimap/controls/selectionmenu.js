var Button = require('./button');
var Icons = require('./icons');
var ColorPicker = require('./colorpicker');
var Control = require('./control');

var MenuItem = function (id, label, color, options) {
  var that = Control($('<li>').classify('menu-item'), options);

  var $label = $('<div>').classify('item-label').text(label || "").appendTo(that.$);
  var $buttons = $('<div>').classify('button-container').appendTo(that.$);

  $label.addTooltipIfOverflows();

  that.toggleButton = Button({ icon: Icons.eye, tooltip: 'Show/Hide' });
  that.toggleButton.$.click(function () { that.$.trigger('toggle', [id]); });
  that.toggleButton.$.click(function () { that.toggleButton.$.toggleClass("deactivated"); });

  that.removeButton = Button({ icon: Icons.close, tooltip: 'Remove' });
  that.removeButton.$.click(function () { that.$.trigger('remove', [id]); });

  that.colorPicker = ColorPicker({ icon: Icons.circle, tooltip: 'Change color' });
  that.colorPicker.changeColor(color);
  that.colorPicker.$.on('select', function (event, color) { event.stopPropagation(); that.$.trigger('color', [id, color]); });

  $buttons.append(that.colorPicker.$, that.toggleButton.$, that.removeButton.$);

  return that;
};

var SelectionMenu = function (options) {
  var that = Control($('<ul>').classify('selection-menu'), options);

  var items = Object.create(null);

  that.add = function (id, name, color) {
    var item = MenuItem(id, name, color, { hook: that.$ });
    items[id] = item;
  };

  that.get = function (id) {
    return items[id];
  };

  that.remove = function (id) {
    if (items[id]) {
      items[id].$.remove();
      delete items[id];
    }
  };

  return that;
};

module.exports = SelectionMenu;
