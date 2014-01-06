/*global define*/
define([
  'nex',
  'handlebars',
  'text!./homeTemplate.html',
  'js/layout/layoutView',
  'js/todo/todoView'
], function(Nex, Handlebars, homeTemplate, LayoutView, TodoView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(homeTemplate),

    layoutView: new LayoutView(),

    render: function render() {
      this.el.innerHTML = this.template({model: this.model});
      this.el.querySelector('.todo-mvc-container').appendChild(new TodoView().render().el);
      return this;
    }
  });
});
