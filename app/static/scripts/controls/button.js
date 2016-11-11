var Button = function (icon) {
  var that = this;

  this._enabled = true;

  var div = document.createElement('div');
  var html = '<button type=button  class="my button">';
  html += icon;
  html += "</button>";

  div.innerHTML = html;

  this._element = div.childNodes[0];
  this._element.addEventListener('click', function () { if (that._enabled && that._handler) { that._handler(this); } });
};

Button.prototype.getElement = function () {
  return this._element;
};

Button.prototype.addHandler = function (handler) {
  this._handler = handler;
};

Button.prototype.changeColor = function (color) {
  var icon = this._element.getElementsByClassName("icon")[0];
  icon.style.fill = color;
};

Button.prototype.addClass = function (className) {
  this._element.classList.add(className);
};

Button.prototype.removeClass = function (className) {
  this._element.classList.remove(className);
};

Button.prototype.disable = function () {
  if (this._enabled) {
    this._enabled = false;
    this.addClass("deactivated");
  }
};

Button.prototype.enable = function () {
  if (!this._enabled) {
    this._enabled = true;
    this.removeClass("deactivated");
  }
};


module.exports = Button;