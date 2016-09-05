$(document).ready(function() {
  $('#search-button').click(function (ev) {
    var query = $('#search-box').val();

    ev.preventDefault();

    if (query) {
      $.getJSON($SCRIPT_ROOT+'search!'+query).done(function (data) {
        console.log(data);
      });
    }
  });
});