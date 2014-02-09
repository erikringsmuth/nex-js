/*global define*/
define([
  'nex',
  'handlebars',
  'text!./apiTemplate.html',
  'js/layout/layout',
  'js/util/utilities'
], function(Nex, Handlebars, apiTemplate, Layout, utilities) {
  'use strict';

  return Nex.defineComponent('api-page', {
    template: Handlebars.compile(apiTemplate),
    
    layout: Layout,

    render: function render() {
      this.html(this.template(this));
      utilities.formatCode(this);
      return this;
    }
  });
});
