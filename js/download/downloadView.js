/*global define*/
define([
  'nex',
  'handlebars',
  'text!./downloadTemplate.html',
  'js/layout/layoutView',
  'js/util/prettify'
], function(Nex, Handlebars, downloadTemplate, LayoutView, prettify) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(downloadTemplate),
    
    layoutView: new LayoutView(),

    render: function render() {
      this.el.innerHTML = this.template({model: this.model});
      prettify.formatCode(this.el);
      return this;
    }
  });
});
