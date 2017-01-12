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
classMap['table'] = Leaf('my table with-custom-columns');
classMap['table-header'] = Leaf('my table-header');
classMap['table-cell'] = Leaf('my table-cell');
classMap['first-column'] = Leaf('my expanding with-ellipsis');
classMap['last-column'] = Leaf('my shrinking');
classMap['colorpicker'] = Leaf('my colorpicker');
classMap['palette'] = Leaf('my rounded hidden shaded colorpalette with-bottom-arrow');
classMap['palette-row'] = Leaf('my colorpalette-row');
classMap['pointinfo'] = Leaf('my hidden rounded shaded quite-wide panel in-top-right-corner');
classMap['pointinfo-header'] = Leaf('my pointinfo-header');
classMap['pointinfo-content'] = Leaf('my pointinfo-content with-quite-small font');
classMap['selection-menu'] = [Leaf('my rounded shaded normal-width list in-bottom-left-corner'), 'clearfix'];
classMap['menu-item'] = [Leaf('my list-item'), 'clearfix'];
classMap['item-label'] = Leaf('my item-label with-ellipsis');
classMap['button-container'] = [Leaf('my button-container'), 'clearfix'];
classMap['button'] = Leaf('my button');
classMap['tabs'] = Leaf('my tabs');
classMap['tab-list'] = Leaf('my tab-list nav nav-tabs nav-justified');
classMap['tab-content'] = Leaf('my tab-content');
classMap['tab-pane'] = Leaf('my tab-pane');
classMap['clearfix'] = Leaf('my clearfix');
classMap['button-group'] = Leaf('my btn-group btn-group-justified');
classMap['button-grouped'] = Leaf('my btn btn-default');
classMap['search'] = Leaf('my rounded shaded normal-width search-box in-top-left-corner with-quite-small bold font');
classMap['search-label'] = Leaf('my search-label with-quite-small font with-ellipsis');
classMap['search-description'] = Leaf('my search-description with-quite-small font');


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
