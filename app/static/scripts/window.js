var Window = function () {
  var that = this;
  that.$ = $(that);

  bindResizeHandlerTo(window, function () { that.$.trigger('resize'); });

  function bindResizeHandlerTo(element, handler) {
    function resizeThrottler() {
      var that = this;
      // ignore resize events as long as an actualResizeHandler execution is in the queue
      if (!this.resizeTimeout) {
        this.resizeTimeout = setTimeout(function() {
          that.resizeTimeout = null;
          handler();
         }, 66); // The actualResizeHandler will execute at a rate of 15fps
      }
    }

    element.addEventListener("resize", resizeThrottler, false);
  }

  return that;
};

module.exports = Window;
