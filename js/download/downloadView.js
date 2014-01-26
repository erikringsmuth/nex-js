/*global define*/
define([
  'nex',
  'handlebars',
  'text!./downloadTemplate.html',
  'js/layout/layoutView',
  'js/util/utilities'
], function(Nex, Handlebars, downloadTemplate, LayoutView, utilities) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(downloadTemplate),
    
    layout: LayoutView,

    render: function render() {
      this.html(this.template({model: this.model}));
      utilities.formatCode(this.el);
      return this;
    }
  });
});
