var d3 = require('d3');
var d3tip = require('d3-tip');

var Canvas = function () {
  var that = this;
  this.$ = $(this);

  function getContainerSize() {
    var w = that.container.node().offsetWidth;
    var h = that.container.node().offsetHeight;
    return [+w, +h];
  }

  function getContentSize() {
    var w = that.content.attr("width");
    var h = that.content.attr("height");
    return [+w, +h];
  }

  function attachContentTo(selection) {
    return selection
      .append("svg")
      .classed("canvas-content", true)
      .attr("width", getContainerSize()[0])
      .attr("height", getContainerSize()[1]);
  }

  function attachFrameTo(selection) {
    return selection.append("rect")
      .classed("canvas-frame", true)
      .attr("x", 0.5)
      .attr("y", 0.5)
      .attr("width", getContainerSize()[0] - 1)
      .attr("height", getContainerSize()[1] - 1);
  }

  function attachDotsTo(selection) {
    return selection.append("g")
      .classed("canvas-dots", true);
  }

  function attachLabelsTo(selection) {
    return selection.append("g")
      .classed("canvas-labels", true);
  }

  function attachTipTo(selection) {
    var tip = d3tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(p) {
        return p.title;
      });

    selection.call(tip);
    return tip;
  }

  this.container = d3.select("#canvas-container");
    this.content = attachContentTo(this.container);
      this.dots = attachDotsTo(this.content);
      this.labels = attachLabelsTo(this.content);
      this.tip = attachTipTo(this.content);
      this.frame = attachFrameTo(this.content);

  this.dots
    .on("click", function (p) {
      if (d3.event.defaultPrevented) return;
      var selection = d3.select(d3.event.target); // we listen on a group of dots, this gets the specific dot
      that.$.trigger('pointClicked', [selection.datum()]);
    });

  this.stretchToFit = function () {
    d3.select(".canvas-frame")
      .attr("width", getContainerSize()[0] - 1)
      .attr("height", getContainerSize()[1] - 1);

    d3.select(".canvas-content")
      .attr("width", getContainerSize()[0])
      .attr("height", getContainerSize()[1]);
  };

  this.getSize = getContentSize;

  return this;
};

module.exports = Canvas;

