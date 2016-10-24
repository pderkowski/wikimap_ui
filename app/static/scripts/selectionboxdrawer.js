function createButton (iconClasses, handler) {
  var div = document.createElement('div');

  var html = '<button type=button class="selections-button">';
  html += '<div class="' + iconClasses + '"></div>';
  html += "</button>";

  div.innerHTML = html;

  var button = div.childNodes[0];
  button.addEventListener('click', handler);
  return button;
};

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

var SelectionNode = function (name) {
  var that = this;

  this.name = name;
  this._visible = true;

  this._node = document.createElement("li");
  this._text = createLabel(name);
  this._buttons = document.createElement("div"); this._buttons.classList.add("selection-button-container");
  this._closeButton = createButton("octicon octicon-x selection-icon", function () { that._fire("close"); });
  this._visibilityButton = createButton("octicon octicon-eye selection-icon", function () { if (that._visible) { that._fire("hide"); } else { that._fire("show"); } });
  this._colorButton = createButton("selection-icon selection-color-icon", function () { that._fire("color"); });

  this._events = Object.create(null);

  this._node.appendChild(this._text);
  this._node.appendChild(this._buttons);
  this._buttons.appendChild(this._closeButton);
  this._buttons.appendChild(this._visibilityButton);
  this._buttons.appendChild(this._colorButton);

  setTimeout(function() {
    that._node.classList.add("show");
  }, 10);
};

SelectionNode.prototype.getElement = function () {
  return this._node;
};

SelectionNode.prototype.hide = function () {
  this._visible = false;
  this._visibilityButton.classList.add("selection-hidden");
};

SelectionNode.prototype.show = function () {
  this._visible = true;
  this._visibilityButton.classList.remove("selection-hidden");
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