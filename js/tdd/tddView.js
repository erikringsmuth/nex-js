/*global define*/
define([
  'nex',
  'handlebars',
  'text!./tddTemplate.html',
  'js/layout/layoutView'
], function(Nex, Handlebars, tddTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(tddTemplate),
    
    layoutView: new LayoutView()
  });
});
