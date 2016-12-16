var Dismissable = require('./dismissable');
var Control = require('./control');
var Tabs = require('./tabs');
var Table = require('./table');

var PointInfo = function (options) {
  var that = Control($('<div>').classify('pointinfo'), options)
  that = Dismissable(that);

  var $header = $('<h1>').appendTo(that.$);

  var tabs = Tabs({ hook: that.$ });
  tabs.add('Nearest word embeddings');
  tabs.add('Nearest t-SNE mappings');
  tabs.show('Nearest word embeddings');

  that.setData = function (data) {
    $header.text(data.title);

    function trim(num) {
      return +(num).toFixed(3);
    }

    var embeddingsTable = createTable(data.highDimNeighs, data.highDimDists.map(trim));
    var tsneTable = createTable(data.lowDimNeighs, data.lowDimDists.map(trim));

    tabs.get('Nearest word embeddings').empty().append(embeddingsTable.$);
    tabs.get('Nearest t-SNE mappings').empty().append(tsneTable.$);
  };

  that.show = function () {
    that.$.removeClass('hidden');
    that.onClickOutside(that.hide);
  };

  that.hide = function () {
    that.$.addClass('hidden');
  };

  function createTable(titles, distances) {
    var table = Table({ });
    table.addColumn('Title', titles);
    table.addColumn('Distance', distances);
    return table
  }

  return that;
};

module.exports = PointInfo;
