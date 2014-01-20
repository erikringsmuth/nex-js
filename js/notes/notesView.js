/*global define*/
define([
  'nex',
  'handlebars',
  'text!./notesTemplate.html',
  'js/layout/layoutView',
  'js/util/prettify'
], function(Nex, Handlebars, notesTemplate, LayoutView, prettify) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(notesTemplate),
    
    layoutView: new LayoutView(),

    render: function render() {
      this.el.innerHTML = this.template({model: this.model});
      prettify.formatCode(this.el);
      return this;
    }
  });
});
