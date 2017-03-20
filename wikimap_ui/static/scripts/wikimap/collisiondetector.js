var d3 = require('d3');

var QCollisionDetector = function () {
  this._maxRectSize = [0, 0];
  this._qtree = createQuadtree();

  function createQuadtree() {
    return d3.quadtree()
      .x(function (rect) { return rect.cx; })
      .y(function (rect) { return rect.cy; });
  }
};

QCollisionDetector.prototype.add = function (rect) {
  this._maxRectSize = [Math.max(this._maxRectSize[0], rect[0]), Math.max(this._maxRectSize[1], rect[1])];
  this._qtree.add(rect);
};

QCollisionDetector.prototype.isColliding = function (rect) {
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

// bounds - [[x1, y1], [x2, y2]]
// bucketSize - [x, y]
// IMPORTANT ASSUMPTION: all rects are smaller than the bucket
var BCollisionDetector = function (bounds, bucketSize) {
  this._bounds = bounds;
  this._bucketSize = bucketSize;
  this._buckets = createBuckets(bounds, bucketSize);

  function createBuckets(bounds, bucketSize) {
    var bWidth = bucketSize[0];
    var bHeight = bucketSize[1];
    var xSpan = bounds[1][0] - bounds[0][0];
    var ySpan = bounds[1][1] - bounds[0][1];
    var cols = Math.ceil(xSpan / bWidth);
    var rows = Math.ceil(ySpan / bHeight);
    var buckets = [];
    while(rows--) buckets[rows] = createRow(cols);
    return buckets;
  }

  function createRow(cols) {
    row = [];
    while(cols--) row[cols] = [];
    return row;
  }
};

BCollisionDetector.prototype._getIndex = function (x, y) {
  var xIdx = Math.floor((x - this._bounds[0][0]) / this._bucketSize[0]);
  var yIdx = Math.floor((y - this._bounds[0][1]) / this._bucketSize[1]);
  return [xIdx, yIdx];
};

BCollisionDetector.prototype._addToBucket = function(bucket, rect) {
  this._buckets[bucket[1]][bucket[0]].push(rect);
};

BCollisionDetector.prototype._getCornerIndices = function (rect) {
  var x1 = rect.cx - rect.width / 2;
  var x2 = rect.cx + rect.width / 2;
  var y1 = rect.cy - rect.height / 2;
  var y2 = rect.cy + rect.height / 2;
  return [this._getIndex(x1, y1), this._getIndex(x2, y1), this._getIndex(x2, y2), this._getIndex(x1, y2)];
};

BCollisionDetector.prototype._bucketExists = function (bucket) {
  var rows = this._buckets.length;
  var cols = this._buckets[0].length;
  return 0 <= bucket[1] && bucket[1] < rows && 0 <= bucket[0] && bucket[0] < cols;
};

BCollisionDetector.prototype.add = function (rect) {
  var cornerIndices = this._getCornerIndices(rect);
  var tl = cornerIndices[0], tr = cornerIndices[1], br = cornerIndices[2], bl = cornerIndices[3];
  if (this._bucketExists(tl)) this._addToBucket(tl, rect);
  if (tr != tl && this._bucketExists(tr)) { this._addToBucket(tr, rect); }
  if (br != tr && this._bucketExists(br)) { this._addToBucket(br, rect); }
  if (bl != tl && bl != br && this._bucketExists(bl)) { this._addToBucket(bl, rect); }
};

BCollisionDetector.prototype.isColliding = function (rect) {
  var cornerIndices = this._getCornerIndices(rect);
  var tl = cornerIndices[0], tr = cornerIndices[1], br = cornerIndices[2], bl = cornerIndices[3];
  return this._isCollidingInBucket(tl, rect)
    || (tr != tl && this._isCollidingInBucket(tr, rect))
    || (br != tr && this._isCollidingInBucket(br, rect))
    || (bl != tl && bl != br && this._isCollidingInBucket(br, rect));
};

BCollisionDetector.prototype._isCollidingInBucket = function (bucket, rect1) {
  return this._buckets[bucket[1]][bucket[0]].some(function (rect2) {
    return Math.abs(rect1.cx - rect2.cx) <= (rect1.width + rect2.width) / 2
        && Math.abs(rect1.cy - rect2.cy) <= (rect1.height + rect2.height) / 2;
  });
};

// unbounded version
// bucketSize - [x, y]
// IMPORTANT ASSUMPTION: all rects are smaller than the bucket
var UBCollisionDetector = function (bucketSize) {
  this._bucketSize = bucketSize;
  this._buckets = Object.create(null);
};

UBCollisionDetector.prototype._getIndex = function (x, y) {
  var xIdx = Math.floor(x / this._bucketSize[0]);
  var yIdx = Math.floor(y / this._bucketSize[1]);
  return [xIdx, yIdx];
};

UBCollisionDetector.prototype._addToBucket = function(bucket, rect) {
  this._getBucket(bucket).push(rect);
};

UBCollisionDetector.prototype._getBucket = function(bucket) {
  var row = (this._buckets[bucket[1]] = this._buckets[bucket[1]] || Object.create(null));
  return (row[bucket[0]] = row[bucket[0]] || []);
};

UBCollisionDetector.prototype._getCornerIndices = function (rect) {
  var x1 = rect.cx - rect.width / 2;
  var x2 = rect.cx + rect.width / 2;
  var y1 = rect.cy - rect.height / 2;
  var y2 = rect.cy + rect.height / 2;
  return [this._getIndex(x1, y1), this._getIndex(x2, y1), this._getIndex(x2, y2), this._getIndex(x1, y2)];
};

UBCollisionDetector.prototype.add = function (rect) {
  var cornerIndices = this._getCornerIndices(rect);
  var tl = cornerIndices[0], tr = cornerIndices[1], br = cornerIndices[2], bl = cornerIndices[3];
  this._addToBucket(tl, rect);
  if (tr != tl) { this._addToBucket(tr, rect); }
  if (br != tr) { this._addToBucket(br, rect); }
  if (bl != tl && bl != br) { this._addToBucket(bl, rect); }
};

UBCollisionDetector.prototype.isColliding = function (rect) {
  var cornerIndices = this._getCornerIndices(rect);
  var tl = cornerIndices[0], tr = cornerIndices[1], br = cornerIndices[2], bl = cornerIndices[3];
  return this._isCollidingInBucket(tl, rect)
    || (tr != tl && this._isCollidingInBucket(tr, rect))
    || (br != tr && this._isCollidingInBucket(br, rect))
    || (bl != tl && bl != br && this._isCollidingInBucket(br, rect));
};

UBCollisionDetector.prototype._isCollidingInBucket = function (bucket, rect1) {
  return this._getBucket(bucket).some(function (rect2) {
    return Math.abs(rect1.cx - rect2.cx) <= (rect1.width + rect2.width) / 2
        && Math.abs(rect1.cy - rect2.cy) <= (rect1.height + rect2.height) / 2;
  });
};

module.exports.QCollisionDetector = QCollisionDetector;
module.exports.BCollisionDetector = BCollisionDetector;
module.exports.UBCollisionDetector = UBCollisionDetector;
