$(document).ready(function() {
  var chart = c3.generate({
    bindto: '#chart',
    data: {
      x: 'x',
      type: 'scatter',
      columns: [
        ['title'],
        ['x'],
        ['y']
      ],
    },
    axis: {
      x: { show: false },
      y: { show: false }
    },
    legend: { show: false },
    point: { r: 5 },
    tooltip: {
      grouped: false,
      format: {
        name: function (name, ratio, id, index) { return title[index]; },
        value: function (value, ratio, id, index) { return '('+x[index]+', '+y[index]+')'; }
      }
    }
  });

  var x = [0, 1, 2, 3.5, 4, 5];
  var y = [50, 20, 10, 40, 15, 25];
  var title = ['a', 'b', 'c', 'd', 'e'];

  $.getJSON($SCRIPT_ROOT + 'data')
    .done(function(data) {
      x = data["x"];
      y = data["y"];
      title = data["title"];

      chart.load({
        columns: [
          ['x'].concat(x),
          ['y'].concat(y),
          ['title'].concat(title)
        ]
      });
    });
});