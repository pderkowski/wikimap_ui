var Data = require('../data');
var Control = require('./control');

var Search = function (options) {
  var that = Control($('<input type="search" placeholder="Search...">').classify('search'), options);

  var categories = 'Categories';
  var pages = 'Pages';

  that.$.groupedAutocomplete({
    _renderItem: function(ul, item) {
      var div = $('<div>')
        .append($('<span>')
          .text(item.label)
          .classify('search-label'));
      return $("<li>");
    },
    source: function(request, response) {
      Data.Term.get(request.term)
        .done(function (data) {
          response($.map(data, function (hit) {
            return {
              value: hit.term,
              group: (hit.isCategory ? categories : pages),
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
      if (ui.item.group == categories) {
        that.$.trigger('categorySelected', [ui.item.value]);
      } else {
        that.$.trigger('pointSelected', [ui.item.value]);
      }
    },
  });

  return that;
};

module.exports = Search;
