var Control = function (root, options) {
  var that = {};
  that.$ = $(root);

  if (options.hook) {
    if (options.replace) {
      $(options.hook).replaceWith(that.$);
    } else {
      $(options.hook).append(that.$);
    }
  }

  return that;
};

module.exports = Control;
