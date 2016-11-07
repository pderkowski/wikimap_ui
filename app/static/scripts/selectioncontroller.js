var SelectionList = require('./controls/selectionlist');
var SelectionListItem = require('./controls/selectionlistitem');

var SelectionController = function (wikimap, colors) {
  var that = this;

  var list = new SelectionList(document.getElementById("selections-container"), colors.getValues());
  var unselectedPointsLabel = "Unselected points";
  list.addItem(unselectedPointsLabel, createUnselectedPointsSelectionItem());


  this.add = function (name, color) {
    if (!list.hasItem(name)) {
      list.addItem(name, createCategorySelectionItem(name, color));
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

  function createCategorySelectionItem(name, color) {
    var item = new SelectionListItem(name, color);
    item.visibilityButton.addHandler(function () { wikimap.toggleCategory(name); });
    item.closeButton.addHandler(function () { wikimap.removeCategory(name); });
    item.colorButton.addHandler(function () {
      list.showPaletteAt(name);
      list.palette.setHandler(function (selectedColor) {
        wikimap.changeCategoryColor(name, selectedColor);
      });
    });
    return item;
  }

  function createUnselectedPointsSelectionItem() {
    var item = new SelectionListItem("<i>"+unselectedPointsLabel+"</i>", colors.getDefault());
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