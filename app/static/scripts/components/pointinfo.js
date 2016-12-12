var Vue = require('vue');

var template =
'<div v-if="show" class="my rounded shaded panel in-top-right-corner">\
  <h1>{{ title }}</h1>\
  <ul>\
    <li v-for="neighbor in neighbors">\
      {{ neighbor }}\
    </li>\
  </ul>\
</div>';

module.exports = Vue.extend({
  template: template,
  data: function () {
    return {
      title: "",
      neighbors: [],
      show: false
    }
  }
});

