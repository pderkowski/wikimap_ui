var Canvas = require('./canvas');
var Converters = require('./converters');
var Data = require('./data');
var ViewController = require('./viewcontroller');
var Search = require('./search');
var PointInfo = require('controls/pointinfo');
var SelectionMenu = require('controls/selectionmenu')

var Wikimap = function () {
  var that = this;

  this.interface = {
    addCategorySelection: function (name) {
      var color = Data.Colors.pick();
      that._viewController.addCategorySelection(name, color);
      that._selectionMenu.add(name, color);
    },

    addPointSelection: function (name) {
      var color = Data.Colors.pick();
      that._viewController.addPointSelection(name, color);
      that._selectionMenu.add(name, color);
      that._viewController.centerOn(name);
    },

    removeSelection: function (name) {
      that._viewController.removeSelection(name);
      that._selectionMenu.remove(name);
    },

    toggleSelection: function (name) {
      if (that._viewController.hasSelection(name)) {
        that._viewController.hideSelection(name);
      } else {
        that._viewController.showSelection(name);
      }
    },

    changeSelectionColor: function (name, color) {
      that._viewController.changeSelectionColor(name, color);
    },

    changeUnselectedPointsColor: function (color) {
      that._viewController.changeUnselectedPointsColor(color);
    },

    toggleUnselectedPoints: function () {
      if (that._viewController.hasUnselectedPoints()) {
        that._viewController.hideUnselectedPoints();
      } else {
        that._viewController.showUnselectedPoints();
      }
    },

    showDetails: function (dot) {
      Data.Details.get(dot.title)
        .then(function (details) {
          that._pointInfo.setData(details);
          that._pointInfo.show();
        });
    },

    hideDetails: function () {
      that._pointInfo.hide();
    },
  };

  this.start = function () {
    that._canvas = new Canvas();
    that._converters = new Converters();
    that._pointInfo = PointInfo({ hook: $('#pointinfo-container') });

    return Data.Bounds.get()
      .then(function (bounds) {
        that._converters.setDataBounds(bounds);
        that._viewController = new ViewController(that._canvas, that._converters, that.interface);
        that._selectionMenu = SelectionMenu({ hook: $('#selections-container') });
        that._selectionMenu.$
          .on('toggle', function (event, name) { that.interface.toggleSelection(name); })
          .on('toggleUnselected', function () { that.interface.toggleUnselectedPoints(); })
          .on('remove', function (event, name) { that.interface.removeSelection(name); })
          .on('color', function (event, name, color) { that.interface.changeSelectionColor(name, color); })
          .on('colorUnselected', function (event, color) { that.interface.changeUnselectedPointsColor(color); });
        Search(that.interface);
      });
  };
};

module.exports = Wikimap;