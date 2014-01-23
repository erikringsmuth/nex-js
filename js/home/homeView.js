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

    initialize: function initialize(routeArguments) {
      // Store the route arguments during initialization
      this.model = routeArguments;
    },

    layoutView: new LayoutView(),

    render: function render() {
      this.el.innerHTML = this.template({model: this.model});
      utilities.formatCode(this.el);
      this.el.querySelector('.todo-mvc-container').appendChild(new TodoView(this.model).render().el);
      return this;
    }
  });
});
