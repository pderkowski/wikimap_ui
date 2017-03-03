var Control = require('./control');

var Collapse = function (options) {
  var that = Control($('<div class="panel panel-default">'), options);

  var $header = $('<div>').classify('panel-heading')
    .append($('<h4>').classify('panel-title')
      .append($('<a role="button">')))
    .on('click', function () { $panel.collapse('toggle'); })
    .appendTo(that.$);

  var $panel = $('<div class="panel-collapse collapse">').appendTo(that.$);
  var $content = $('<div>').classify('panel-body')
    .appendTo($panel);

  that.setTitle = function (title) {
    $('a', $header).text(title);
  };

  that.setContent = function (content) {
    $content.empty().append(content);
  };

  return that;
}

module.exports = Collapse;
