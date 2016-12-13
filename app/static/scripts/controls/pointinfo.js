var PointInfo = function (hook) {
  var that = this;

  this._$panel = $('<div class="my hidden rounded shaded panel in-top-right-corner">');
  this._$header = $('<h1>').appendTo(this._$panel);
  this._$list = $('<ul>').appendTo(this._$panel);

  this._$panel.appendTo(hook);

  this.setData = function (data) {
    that._$header.text(data.title);
    that._$list.empty();
    data.highDimNeighs.forEach(function (n) {
      that._$list.append($('<li>').text(n));
    });
  };

  this.show = function () {
    that._$panel.removeClass('hide');
    that._$panel.addClass('show');
  };

  this.hide = function () {
    that._$panel.removeClass('show');
    that._$panel.addClass('hide');
  };
};

module.exports = PointInfo;
