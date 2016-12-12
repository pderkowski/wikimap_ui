var SelectionList = require('./controls/selectionlist');
var SelectionListItem = require('./controls/selectionlistitem');
var Data = require('./data');

var SelectionController = function (wikimap) {
  var that = this;

  var list = new SelectionList(document.getElementById("selections-container"));
  var unselectedPointsLabel = "Unselected points";
  list.addItem(unselectedPointsLabel, createUnselectedPointsSelectionItem());


  this.add = function (name, color) {
    if (!list.hasItem(name)) {
      list.addItem(name, createSelectionItem(name, color));
    }
  };

  this.remove = function (name) {
    if (list.hasItem(name)) {
      list.removeItem(name);
    }
  };

  this.hide = function (name) {
    if (list.hasItem(name)) {
      list.getItem(name).hide();
    }
  };

  this.show = function (name) {
    if (list.hasItem(name)) {
      list.getItem(name).show();
    }
  };

  this.changeColor = function (name, color) {
    if (list.hasItem(name)) {
      list.getItem(name).changeColor(color);
    }
  };

  this.changeUnselectedPointsColor = function (color) {
    that.changeColor(unselectedPointsLabel, color);
  };

  this.showUnselectedPoints = function () {
    list.getItem(unselectedPointsLabel).show();
  };

  this.hideUnselectedPoints = function () {
    list.getItem(unselectedPointsLabel).hide();
  };

  function createSelectionItem(name, color) {
    var item = new SelectionListItem(name, color);
    item.visibilityButton.addHandler(function () { wikimap.toggleSelection(name); });
    item.closeButton.addHandler(function () { wikimap.removeSelection(name); });
    item.colorButton.addHandler(function () {
      list.showPaletteAt(name);
      list.palette.setHandler(function (selectedColor) {
        wikimap.changeSelectionColor(name, selectedColor);
      });
    });
    return item;
  }

  function createUnselectedPointsSelectionItem() {
    var item = new SelectionListItem("<i>"+unselectedPointsLabel+"</i>", Data.Colors.getDefault());
    item.colorButton.addHandler(function () {
      list.showPaletteAt(unselectedPointsLabel);
      list.palette.setHandler(function (selectedColor) {
        wikimap.changeUnselectedPointsColor(selectedColor);
      });
    });
    item.visibilityButton.addHandler(function () { wikimap.toggleUnselectedPoints(); });
    item.closeButton.disable();
    return item;
  }
};

module.exports = SelectionController;