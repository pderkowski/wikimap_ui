var Canvas = require('./canvas');
var Converters = require('./converters');
var Data = require('./data');
var View = require('./view');
var ViewController = require('./viewcontroller');
var SelectionBoxDrawer = require('./selectionboxdrawer');
var Search = require('./search');

var Wikimap = function () {
  var that = this;

  var interface = {
    addCategory: function (name) {
      var color = '#' + Math.floor(Math.random()*16777215).toString(16);
      that._view.addCategory(name, color);
      that._selections.add(name, color);
    },

    removeCategory: function (name) {
      that._view.removeCategory(name);
      that._selections.remove(name);
    },

    hideCategory: function (name) {
      that._view.hideCategory(name);
      that._selections.hide(name);
    },

    showCategory: function (name) {
      that._view.showCategory(name);
      that._selections.show(name);
    },

    changeCategoryColor: function (name, color) {
      that._view.changeCategoryColor(name, color);
      that._selections.changeColor(name, color);
    },
  };

  this.start = function () {
    that._canvas = new Canvas();
    that._converters = new Converters();
    that._data = new Data(that._converters);

    return that._data.init()
      .then(function () {
        that._view = new View(that._canvas, that._converters, that._data);
        that._viewController = new ViewController(that._canvas, that._converters, that._view);
        that._selections = new SelectionBoxDrawer(interface);
        Search(interface);
      });
  };
};

module.exports = Wikimap;