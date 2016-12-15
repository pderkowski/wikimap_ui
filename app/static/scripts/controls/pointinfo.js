var Dismissable = require('./dismissable');
var Control = require('./control');

var PointInfo = function (options) {
  var that = Control($('<div class="my hidden rounded shaded panel in-top-right-corner">'), options)
  that = Dismissable(that);

  that._$header = $('<h1>').appendTo(that.$);
  that._$list = $('<ul class="my list">').appendTo(that.$);

  that.setData = function (data) {
    that._$header.text(data.title);
    that._$list.empty();
    data.highDimNeighs.forEach(function (n) {
      that._$list.append($('<li>').text(n));
    });
  };

  that.show = function () {
    that.$.removeClass('hidden');
    that.onClickOutside(that.hide);
  };

  that.hide = function () {
    that.$.addClass('hidden');
  };

  return that;
};

module.exports = PointInfo;
