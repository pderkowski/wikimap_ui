var $ = require('jquery');
require('jquery-ui/ui/widgets/autocomplete');

var search = function (wikimap, data) {
  $("#search-box").autocomplete({
    source: function(request, response) {
      data.Term.get(request.term)
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
    appendTo: "#search-container",
    position: {
      my: "left top+8",
      at: "left bottom",
      collision: "none"
    },
    select: function (event, ui) {
      if (ui.item.isCategory) {
        wikimap.addCategorySelection(ui.item.value);
      } else {
        wikimap.addPointSelection(ui.item.value);
      }
    },
  })
  .autocomplete("instance")._renderItem = function(ul, item) {
    var html = "<div><span class=search-label>"+ item.label+"</span>";

    if (item.isCategory) {
      html += "<span class=search-description>category</span>";
    }
    html += "</div>";

    return $("<li>")
      .append(html)
      .appendTo(ul);
  };
};

module.exports = search;