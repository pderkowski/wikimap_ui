var Leaf = function (klass) {
  return {
    isLeaf: true,
    klass: klass
  };
};

// classMap maps arbitrary strings to either:
// - leaf: then the mapping's value is a real CSS class
// - list: then it contains names that are mapped recursively
// This allows for creating an alias for a potentially long list of classes.
var classMap = Object.create(null);
classMap['table'] = Leaf('my table');
classMap['palette'] = Leaf('my rounded hidden shaded colorpalette with-bottom-arrow');
classMap['palette-row'] = Leaf('my colorpalette-row');
classMap['colorpicker'] = Leaf('my colorpicker');
classMap['pointinfo'] = Leaf('my hidden rounded shaded panel in-top-right-corner');
classMap['clearfix'] = Leaf('clearfix');
classMap['menu-item'] = [Leaf('my list-item'), 'clearfix'];
classMap['item-label'] = Leaf('my item-label');
classMap['button-container'] = [Leaf('my button-container'), 'clearfix'];
classMap['selection-menu'] = [Leaf('my rounded shaded list in-bottom-left-corner'), 'clearfix'];
classMap['tabs'] = Leaf('my tabs');
classMap['tab-list'] = Leaf('nav nav-tabs');
classMap['tab-content'] = Leaf('tab-content');
classMap['tab-pane'] = Leaf('tab-pane');
classMap['button'] = Leaf('my button');

var maxDepth = 10; // prevent accidental infinite recursions

var Class = function (klass) {
  if (!(typeof klass == 'string')) {
    console.error('Class name is not a string.');
    return "";
  } else {
    return resolve(klass, 0);
  }
};

function resolve(klass, depth) {
  var children = classMap[klass];

  if (children.isLeaf) {
    return children.klass;
  } else if (isTooDeep(klass, depth) || isUnrecognized(klass)) {
    return klass;
  } else {
    var leafs = children.filter(function (child) { return child.isLeaf; });
    var inner = children.filter(function (child) { return !child.isLeaf; });
    return getClassesFromLeafs(leafs)+' '+getClassesFromInnerNodes(inner, depth);
  }
}

function isTooDeep(klass, depth) {
  if (depth > maxDepth) {
    console.warn('Class structure is too deep at "'+klass+'".');
  }
  return depth > maxDepth;
}

function isUnrecognized(klass) {
  var res = (typeof classMap[klass] == 'undefined');
  if (res) {
    console.warn('Using unrecognized class: "'+klass+'". Check for typos or update class.js file.');
  }
  return res;
}

function getClassesFromLeafs(leafs) {
  return leafs
    .map(function (child) { return child.klass; })
    .join(' ');
}

function getClassesFromInnerNodes(innerNodes, depth) {
  return innerNodes
    .filter(function(item, pos) { return innerNodes.indexOf(item) == pos; }) // filter duplicate elements
    .map(function (child) { return resolve(child, depth+1); }) // resolve recursively
    .join(' '); // merge results to a single string
}

module.exports = Class;
