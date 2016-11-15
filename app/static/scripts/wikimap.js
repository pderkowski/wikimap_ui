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
    addCategory: function (name) {
      var color = that._colors.pick();
      that._view.addCategory(name, color);
      that._selections.add(name, color);
    },

    removeCategory: function (name) {
      that._view.removeCategory(name);
      that._selections.remove(name);
    },

    toggleCategory: function (name) {
      if (that._view.hasCategory(name)) {
        that._view.hideCategory(name);
        that._selections.hide(name);
      } else {
        that._view.showCategory(name);
        that._selections.show(name);
      }
    },

    changeCategoryColor: function (name, color) {
      that._view.changeCategoryColor(name, color);
      that._selections.changeColor(name, color);
    },

    changeUnselectedPointsColor: function (color) {
      that._view.changeUnselectedPointsColor(color);
      that._selections.changeUnselectedPointsColor(color);
    },

    toggleUnselectedPoints: function () {
      if (that._view.hasUnselectedPoints()) {
        that._view.hideUnselectedPoints();
        that._selections.hideUnselectedPoints();
      } else {
        that._view.showUnselectedPoints();
        that._selections.showUnselectedPoints();
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
    that._data = new Data(that._converters);
    that._pointInfo = new PointInfo({ el: '#pointinfo-container' });

    return that._data.init()
      .then(function () {
        that._view = new View(that._canvas, that._converters, that._data, that._colors.getDefault());
        that._viewController = new ViewController(that._canvas, that._converters, that._view, interface);
        that._selections = new SelectionController(interface, that._colors);
        Search(interface);
      });
  };
};

module.exports = Wikimap;