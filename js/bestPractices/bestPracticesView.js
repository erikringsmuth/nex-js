/*global define*/
define([
  'nex',
  'handlebars',
  'text!./bestPracticesTemplate.html',
  'layout/layoutView'
], function(Nex, Handlebars, bestPracticesTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(bestPracticesTemplate),
    
    layoutView: new LayoutView()
  });
});
