$(document).ready(function() {
  function search(term) {
    return $.getJSON($SCRIPT_ROOT+'search?term='+term);
  }

  $("#search-box").autocomplete({
    source: function(request, response) {
      search(request.term)
        .done(function (data) {
          response($.map(data, function (hit) {
            return {
              value: hit.title,
              x: hit.x,
              y: hit.y,
              id: hit.id,
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
      wikimap.select(ui.item.id);
      wikimap.centerOn(ui.item.x, ui.item.y);
    },
  });
});