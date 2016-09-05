$(document).ready(function() {
  $('#search-box').on('input propertychange paste', function() {
    var query = $('#search-box').val();

    if (query) {
      $.getJSON($SCRIPT_ROOT+'search!'+query).done(function (data) {
        console.log(data);
      });
    }
  });
});