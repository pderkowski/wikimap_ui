function fitBoundsToScreen(bounds) {
  var chartWidth = document.getElementById('chart').offsetWidth;
  var chartHeight = document.getElementById('chart').offsetHeight;
  var chartRatio = chartWidth / chartHeight;

  var boundsWidth = bounds.bottomRight.x - bounds.topLeft.x;
  var boundsHeight = bounds.bottomRight.y - bounds.topLeft.y;
  var boundsRatio = boundsWidth / boundsHeight;

  var boundsCopy = jQuery.extend(true, {}, bounds)

  if (boundsRatio > chartRatio) {
    var newBoundsHeight = boundsWidth / chartRatio;
    var margin = (newBoundsHeight - boundsHeight) / 2;
    boundsCopy.topLeft.y -= margin;
    boundsCopy.bottomRight.y += margin;
  } else {
    var newBoundsWidth = boundsHeight * chartRatio;
    var margin = (newBoundsWidth - boundsWidth) / 2;
    boundsCopy.topLeft.x -= margin;
    boundsCopy.bottomRight.x += margin;
  }

  return boundsCopy;
}

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
      x: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        }
      },
      y: {
        show: false,
        padding: {
          top: 0,
          bottom: 0,
        }
      }
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
      $(document).data('chart.x', data.x);
      $(document).data('chart.y', data.y);
      $(document).data('chart.titles', data.titles);

      chart.load({
        columns: [
          ['x'].concat($(document).data('chart.x')),
          ['y'].concat($(document).data('chart.y')),
          ['titles'].concat($(document).data('chart.titles')),
        ]
      });

      var bounds = fitBoundsToScreen(data.bounds);

      chart.axis.range({
        min: {
          x: bounds.topLeft.x,
          y: bounds.topLeft.y
        },
        max: {
          x: bounds.bottomRight.x,
          y: bounds.bottomRight.y
        }
      });
    });
});

