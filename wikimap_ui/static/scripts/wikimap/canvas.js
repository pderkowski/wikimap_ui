var d3 = require('d3');
var d3tip = require('d3-tip');

var Canvas = function () {
  var that = this;
  this.$ = $(this);

  function getContainerSize() {
    var w = that.container.offsetWidth;
    var h = that.container.offsetHeight;
    return [+w, +h];
  }

  function getContentSize() {
    var w = that.d3content.attr("width");
    var h = that.d3content.attr("height");
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
    var baseFontSize = 10;
    return selection.append("g")
      .classed("canvas-labels", true)
      .style("font-size", that.fontSize+"px");
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

  this.container = document.getElementById('canvas-container');

  this.d3container = d3.select("#canvas-container");
  this.d3content = attachContentTo(this.d3container);
  this.d3dots = attachDotsTo(this.d3content);
  this.d3labels = attachLabelsTo(this.d3content);
  this.d3tip = attachTipTo(this.d3content);
  this.d3frame = attachFrameTo(this.d3content);

  this.content = document.getElementsByClassName('canvas-content')[0];
  this.dots = document.getElementsByClassName('canvas-dots')[0];
  this.labels = document.getElementsByClassName('canvas-labels')[0];

  this.fontSize = parseInt($(this.labels).css('font-size'));
  this.fontFamily = $(this.labels).css('font-family');

  this.d3dots
    .on("click", function (p) {
      if (d3.event.defaultPrevented) return;
      var selection = d3.select(d3.event.target); // we listen on a group of dots, this gets the specific dot
      that.$.trigger('pointClicked', [selection.datum()]);
    });

  this.stretchToFit = function () {
    that.d3frame
      .attr("width", getContainerSize()[0] - 1)
      .attr("height", getContainerSize()[1] - 1);

    that.d3content
      .attr("width", getContainerSize()[0])
      .attr("height", getContainerSize()[1]);
  };

  this.getSize = getContentSize;
  this.getCenter = function () {
    return [getContentSize[0] / 2, getContentSize[1] / 2];
  };

  return this;
};

module.exports = Canvas;

