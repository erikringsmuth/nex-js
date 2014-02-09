/*global define*/
define([
  'nex',
  'handlebars',
  'text!./homeTemplate.html',
  'js/layout/layout',
  'js/todo/todoApp',
  'js/util/utilities'
], function(Nex, Handlebars, homeTemplate, Layout, TodoApp, utilities) {
  'use strict';

  return Nex.defineComponent('home-page', {
    template: Handlebars.compile(homeTemplate),

    layout: Layout,

    components: [TodoApp],

    render: function render() {
      this.html(this.template(this));
      utilities.formatCode(this);
      return this;
    }
  });
});
