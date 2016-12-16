var Control = require('./control');

var Table = function (options) {
  var that = Control($('<table><thead><tr></tr></thead><tbody></tbody></table>').classify('table'), options);

  that.addColumn = function (title, column) {
    addTitle(title);
    ensureNumberOfRows(column);
    addCells(column);
    return that;
  };

  function titles() {
    return $('thead tr', that.$);
  }

  function rows() {
    return $('tbody tr', that.$);
  }


  function addTitle(title) {
    $('<th>').classify('table-header').text(title).appendTo(titles());
  }

  function ensureNumberOfRows(column) {
    var $rows = rows();
    var neededRows = column.length;
    if (neededRows > $rows.length) {
      $('tbody', that.$).append('<tr/>'.repeat(neededRows - $rows.length));
    }
  }

  function addCells(column) {
    var $rows = rows();
    for (var i = 0; i < column.length; i++) {
      var $el = $('<td>').classify('table-cell').text(column[i]).appendTo($rows.eq(i));
    }
  }

  return that;
};

module.exports = Table;
