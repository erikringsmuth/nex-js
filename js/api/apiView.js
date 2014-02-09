/*global define*/
define([
  'nex',
  'handlebars',
  'text!./apiTemplate.html',
  'js/layout/layoutView',
  'js/util/utilities'
], function(Nex, Handlebars, apiTemplate, LayoutView, utilities) {
  'use strict';

  return Nex.defineComponent('api-page', {
    template: Handlebars.compile(apiTemplate),
    
    layout: LayoutView,

    render: function render() {
      this.html(this.template({model: this.model}));
      utilities.formatCode(this);
      return this;
    }
  });
});
