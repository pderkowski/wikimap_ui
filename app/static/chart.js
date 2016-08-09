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

function loadBounds() {
  var chart = $(document).data('chart');

  return $.getJSON($SCRIPT_ROOT + 'bounds')
    .done(function(bounds) {
      var fittedBounds = fitBoundsToScreen(bounds);

      $(document).data('bounds', fittedBounds);

      chart.axis.range({
        min: {
          x: fittedBounds.xMin,
          y: fittedBounds.yMin
        },
        max: {
          x: fittedBounds.xMax,
          y: fittedBounds.yMax
        }
      });
    });
}

function loadPoints() {
  var chart = $(document).data('chart');

  var xMin = $(document).data('bounds').xMin;
  var yMin = $(document).data('bounds').yMin;
  var xMax = $(document).data('bounds').xMax;
  var yMax = $(document).data('bounds').yMax;

  return $.getJSON($SCRIPT_ROOT + 'points!'+xMin+'!'+yMin+'!'+xMax+'!'+yMax)
    .done(function(points) {


      $(document).data('points', points);

      chart.load({
        columns: [
          ['x'].concat(points.x),
          ['y'].concat(points.y),
        ]
      });
    });
}

function initChart() {
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
        value: function (value, ratio, id, index) { return index + ': (' + $(document).data('points').x[index]+', ' + $(document).data('points').y[index]+')'; }
      }
    }
  });

  $(document).data('chart', chart);
}

$(document).ready(function() {
  initChart();

  loadBounds()
    .then(loadPoints);
});

