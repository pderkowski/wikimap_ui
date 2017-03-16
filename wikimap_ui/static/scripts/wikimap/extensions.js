require('bootstrap');
require('jquery-ui/ui/widgets/autocomplete');

var Class = require('./class');

(function ($) {
  $.fn.classify = function (className) {
    this.addClass(Class(className));
    return this;
  };

  $.fn.addTooltipIfOverflows = function () {
    return this.each(function () {
      var $this = $(this);
      $this.on('mouseover', function() {
        var title = $this.attr('data-original-title');
        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        var hasTitle = typeof title !== typeof undefined && title !== false;
        if (this.offsetWidth < this.scrollWidth && !hasTitle) {
          $this.attr('title', $this.text());
          $this.tooltip({ container: 'body' });
          $this.tooltip('show');
        }
      });
    });
  };

  $.widget("custom.groupedAutocomplete", $.ui.autocomplete, {
    _create: function() {
      this._super();
      this.widget().menu("option", "items", "> :not(.autocomplete-group-separator)");
    },
    _renderMenu: function(ul, items) {
      var that = this, currentGroup = "";
      $.each(items, function(index, item) {
        if (item.group != currentGroup) {
          that._renderGroupSeparator(ul, item).addClass('autocomplete-group-separator');
          currentGroup = item.group;
        }
        var li = that._renderItemData(ul, item);
        if (item.group) {
          li.attr("aria-label", item.group + " : " + item.label);
        }
      });
    },
    _renderGroupSeparator: function(ul, item) {
      return $("<li>")
        .text(item.group)
        .appendTo(ul);
    }
  });
}(jQuery));