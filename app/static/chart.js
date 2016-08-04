$(document).ready(function() {
  var chart = c3.generate({
    bindto: '#chart',
    data: {
      x: 'x',
      type: 'scatter',
      columns: [
        ['x'],
        ['y'],
        ['titles']
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
        title: function (x) { return 'Data ' + x; },
        name: function (name, ratio, id, index) { return ': ' + $(document).data('chart.titles')[index]; },
        value: function (value, ratio, id, index) { return index + ': (' + $(document).data('chart.x')[index]+', ' + $(document).data('chart.y')[index]+')'; }
      }
    }
  });

  $.getJSON($SCRIPT_ROOT + 'data')
    .done(function(data) {
      $(document).data('chart.x', data["x"]);
      $(document).data('chart.y', data["y"]);
      $(document).data('chart.titles', data["titles"]);

      chart.load({
        columns: [
          ['x'].concat($(document).data('chart.x')),
          ['y'].concat($(document).data('chart.y')),
          ['titles'].concat($(document).data('chart.titles')),
        ]
      });
    });
});