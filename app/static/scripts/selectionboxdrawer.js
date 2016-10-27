var Button = require('./controls/button');
var Icons = require('./controls/icons');

function createLabel (label) {
  var div = document.createElement('div');
  div.classList.add("selection-label");
  div.innerHTML = label;
  return div;
}

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

var SelectionNode = function (name, color) {
  var that = this;

  this.name = name;
  this._visible = true;

  this._node = document.createElement("li");
  this._text = createLabel(name);
  this._buttons = document.createElement("div"); this._buttons.classList.add("selection-button-container");
  this._closeButton = new Button(Icons.close); this._closeButton.addHandler(function () { that._fire("close") });
  this._visibilityButton = new Button(Icons.eye); this._visibilityButton.addHandler(function () { if (that._visible) { that._fire("hide"); } else { that._fire("show"); } });
  this._colorButton = new Button(Icons.circle); this._colorButton.addHandler(function () { that._fire("color"); });
  this._colorButton.changeColor(color);

  this._events = Object.create(null);

  this._node.appendChild(this._text);
  this._node.appendChild(this._buttons);
  this._buttons.appendChild(this._closeButton.getElement());
  this._buttons.appendChild(this._visibilityButton.getElement());
  this._buttons.appendChild(this._colorButton.getElement());

  setTimeout(function() {
    that._node.classList.add("show");
  }, 10);
};

SelectionNode.prototype.getElement = function () {
  return this._node;
};

SelectionNode.prototype.hide = function () {
  this._visible = false;
  this._visibilityButton.addClass("controls-deactivated");
};

SelectionNode.prototype.show = function () {
  this._visible = true;
  this._visibilityButton.removeClass("controls-deactivated");
};

SelectionNode.prototype.changeColor = function (color) {
  this._colorButton.changeColor(color);
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

  this.add = function (name, color) {
    if (getIndex(name) < 0){
      var node = createSelectionNode(name, color);
      nodes.push(node);
      var list = document.getElementById('selections-list');
      list.appendChild(node.getElement());

      if (nodes.length == 1) {
        list.classList.add("show");
      }
    }
  };

  this.remove = function (name) {
    var index = getIndex(name);
    if (index >= 0) {
      var node = nodes[index].getElement();

      node.addEventListener(transitionEvent, function () {
        node.removeEventListener(transitionEvent, arguments.callee);

        var list = document.getElementById('selections-list');

        list.removeChild(node);

        index = getIndex(name) // index could have changed if some other callback finished during this one
        nodes.splice(index, 1);

        if (nodes.length == 0) {
          list.classList.remove("show");
        }
      });

      node.classList.remove("show");
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
  };

  this.changeColor = function (name, color) {
    var index = getIndex(name);
    if (index >= 0) {
      nodes[index].changeColor(color);
    }
  };

  function getIndex(name) {
    return nodes.map(function (n) { return n.name; }).indexOf(name);
  }

  function createSelectionNode(name, color) {
    var node = new SelectionNode(name, color);
    node.bind("close", function () { wikimap.removeCategory(name); });
    node.bind("hide", function () { wikimap.hideCategory(name); });
    node.bind("show", function () { wikimap.showCategory(name); });
    node.bind("color", function () { wikimap.changeColor(name, "#999"); })
    return node;
  }
};

module.exports = SelectionBoxDrawer;