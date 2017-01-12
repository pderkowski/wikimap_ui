var Canvas = require('./canvas');
var Converters = require('./converters');
var Data = require('./data');
var ViewController = require('./viewcontroller');
var Search = require('./search');
var PointInfo = require('controls/pointinfo');
var SelectionMenu = require('controls/selectionmenu')

var Wikimap = function () {
  var that = this;

  function addCategorySelection(name) {
    var color = Data.Colors.pick();
    that._viewController.addCategorySelection(name, color);
    that._selectionMenu.add(name, color);
  }

  function addPointSelection(name) {
    var color = Data.Colors.pick();
    that._viewController.addPointSelection(name, color);
    that._selectionMenu.add(name, color);
    that._viewController.centerOn(name);
  }

  function removeSelection(name) {
    that._viewController.removeSelection(name);
    that._selectionMenu.remove(name);
  }

  function toggleSelection(name) {
    if (that._viewController.hasSelection(name)) {
      that._viewController.hideSelection(name);
    } else {
      that._viewController.showSelection(name);
    }
  }

  function changeSelectionColor(name, color) {
    that._viewController.changeSelectionColor(name, color);
  }

  function changeUnselectedPointsColor(color) {
    that._viewController.changeUnselectedPointsColor(color);
  }

  function toggleUnselectedPoints() {
    if (that._viewController.hasUnselectedPoints()) {
      that._viewController.hideUnselectedPoints();
    } else {
      that._viewController.showUnselectedPoints();
    }
  }

  function showDetails(dot) {
    Data.Details.get(dot.title)
      .then(function (details) {
        that._pointInfo.setData(details);
        that._pointInfo.show();
      });
  }

  function hideDetails() {
    that._pointInfo.hide();
  }

  this.start = function () {
    that._canvas = new Canvas();
    that._converters = new Converters();
    that._pointInfo = PointInfo({ hook: $('#pointinfo-container') });

    return Data.Bounds.get()
      .then(function (bounds) {
        that._converters.setDataBounds(bounds);
        that._viewController = ViewController(that._canvas, that._converters);
        that._viewController.$
          .on('pointClicked', function (event, dot) { showDetails(dot); });
        that._selectionMenu = SelectionMenu({ hook: $('#selections-container') });
        that._selectionMenu.$
          .on('toggle', function (event, name) { toggleSelection(name); })
          .on('toggleUnselected', function () { toggleUnselectedPoints(); })
          .on('remove', function (event, name) { removeSelection(name); })
          .on('color', function (event, name, color) { changeSelectionColor(name, color); })
          .on('colorUnselected', function (event, color) { changeUnselectedPointsColor(color); });
        that._search = Search({ hook: $('#search-container') });
        that._search.$
          .on('categorySelected', function (event, name) { addCategorySelection(name); })
          .on('pointSelected', function (event, name) { addPointSelection(name); });
      });
  };
};

module.exports = Wikimap;