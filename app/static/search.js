$(document).ready(function() {
  // $('#search-box').on('input propertychange paste', function() {
  //   var query = $('#search-box').val();

  //   if (query) {
  //     $.getJSON($SCRIPT_ROOT+'search!'+query).done(function (data) {
  //       console.log(data);
  //     });
  //   }
  // });

  $("#search-box").autocomplete({
    source: function (request, response) {
      $.getJSON($SCRIPT_ROOT+'search!'+request.term).done(function (data) {
        // console.log(data);
        response(data);
      });
      // $.ajax( {
      //   url: "http://gd.geobytes.com/AutoCompleteCity",
      //   dataType: "jsonp",
      //   data: {
      //     q: request.term
      //   },
      // } );
    },
    minLength: 2,
    // select: function (event, ui) {
    //   console.log("Selected: " + ui.item.label);
    // }
  });
});