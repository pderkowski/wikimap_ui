var Control = require('./control');

var ButtonGroup = function (options) {
  var that = Control($('<div role="group">').classify('button-group'), options);

  that.addButton = function (label, options) {
    var button = Control($('<a role="button">').classify('button-grouped'), options);
    button.$.text(label);
    button.$.appendTo(that.$);
  };

  return that;
};

module.exports = ButtonGroup;
