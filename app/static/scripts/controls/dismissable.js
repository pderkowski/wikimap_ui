var Dismissable = function (that) {
  var locals = {}

  function isTarget(e) {
    return (that.$.is(e.target) // the target of the click is the element...
      || that.$.has(e.target).length !== 0); // ... or a descendant of the element
  };

  function callHide(e) {
    if (!isTarget(e)) { // don't blur if clicked on the palette
      locals.callback();
      $(document).off('mousedown', callHide);
    }
  }

  that.onClickOutside = function (callback) {
    locals.callback = callback;
    $(document).off('mousedown', callHide);
    $(document).on("mousedown", callHide);
  };

  return that;
}

module.exports = Dismissable;
