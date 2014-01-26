/*global define*/
define([
  'nex',
  'handlebars',
  'text!./apiTemplate.html',
  'js/layout/layoutView',
  'js/util/utilities'
], function(Nex, Handlebars, apiTemplate, LayoutView, utilities) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(apiTemplate),
    
    layoutView: LayoutView,

    render: function render() {
      this.html(this.template({model: this.model}));
      utilities.formatCode(this.el);
      return this;
    }
  });
});
