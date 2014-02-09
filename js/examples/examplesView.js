/*global define*/
define([
  'nex',
  'handlebars',
  'text!./examplesTemplate.html',
  'js/layout/layoutView',
  'js/util/utilities'
], function(Nex, Handlebars, examplesTemplate, LayoutView, utilities) {
  'use strict';

  return Nex.defineComponent('examples-page', {
    template: Handlebars.compile(examplesTemplate),
    
    layout: LayoutView,

    render: function render() {
      this.html(this.template({model: this.model}));
      utilities.formatCode(this.el);
      return this;
    }
  });
});
