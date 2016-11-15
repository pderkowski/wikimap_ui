var Vue = require('vue');

module.exports = Vue.extend({
  template: require('raw!templates/pointinfo.html'),
  data: function () {
    return {
      title: "",
      show: false
    }
  }
});

