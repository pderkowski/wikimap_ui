var Data = require('../data');
var Control = require('./control');

var Search = function (options) {
  var that = Control($('<input type="search" placeholder="Search...">').classify('search-box'), options);

  var categories = 'Categories';
  var pages = 'Pages';

  that.$.groupedAutocomplete({
    source: function(request, response) {
      Data.Terms.get(request.term)
        .done(function (data) {
          response($.map(data, function (hit) {
            return {
              value: hit.term,
              group: (hit.type == 'category')? categories : pages,
              size: hit.size // only for categories
            };
          }));
        });
    },
    minLength: 1,
    delay: 50,
    autoFocus: true,
    appendTo: '#'+options.hook.attr('id'),
    position: {
      my: "left top+8",
      at: "left bottom",
      collision: "none"
    },
    select: function (event, ui) {
      if (ui.item.group == categories) {
        that.$.trigger('categorySelected', [ui.item.value]);
      } else {
        that.$.trigger('pointSelected', [ui.item.value]);
      }
    }
  });
  that.$.groupedAutocomplete("widget").classify('search-menu');
  that.$.groupedAutocomplete("instance")._renderItem = function(ul, item) {
    var div = $('<div>')
      .classify('search-menu-content')
      .append($('<span>')
        .text(item.label)
        .classify('search-label'));
    if (item.group == categories) {
      div.append($('<span>')
        .text(item.size)
        .classify('search-description'));
    }

    return $("<li>")
      .classify('search-menu-item')
      .append(div)
      .appendTo(ul);
  };
  that.$.groupedAutocomplete("instance")._renderGroupSeparator = function(ul, item) {
    return $("<li>")
      .classify('search-group-separator')
      .text(item.group)
      .appendTo(ul);
  };

  return that;
};

module.exports = Search;
