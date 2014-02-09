/*global define*/
define([
  'nex',
  'handlebars',
  'text!./downloadTemplate.html',
  'js/layout/layout',
  'js/util/utilities'
], function(Nex, Handlebars, downloadTemplate, Layout, utilities) {
  'use strict';

  return Nex.defineComponent('download-page', {
    template: Handlebars.compile(downloadTemplate),
    
    layout: Layout,

    render: function render() {
      this.html(this.template(this));
      utilities.formatCode(this);
      return this;
    }
  });
});
