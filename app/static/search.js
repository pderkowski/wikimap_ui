$(document).ready(function() {
  $('#search-box').easyAutocomplete({
    url: function (query) {
      return $SCRIPT_ROOT+'search?query='+query;
    },

    getValue: 'title',
    matchResponseProperty: 'query',
    listLocation: 'results',

    requestDelay: 100,

    list: {
      showAnimation: {
        type: "slide", //normal|slide|fade
        time: 200,
        callback: function() {}
      },

      hideAnimation: {
        type: "slide", //normal|slide|fade
        time: 200,
        callback: function() {}
      },

      maxNumberOfElements: 5,
      match: {
        enabled: true
      },

      onChooseEvent: function() {
        var data = $("#search-box").getSelectedItemData();
        console.log("Selected ("+data.title+', '+data.x+', '+data.y+')');
        wikimap.centerOn(data.x, data.y);
      }
    },

    theme: "round",
  });

  // $("#search-box").autocomplete({
  //   source: function (request, response) {
  //     $.getJSON($SCRIPT_ROOT+'search!'+request.term).done(function (data) {
  //       // console.log(data);
  //       response(data);
  //     });
  //     // $.ajax( {
  //     //   url: "http://gd.geobytes.com/AutoCompleteCity",
  //     //   dataType: "jsonp",
  //     //   data: {
  //     //     q: request.term
  //     //   },
  //     // } );
  //   },
  //   minLength: 2,
  //   delay: 100,
  //   // select: function (event, ui) {
  //   //   console.log("Selected: " + ui.item.label);
  //   // }
  // });
});