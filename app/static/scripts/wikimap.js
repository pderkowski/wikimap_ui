var Canvas = require('./canvas');
var Converters = require('./converters');
var Data = require('./data');
var ViewController = require('./viewcontroller');
var SelectionController = require('./selectioncontroller');
var Search = require('./search');
var PointInfo = require('components/pointinfo');

var Wikimap = function () {
  var that = this;

  var interface = {
    addCategorySelection: function (name) {
      var color = Data.Colors.pick();
      that._viewController.addCategorySelection(name, color);
      that._selectionController.add(name, color);
    },

    addPointSelection: function (name) {
      var color = Data.Colors.pick();
      that._viewController.addPointSelection(name, color);
      that._selectionController.add(name, color);
      that._viewController.centerOn(name);
    },

    removeSelection: function (name) {
      that._viewController.removeSelection(name);
      that._selectionController.remove(name);
    },

    toggleSelection: function (name) {
      if (that._viewController.hasSelection(name)) {
        that._viewController.hideSelection(name);
        that._selectionController.hide(name);
      } else {
        that._viewController.showSelection(name);
        that._selectionController.show(name);
      }
    },

    changeSelectionColor: function (name, color) {
      that._viewController.changeSelectionColor(name, color);
      that._selectionController.changeColor(name, color);
    },

    changeUnselectedPointsColor: function (color) {
      that._viewController.changeUnselectedPointsColor(color);
      that._selectionController.changeUnselectedPointsColor(color);
    },

    toggleUnselectedPoints: function () {
      if (that._viewController.hasUnselectedPoints()) {
        that._viewController.hideUnselectedPoints();
        that._selectionController.hideUnselectedPoints();
      } else {
        that._viewController.showUnselectedPoints();
        that._selectionController.showUnselectedPoints();
      }
    },

    showDetails: function (dot) {
      that._pointInfo.title = dot.title;
      that._pointInfo.show = true;
    },

    hideDetails: function () {
      that._pointInfo.show = false;
    },
  };

  this.start = function () {
    that._canvas = new Canvas();
    that._converters = new Converters();
    that._pointInfo = new PointInfo({ el: '#pointinfo-container' });

    return Data.Bounds.get()
      .then(function (bounds) {
        that._converters.setDataBounds(bounds);
        that._viewController = new ViewController(that._canvas, that._converters, interface);
        that._selectionController = new SelectionController(interface);
        Search(interface);
      });
  };
};

module.exports = Wikimap;