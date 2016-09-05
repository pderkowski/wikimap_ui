$(document).ready(function() {
  var search = $('#search-box');
  search.submit(function (ev) {
    ev.preventDefault();

    $.ajax({
      type: search.attr('method'),
      url: search.attr('action'),
      data: search.serialize(),
    }).done(function (data) {
      console.log(data);
    });
  });
});