var $ = require('jquery');
require('jquery-ui/ui/widgets/autocomplete');

function searchTerm(term) {
  return $.getJSON($SCRIPT_ROOT+'search?title='+term);
}

var search = function (wikimap) {
  $("#search-box").autocomplete({
    source: function(request, response) {
      searchTerm(request.term)
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
        wikimap.selectCategory(ui.item.value);
      }
      // else {
      //   getPoint(ui.item.value)
      //     .done(function (points) {
      //       if (points.length > 0) {
      //         wikimap.select([points[0].id]);
      //         wikimap.centerOn(points[0].x, points[0].y);
      //       }
      //     });
      // }
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