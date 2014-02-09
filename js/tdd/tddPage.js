/*global define*/
define([
  'nex',
  'handlebars',
  'text!./tddTemplate.html',
  'js/layout/layout',
  'js/util/utilities'
], function(Nex, Handlebars, tddTemplate, Layout, utilities) {
  'use strict';

  return Nex.defineComponent('tdd-page', {
    template: Handlebars.compile(tddTemplate),
    
    layout: Layout,

    render: function render() {
      this.html(this.template(this));
      utilities.formatCode(this);
      return this;
    }
  });
});
