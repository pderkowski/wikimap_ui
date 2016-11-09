var d3 = require('d3');

var CollisionDetector = function (maxRectSize) {
  this._maxRectSize = maxRectSize;
  this._qtree = createQuadtree();

  function createQuadtree() {
    return d3.quadtree()
      .x(function (rect) { return rect.cx; })
      .y(function (rect) { return rect.cy; });
  }
};

CollisionDetector.prototype.add = function (rect) {
  this._qtree.add(rect);
};

CollisionDetector.prototype.remove = function (rect) {
  this._qtree.remove(rect);
};

CollisionDetector.prototype.isColliding = function (rect) {
  var that = this;

  var collisionDetected = false;

  function collide(rect1, rect2) {
    return Math.abs(rect1.cx - rect2.cx) <= (rect1.width + rect2.width) / 2
        && Math.abs(rect1.cy - rect2.cy) <= (rect1.height + rect2.height) / 2;
  }

  function visitNode(node, x0, y0, x1, y1) {
    if (collisionDetected) {
      return true;
    }

    var xMargin = (that._maxRectSize[0] / 2 + rect.width / 2);
    var yMargin = (that._maxRectSize[1] / 2 + rect.height / 2);
    if ( (x0 - rect.cx) > xMargin
      || (y0 - rect.cy) > yMargin
      || (rect.cx - x1) > xMargin
      || (rect.cy - y1) > yMargin) {
      return true; // node is too far, don't visit it
    } else {
      if (!node.length) { // this is a leaf node, check for exact collisions
        for (var n = node; n !== undefined; n = n.next) {
          collisionDetected = collide(rect, n.data);
        }
      }
      return false;
    }
  }

  that._qtree.visit(visitNode);

  return collisionDetected;
};


module.exports = CollisionDetector;