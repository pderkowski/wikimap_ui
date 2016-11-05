var d3 = require('d3');
var d3tip = require('d3-tip');

var Canvas = function () {
  var that = this;

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

  // function getFrameSize() {
  //   var realSize = getRealSize();
  //   return [realSize[0] - 1, realSize[1] - 1];
  // }

  // var getVirtualSize = getRealSize;

  // var hackScale = 8;

  // function getVirtualSize() {
  //   var realSize = getRealSize();
  //   return [hackScale * realSize[0], hackScale * realSize[1]];
  // }

  // var hackSvg = svg.append("g")
  //   .attr("id", "hackScale")
  //   .attr("transform", "scale(" + (1/hackScale) + ")");

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
      .classed("canvas-background", true)
      .attr("x", 0.5)
      .attr("y", 0.5)
      .attr("width", getContainerSize()[0] - 1)
      .attr("height", getContainerSize()[1] - 1);
  }

  function attachActiveAreaTo(selection) {
    return selection.append("g")
      .classed("canvas-active-area", true);
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

  // var zoomArea = attachZoomArea();

  // function attachZoomArea(selection) {
  //   return selection.append("rect")
  //     .classed("canvas-zoom-area", true)
  //     .attr("width", getVirtualSize()[0])
  //     .attr("height", getVirtualSize()[1]);
  // }

  this.container = d3.select("#canvas-container");
    this.content = attachContentTo(this.container);
      this.frame = attachFrameTo(this.content);
      this.activeArea = attachActiveAreaTo(this.content);
        this.dots = attachDotsTo(this.activeArea);
        this.labels = attachLabelsTo(this.activeArea);
        this.tip = attachTipTo(this.activeArea);

  this.stretchToFit = function () {
    d3.select(".canvas-frame")
      .attr("width", getContainerSize()[0] - 1)
      .attr("height", getContainerSize()[1] - 1);

    d3.select(".canvas-content")
      .attr("width", getContainerSize()[0])
      .attr("height", getContainerSize()[1]);
  };

  this.getSize = getContentSize;
};

module.exports = Canvas;

