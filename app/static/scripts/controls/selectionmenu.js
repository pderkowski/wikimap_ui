var Button = require('./button');
var Icons = require('./icons');
var ColorPicker = require('./colorpicker');
var Control = require('./control');
var Data = require('../data');

var MenuItem = function (label, color) {
  var that = Control($('<li class="my list-item clearfix">'), {});

  var $label = $('<div class="my item-label">').text(label || "").appendTo(that.$);
  var $buttons = $('<div class="my button-container clearfix">').appendTo(that.$);

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
  var that = Control($('<ul class="my rounded shaded list in-bottom-left-corner clearfix">'), options);

  var items = Object.create(null);

  that.add = function (name, color) {
    if (!items[name]) {
      var item = new MenuItem(name, color);
      items[name] = item;
      that.$.append(item.$);
    }
  };

  that.remove = function (name) {
    if (items[name]) {
      items[name].$.remove();
      delete items[name];
    }
  };

  var unselectedPoints = new MenuItem('Unselected points', Data.Colors.getDefault());
  unselectedPoints.removeButton.disable();
  unselectedPoints.$
    .on('toggle', function (event) { event.stopPropagation(); that.$.trigger('toggleUnselected'); })
    .on('color', function (event, name, color) { event.stopPropagation(); that.$.trigger('colorUnselected', [color]); })
    .appendTo(that.$);

  return that;
};

module.exports = SelectionMenu;
