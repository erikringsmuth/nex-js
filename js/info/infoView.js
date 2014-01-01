/*global define*/
define([
  'nex',
  'handlebars',
  'text!./infoTemplate.html',
  'layout/layoutView',
  'todo/todoView'
], function(Nex, Handlebars, infoTemplate, LayoutView, TodoView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(infoTemplate),

    layoutView: new LayoutView(),

    render: function render() {
      this.el.innerHTML = this.template({model: this.model});
      this.el.querySelector('.todo-mvc-container').appendChild(new TodoView().render().el);
      return this;
    }
  });
});
