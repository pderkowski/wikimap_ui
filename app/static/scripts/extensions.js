require('bootstrap');

var Class = require('./class');

(function ($) {
  $.fn.classify = function (className) {
    this.addClass(Class(className));
    return this;
  };
}(jQuery));