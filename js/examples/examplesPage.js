/*global define*/
define([
  'nex',
  'handlebars',
  'text!./examplesTemplate.html',
  'js/layout/layout',
  'js/util/utilities'
], function(Nex, Handlebars, examplesTemplate, Layout, utilities) {
  'use strict';

  return Nex.defineComponent('examples-page', {
    template: Handlebars.compile(examplesTemplate),
    
    layout: Layout,

    render: function render() {
      this.html(this.template(this));
      utilities.formatCode(this);
      return this;
    }
  });
});
