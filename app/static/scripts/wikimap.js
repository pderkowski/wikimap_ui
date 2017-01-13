var Data = require('./data');
var View = require('./view');
var ViewController = require('./viewcontroller');
var Search = require('./search');
var PointInfo = require('controls/pointinfo');
var SelectionMenu = require('controls/selectionmenu');
var Converters = require('./converters');

var Wikimap = function () {
  var that = this;

  that._view = new View();
  that._pointInfo = PointInfo({ hook: $('#pointinfo-container') });
  that._search = Search({ hook: $('#search-container') });
  that._search.$
    .on('categorySelected', function (event, name) { addCategory(name); })
    .on('pointSelected', function (event, name) { addPoint(name); });
  that._selectionMenu = SelectionMenu({ hook: $('#selections-container') });
  that._selectionMenu.$
    .on('toggle', function (event, id) { that._view.toggle(id); })
    .on('remove', function (event, id) { that._view.remove(id); that._selectionMenu.remove(id); })
    .on('color', function (event, id, color) { that._view.changeColor(id, color); });
  that._viewController = ViewController(that._view);
  that._viewController.$
    .on('pointClicked', function (event, dot) { showDetails(dot); });

  initSelectionMenu();

  function addCategory(name) {
    var color = Data.Colors.pick();
    var id = that._view.addCategory(name, color);
    that._selectionMenu.add(id, name, color);
  }

  function addPoint(name) {
    var color = Data.Colors.pick();
    var id = that._view.addPoint(name, color);
    that._selectionMenu.add(id, name, color);
    that._viewController.centerOn(name);
  }

  function initSelectionMenu() {
    var id = that._view.tiles.getId();
    that._selectionMenu.add(id, 'Unselected points', Data.Colors.getDefault());
    that._selectionMenu.get(id).removeButton.disable();
  }

  function showDetails(dot) {
    Data.Details.get(dot.title)
      .then(function (details) {
        that._pointInfo.setData(details);
        that._pointInfo.show();
      });
  }

  this.start = function () {
    return Data.Bounds.get()
      .then(function (bounds) {
        Converters.setDataBounds(bounds);
        that._viewController.start();
      });
  };
};

module.exports = Wikimap;