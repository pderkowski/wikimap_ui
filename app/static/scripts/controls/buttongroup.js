var Control = require('./control');

var ButtonGroup = function (options) {
  var that = Control($('<div role="group">').classify('button-group'), options);
  var buttons = [];

  that.add = function (label, options) {
    var button = Control($('<a role="button">').classify('button-grouped'), options);
    button.$.text(label);
    button.$.appendTo(that.$);
    buttons.push(button);
  };

  that.get = function (index) {
    return buttons[index];
  };

  return that;
};

module.exports = ButtonGroup;
