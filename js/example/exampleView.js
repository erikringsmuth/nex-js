/*global define*/
define([
  'nex',
  'handlebars',
  'text!./exampleTemplate.html',
  'layout/layoutView'
], function(Nex, Handlebars, exampleTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(exampleTemplate),
    
    layoutView: new LayoutView()
  });
});
