/*global define*/
define([
  'nex',
  'handlebars',
  'text!./homeTemplate.html',
  'js/layout/layoutView',
  'js/todo/todoView',
  'js/util/utilities'
], function(Nex, Handlebars, homeTemplate, LayoutView, TodoView, utilities) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(homeTemplate),

    layout: LayoutView,

    components: {
      '#todo-component': TodoView
    },

    render: function render() {
      this.html(this.template({model: this.model}));
      utilities.formatCode(this.el);
      return this;
    }
  });
});
