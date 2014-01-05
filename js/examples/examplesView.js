/*global define*/
define([
  'nex',
  'handlebars',
  'text!./examplesTemplate.html',
  'layout/layoutView'
], function(Nex, Handlebars, examplesTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(examplesTemplate),
    
    layoutView: new LayoutView()
  });
});
