var Control = require('./control');

var Button = function (options) {
  var that = Control($('<button type=button">').classify('button'), options);

  if (options.icon) {
    that.icon = $(options.icon).appendTo(that.$);
  }

  if (options.tooltip) {
    that.$.tooltip({
      title: options.tooltip,
      trigger: 'hover',
      container: 'body'
    });
  }

  that.disable = function () {
    that.$.prop('disabled', true);
    that.$.addClass("deactivated");
  };

  that.enable = function () {
    that.$.prop('disabled', false);
    that.$.removeClass("deactivated");
  };

  return that;
};

module.exports = Button;
