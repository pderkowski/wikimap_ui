var Dismissable = require('./dismissable');
var Control = require('./control');
var Tabs = require('./tabs');
var Table = require('./table');
var ButtonGroup = require('./buttongroup');
var Collapse = require('./collapse');

var PointInfo = function (options) {
  var that = Control($('<div>').classify('pointinfo'), options);
  that = Dismissable(that);

  var $header = $('<h4>')
    .appendTo($('<div>').classify('pointinfo-header')
      .appendTo(that.$));
  var $content = $('<div>').classify('pointinfo-content').appendTo(that.$);
  var tabTitles = ['Word embeddings', 't-SNE mappings'];
  var buttonLabels = ['Show links to', 'Show links from'];

  var buttons = ButtonGroup();
  buttons.add(buttonLabels[0]);
  buttons.add(buttonLabels[1]);
  buttons.get(0).$.on('click', function () { that.$.trigger('showInlinks', [that.data.title]); });
  buttons.get(1).$.on('click', function () { that.$.trigger('showOutlinks', [that.data.title]); });

  var tabs = Tabs();
  tabs.add(tabTitles[0]);
  tabs.add(tabTitles[1]);

  var $panelGroup = $('<div>').classify('panel-group').appendTo($content);

  var buttonsCollapse = Collapse({ hook: $panelGroup });
  buttonsCollapse.setTitle('Links');
  buttonsCollapse.setContent(buttons.$);

  var tabsCollapse = Collapse({ hook: $panelGroup });
  tabsCollapse.setTitle('Nearest neighbors');
  tabsCollapse.setContent(tabs.$);

  tabs.show(tabTitles[0]); // apparently tabs need to be fully plugged into the DOM for this to work

  that.setData = function (data) {
    that.data = data;
    $header.text(data.title);

    function trim(num) {
      return +(num).toFixed(3);
    }

    var embeddingsTable = createTable(data.highDimNeighs, data.highDimDists.map(trim));
    var tsneTable = createTable(data.lowDimNeighs, data.lowDimDists.map(trim));

    tabs.get(tabTitles[0]).empty().append(embeddingsTable.$);
    tabs.get(tabTitles[1]).empty().append(tsneTable.$);
  };

  that.show = function () {
    that.$.removeClass('hidden');
    that.onClickOutside(that.hide);
    $('td,th', tabs.$).addTooltipIfOverflows();
  };

  that.hide = function () {
    that.$.addClass('hidden');
  };

  function createTable(titles, distances) {
    var table = Table({ });
    table.addColumn('Title', titles);
    table.addColumn('Distance', distances);
    $('td:first-child,th:first-child', table.$).classify('first-column');
    $('td:last-child,th:last-child', table.$).classify('last-column');
    return table
  }

  return that;
};

module.exports = PointInfo;
