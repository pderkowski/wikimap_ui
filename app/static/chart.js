function fitBoundsToScreen(bounds) {
  var chartWidth = document.getElementById('chart').offsetWidth;
  var chartHeight = document.getElementById('chart').offsetHeight;
  var chartRatio = chartWidth / chartHeight;

  var boundsWidth = bounds.xMax - bounds.xMin;
  var boundsHeight = bounds.yMax - bounds.yMin;
  var boundsRatio = boundsWidth / boundsHeight;

  var boundsCopy = jQuery.extend(true, {}, bounds)

  if (boundsRatio > chartRatio) {
    var newBoundsHeight = boundsWidth / chartRatio;
    var margin = (newBoundsHeight - boundsHeight) / 2;
    boundsCopy.yMin -= margin;
    boundsCopy.yMax += margin;
  } else {
    var newBoundsWidth = boundsHeight * chartRatio;
    var margin = (newBoundsWidth - boundsWidth) / 2;
    boundsCopy.xMin -= margin;
    boundsCopy.xMax += margin;
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
        value: function (value, ratio, id, index) { return index + ': (' + $(document).data('chart.x')[index]+', ' + $(document).data('chart.y')[index]+')'; }
      }
    }
  });

  $.getJSON($SCRIPT_ROOT + 'data')
    .done(function(data) {
      $(document).data('chart.x', data.points.x);
      $(document).data('chart.y', data.points.y);

      chart.load({
        columns: [
          ['x'].concat($(document).data('chart.x')),
          ['y'].concat($(document).data('chart.y')),
        ]
      });

      var bounds = fitBoundsToScreen(data.bounds);

      chart.axis.range({
        min: {
          x: bounds.xMin,
          y: bounds.yMin
        },
        max: {
          x: bounds.xMax,
          y: bounds.yMax
        }
      });
    });
});

