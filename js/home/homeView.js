/*global define*/
define([
  'nex',
  'handlebars',
  'text!./homeTemplate.html',
  'js/layout/layoutView',
  'js/todo/todoView',
  'js/util/prettify'
], function(Nex, Handlebars, homeTemplate, LayoutView, TodoView, prettify) {
  'use strict';

  return Nex.View.extend(function HomeView() {
    this.template = Handlebars.compile(homeTemplate);

    this.initialize = function initialize(routeArguments) {
      // Store the route arguments during initialization
      this.model = routeArguments;
    };

    this.layoutView = new LayoutView();

    this.render = function render() {
      this.el.innerHTML = this.template({model: this.model});
      prettify.formatCode(this.el);
      this.el.querySelector('.todo-mvc-container').appendChild(new TodoView(this.model).render().el);
      return this;
    };
  });
});
