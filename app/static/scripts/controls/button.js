var Control = require('./control');

var Button = function (options) {
  var that = Control($('<button type=button class="my button">'), options);

  if (options.icon) {
    that.icon = $(options.icon).appendTo(that.$);
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
