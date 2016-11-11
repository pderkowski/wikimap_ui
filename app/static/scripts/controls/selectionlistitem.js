var Button = require('./button');
var Icons = require('./icons');

function createLabel(label) {
  var div = document.createElement('div');
  div.className = "my label";
  div.innerHTML = label;
  return div;
}

var ListItem = function (label) {
  var that = this;

  this._node = createNode();
  this._label = createLabel(label || "");

  this._node.appendChild(this._label);
  setTimeout(function () {
    that._node.classList.add("show");
  }, 10)

  function createNode() {
    var node = document.createElement("li");
    node.className = "my hidden animated list-item";
    return node;
  }
};

ListItem.prototype.node = function () {
  return this._node;
};

ListItem.prototype.setLabel = function (label) {
  this._label.innerHTML = label;
}

var SelectionListItem = function (label, color) {
  var that = this;

  ListItem.call(this, label);

  this._buttons = document.createElement("div");
  this._buttons.className = "my button-container";

  this.visibilityButton = new Button(Icons.eye);
  this.closeButton = new Button(Icons.close);
  this.colorButton = new Button(Icons.circle);
  this.colorButton.changeColor(color);

  this._node.appendChild(this._buttons);
  this._buttons.appendChild(this.colorButton.getElement());
  this._buttons.appendChild(this.visibilityButton.getElement());
  this._buttons.appendChild(this.closeButton.getElement());
};

SelectionListItem.prototype = Object.create(ListItem.prototype);
SelectionListItem.prototype.constructor = SelectionListItem;

SelectionListItem.prototype.hide = function () {
  this.visibilityButton.addClass("deactivated");
};

SelectionListItem.prototype.show = function () {
  this.visibilityButton.removeClass("deactivated");
};

SelectionListItem.prototype.changeColor = function (color) {
  this.colorButton.changeColor(color);
};

module.exports = SelectionListItem;