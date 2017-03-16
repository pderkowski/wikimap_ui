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
classMap['table'] = Leaf('my table-container with-custom-columns');
classMap['table-header'] = Leaf('my table-header');
classMap['table-cell'] = Leaf('my borderless table-cell');
classMap['first-column'] = Leaf('my expanding with-ellipsis');
classMap['last-column'] = Leaf('my shrinking');
classMap['colorpicker'] = Leaf('my white-background borderless dark-grey colorpicker');
classMap['palette'] = Leaf('my rounded hidden shaded white-background colorpalette with-bottom-arrow');
classMap['palette-row'] = Leaf('my colorpalette-row');
classMap['pointinfo'] = Leaf('my hidden rounded shaded white-background quite-wide panel in-top-right-corner');
classMap['pointinfo-header'] = Leaf('my light-grey-background pointinfo-header with-big bold font');
classMap['pointinfo-content'] = Leaf('my pointinfo-content with-quite-small font');
classMap['selection-menu'] = [Leaf('my rounded shaded white-background normal-width list in-bottom-left-corner'), 'clearfix'];
classMap['menu-item'] = [Leaf('my list-item dark-grey font with-text-shadow'), 'clearfix'];
classMap['item-label'] = Leaf('my item-label with-ellipsis');
classMap['button-container'] = [Leaf('my floating-right button-container'), 'clearfix'];
classMap['button'] = Leaf('my white-background borderless dark-grey button');
classMap['tabs'] = Leaf('my tabs');
classMap['tab-list'] = Leaf('my tab-list nav nav-tabs nav-justified');
classMap['tab-content'] = Leaf('my tab-content');
classMap['tab-pane'] = Leaf('my tab-pane');
classMap['clearfix'] = Leaf('my clearfix');
classMap['button-group'] = Leaf('my btn-group btn-group-justified');
classMap['button-grouped'] = Leaf('my btn btn-default');
classMap['search-menu'] = Leaf('my rounded shaded white-background normal-width search-menu');
classMap['search-menu-item'] = Leaf('my borderless transparent-background search-menu-item');
classMap['search-menu-content'] = Leaf('my animated borderless transparent-background search-menu-content normal global font with-text-shadow');
classMap['search-group-separator'] = Leaf('my light-grey-background search-group-separator normal bold global font');
classMap['search-box'] = Leaf('my rounded shaded white-background normal-width search-box in-top-left-corner bold global font with-text-shadow');
classMap['search-label'] = Leaf('my transparent-background item-label with-ellipsis normal global font');
classMap['search-description'] = Leaf('my transparent-background floating-right search-description with-quite-small italic global font');
classMap['panel-group'] = Leaf('my panel-group');
classMap['panel-heading'] = Leaf('my clickable panel-heading');
classMap['panel-title'] = Leaf('my panel-title with-normal font');
classMap['panel-body'] = Leaf('my panel-body');


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
