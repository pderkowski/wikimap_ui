require('bootstrap');

var Class = require('./class');

(function ($) {
  $.fn.classify = function (className) {
    this.addClass(Class(className));
    return this;
  };

  $.fn.addTooltipIfOverflows = function () {
    return this.each(function () {
      var $this = $(this);
      if (this.offsetWidth < this.scrollWidth) {
        $this.attr('title', $this.text());
      }
    });
  }
}(jQuery));