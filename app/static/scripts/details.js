var DetailsPanel = function () {
  var that = this;

  this.node = $('#details-container');
  this.node.addClass("my rounded animated hidden panel with-shadow in-top-right-corner");

  this.title = this.node.append($('<h>'));
};

DetailsPanel.prototype.node = function () {
  return this.node.node();
};

DetailsPanel.prototype.set = function (data) {
  this.title.text(data.title);
};

DetailsPanel.prototype.hide = function () {
  this.node.addClass("hide");
  this.node.removeClass("show");
};

DetailsPanel.prototype.show = function () {
  this.node.addClass("show");
  this.node.removeClass("hide");
};

module.exports = DetailsPanel;