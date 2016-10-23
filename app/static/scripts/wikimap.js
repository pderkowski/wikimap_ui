var $ = require('jquery');
var d3 = require('d3');
var elementResizeDetectorMaker = require('element-resize-detector');
var Renderer = require('./renderer');
var CoordsConverter = require('./coordsconverter');
var TileDrawer = require('./tiledrawer');
var CategoryDrawer = require('./categorydrawer');
var SelectionBoxDrawer = require('./selectionboxdrawer');

function getRealSize () {
  var displayWidth = document.getElementById('container').offsetWidth;
  var displayHeight = document.getElementById('container').offsetHeight;
  return [displayWidth, displayHeight];
}

function getFrameSize() {
  var realSize = getRealSize();
  return [realSize[0] - 1, realSize[1] - 1];
}

function getVirtualSize(hackScale) {
  var realSize = getRealSize();
  return [hackScale * realSize[0], hackScale * realSize[1]];
}


var Wikimap = function () {
  var that = this;

  var hackScale = 8;

  var svg = d3.select("#container")
    .append("svg")
    .classed("svg-content", true);

  svg.append("rect")
    .classed("frame", true)
    .classed("frame-size", true)
    .classed("background", true)
    .attr("x", 0.5)
    .attr("y", 0.5)
    .attr("width", getFrameSize()[0])
    .attr("height", getFrameSize()[1]);

  var hackSvg = svg.append("g")
    .attr("id", "hackScale")
    .attr("transform", "scale(" + (1/hackScale) + ")");

  var zoomCapture = hackSvg.append("rect")
    .classed("zoom-capture", true)
    .classed("virtual-size", true)
    .attr("width", getVirtualSize(hackScale)[0])
    .attr("height", getVirtualSize(hackScale)[1]);

  var converter = new CoordsConverter();
  var renderer = new Renderer(hackSvg, converter, hackScale);
  var tiles = new TileDrawer(renderer, converter, hackSvg);
  var categories = new CategoryDrawer(renderer);
  var selections = new SelectionBoxDrawer(this);

  this.start = function () {
    return loadBounds()
      .then(function (dataBounds) { tiles.init(getVirtualSize(hackScale), dataBounds); })
      .then(listenToResizeEvents(tiles));
  };

  this.centerOn = function (x, y) {
    tiles.centerOn([x, y]);
  };

  this.selectCategory = function (name) {
    categories.draw(name);
    selections.add(name);
  };

  this.removeCategory = function (name) {
    categories.remove(name);
    selections.remove(name);
  };

  this.hideCategory = function (name) {
    categories.remove(name);
    selections.hide(name);
  };

  this.showCategory = function (name) {
    categories.draw(name);
    selections.show(name);
  }

  function loadBounds() {
    return $.getJSON($SCRIPT_ROOT + 'bounds');
  }

  function listenToResizeEvents(resizable) {
    return function () {
      var erd = elementResizeDetectorMaker({ strategy: "scroll" });
      erd.listenTo(document.getElementById("container"), function () {
        resizable.resize(getVirtualSize(hackScale));

        d3.selectAll(".frame-size")
          .attr("width", getFrameSize()[0])
          .attr("height", getFrameSize()[1]);

        d3.selectAll("rect.virtual-size")
          .attr("width", getVirtualSize(hackScale)[0])
          .attr("height", getVirtualSize(hackScale)[1]);

        resizable.zoom(d3.zoomIdentity);
      });
    };
  }
};

module.exports = Wikimap;