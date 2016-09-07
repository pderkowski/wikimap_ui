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
            };
          }));
        });
    },
    minLength: 1,
    delay: 100,
    autoFocus: true,
    select: function (event, ui) {
      wikimap.centerOn(ui.item.x, ui.item.y);
    }
  });
});