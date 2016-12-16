var Control = require('./control');

var Tabs = function (options) {
  var that = Control($('<div class="my tabs">'), options);
  var tabs = $('<ul class="nav nav-tabs" role="tablist">').appendTo(that.$);
  var panes = $('<div class="tab-content">').appendTo(that.$);
  var tab2pane = Object.create(null);

  that.add = function (title, content) {
    var id = generateUniqueId();
    $('<li role="presentation"><a data-target="#'+id+'" role="tab">'+title+'</a></li>').appendTo(tabs).click(function () { $('a', this).tab('show'); });
    var pane = $('<div role="tabpanel" class="tab-pane" id="'+id+'">').append(content).appendTo(panes);
    tab2pane[title] = pane;
  };

  that.get = function (title) {
    return tab2pane[title];
  };

  that.show = function (title) {
    var pane = that.get(title);
    var id = pane.attr('id');
    var tab = $('a[data-target="#'+id+'"]', tabs);
    console.log(tab);
    tab.tab('show');
  };

  function generateUniqueId() {
    var id = 'id-';
    var targetLength = id.length + 16;

    while (id.length < targetLength) {
      id += Math.random().toString(36).substr(2, 16);
    }
    return id.substr(0, targetLength);
  }

  return that;
};

module.exports = Tabs;
