var Canvas = require('./canvas');
var Converters = require('./converters');
var Data = require('./data');
var View = require('./view');
var ViewController = require('./viewcontroller');
var SelectionController = require('./selectioncontroller');
var Search = require('./search');
var Colors = require('./colors');
var PointInfo = require('components/pointinfo');

var Wikimap = function () {
  var that = this;

  var interface = {
    addCategorySelection: function (name) {
      var color = that._colors.pick();
      that._view.addCategorySelection(name, color);
      that._selectionMenu.add(name, color);
    },

    addPointSelection: function (name) {
      var color = that._colors.pick();
      that._view.addPointSelection(name, color);
      that._selectionMenu.add(name, color);
    },

    removeSelection: function (name) {
      that._view.removeSelection(name);
      that._selectionMenu.remove(name);
    },

    toggleSelection: function (name) {
      if (that._view.hasSelection(name)) {
        that._view.hideSelection(name);
        that._selectionMenu.hide(name);
      } else {
        that._view.showSelection(name);
        that._selectionMenu.show(name);
      }
    },

    changeSelectionColor: function (name, color) {
      that._view.changeSelectionColor(name, color);
      that._selectionMenu.changeColor(name, color);
    },

    changeUnselectedPointsColor: function (color) {
      that._view.changeUnselectedPointsColor(color);
      that._selectionMenu.changeUnselectedPointsColor(color);
    },

    toggleUnselectedPoints: function () {
      if (that._view.hasUnselectedPoints()) {
        that._view.hideUnselectedPoints();
        that._selectionMenu.hideUnselectedPoints();
      } else {
        that._view.showUnselectedPoints();
        that._selectionMenu.showUnselectedPoints();
      }
    },

    showDetails: function (dot) {
      that._pointInfo.title = dot.title;
      that._pointInfo.show = true;
    },

    hideDetails: function () {
      that._pointInfo.show = false;
    }
  };

  this.start = function () {
    that._colors = new Colors();
    that._canvas = new Canvas();
    that._converters = new Converters();
    that._pointInfo = new PointInfo({ el: '#pointinfo-container' });

    return Data.Bounds.get()
      .then(function (bounds) {
        that._converters.setDataBounds(bounds);
        that._view = new View(that._canvas, that._converters, that._colors.getDefault());
        that._viewController = new ViewController(that._canvas, that._converters, that._view, interface);
        that._selectionMenu = new SelectionController(interface, that._colors);
        Search(interface);
      });
  };
};

module.exports = Wikimap;