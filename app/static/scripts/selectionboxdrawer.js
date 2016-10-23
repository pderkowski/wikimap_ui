function createButton (iconName, handler) {
  var div = document.createElement('div');

  var html = '<button type=button class="selections-button selection-visible">';
  html += '<span class="octicon ' + iconName + '"></span>';
  html += "</button>";

  div.innerHTML = html;

  var button = div.childNodes[0];
  button.addEventListener('click', handler);
  return button;
};

var SelectionNode = function (name) {
  var that = this;

  this.name = name;
  this._visible = true;

  this._node = document.createElement("li");
  this._text = document.createTextNode(name);
  this._closeButton = createButton("octicon-x", function () { that._fire("close"); });
  this._visibilityButton = createButton("octicon-eye", function () { if (that._visible) { that._fire("hide"); } else { that._fire("show"); } });

  this._events = Object.create(null);

  this._node.appendChild(this._text);
  this._node.appendChild(this._closeButton);
  this._node.appendChild(this._visibilityButton);

  setTimeout(function() {
    that._node.classList.add("show");
  }, 10);
};

SelectionNode.prototype.getElement = function () {
  return this._node;
};

SelectionNode.prototype.hide = function () {
  this._visible = false;
  this._visibilityButton.classList.remove("selection-visible");
  this._visibilityButton.classList.add("selection-hidden");
};

SelectionNode.prototype.show = function () {
  this._visible = true;
  this._visibilityButton.classList.remove("selection-hidden");
  this._visibilityButton.classList.add("selection-visible");
};

SelectionNode.prototype.bind = function (eventName, callback) {
  this._events[eventName] = callback;
};

SelectionNode.prototype._fire = function (eventName) {
  if (eventName in this._events) {
    this._events[eventName]();
  }
};



var SelectionBoxDrawer = function (wikimap) {
  var that = this;

  var nodes = [];

  this.add = function (name) {
    if (getIndex(name) < 0){
      var node = createSelectionNode(name);
      nodes.push(node);
      var list = document.getElementById('selections-list');
      list.appendChild(node.getElement());
    }
  };

  this.remove = function (name) {
    var index = getIndex(name);
    if (index >= 0) {
      var node = nodes[index];
      nodes.splice(index, 1);
      var list = document.getElementById('selections-list');
      list.removeChild(node.getElement());
    }
  };

  this.hide = function (name) {
    var index = getIndex(name);
    if (index >= 0) {
      nodes[index].hide();
    }
  };

  this.show = function (name) {
    var index = getIndex(name);
    if (index >= 0) {
      nodes[index].show();
    }
  }

  function getIndex(name) {
    return nodes.map(function (n) { return n.name; }).indexOf(name);
  }

  function createSelectionNode(name) {
    var node = new SelectionNode(name);
    node.bind("close", function () { wikimap.removeCategory(name); });
    node.bind("hide", function () { wikimap.hideCategory(name); });
    node.bind("show", function () { wikimap.showCategory(name); });
    return node;
  }
};

module.exports = SelectionBoxDrawer;