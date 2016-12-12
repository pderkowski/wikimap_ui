var ColorPalette = require('./colorpalette');
var Data = require('../data');

/* From Modernizr */
var transitionEvent = (function () {
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }

  for(t in transitions){
    if(el.style[t] !== undefined ){
      return transitions[t];
    }
  }
})();

var List = function (parent) {
  this._node = createNode();

  this._names = [];
  this._items = [];

  function createNode() {
    var node = document.createElement("ul");
    node.className = "my rounded animated list with-shadow";
    parent.appendChild(node);
    return node;
  }
};

List.prototype.node = function () {
  return this._node;
};

List.prototype.addItem = function (name, item) {
  this._names.push(name);
  this._items.push(item);

  this._node.appendChild(item.node());
};

List.prototype.removeItem = function (name) {
  this._removeItemAfterTransition(name); // register end-of-transition listener

  var item = this.getItem(name).node();
  item.classList.add("hide");
  item.classList.remove("show"); // start transition
};

List.prototype.hasItem = function (name) {
  return this._getIndex(name) >= 0;
};

List.prototype.getItem = function (name) {
  return this._items[this._getIndex(name)];
};

List.prototype._getIndex = function (name) {
  return this._names.indexOf(name);
};

List.prototype._removeItemAfterTransition = function (name) {
  var that = this;

  var item = this.getItem(name).node();
  item.addEventListener(transitionEvent, function () {
    item.removeEventListener(transitionEvent, arguments.callee);

    that._node.removeChild(item);

    var index = that._getIndex(name);
    that._names.splice(index, 1);
    that._items.splice(index, 1);
  });
};

var SelectionList = function (parent) {
  var that = this;

  List.call(this, parent);

  this.palette = new ColorPalette(document.getElementById("palette"), Data.Colors.getValues(), 4);
};

SelectionList.prototype = Object.create(List.prototype);
SelectionList.prototype.constructor = SelectionList;

SelectionList.prototype.showPaletteAt = function (name) {
  this.palette.show({
    my: "left bottom",
    at: "right+4 bottom+1",
    of: this.getItem(name).node(),
  });
}


module.exports = SelectionList;