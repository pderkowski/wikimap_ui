var Data = require('./data');
require('jquery-ui/ui/widgets/autocomplete');

var Control = require('./controls/control');

var Search = function (options) {
  var that = Control($('<input type="search" placeholder="Search...">').classify('search'), options);

  that.$.autocomplete({
    source: function(request, response) {
      Data.Term.get(request.term)
        .done(function (data) {
          response($.map(data, function (hit) {
            return {
              value: hit.term,
              isCategory: hit.isCategory,
            };
          }));
        });
    },
    minLength: 1,
    delay: 100,
    autoFocus: true,
    appendTo: '#'+options.hook.attr('id'),
    position: {
      my: "left top+8",
      at: "left bottom",
      collision: "none"
    },
    select: function (event, ui) {
      if (ui.item.isCategory) {
        that.$.trigger('categorySelected', [ui.item.value]);
      } else {
        that.$.trigger('pointSelected', [ui.item.value]);
      }
    },
  })
  .autocomplete("instance")._renderItem = function(ul, item) {
    var div = $('<div>')
      .append($('<span>')
        .text(item.label)
        .classify('search-label'));

    if (item.isCategory) {
      div.append($("<span>").text('category').classify('search-description'));
    }

    return $("<li>")
      .append(div)
      .appendTo(ul);
  };

  return that;
};

module.exports = Search;
