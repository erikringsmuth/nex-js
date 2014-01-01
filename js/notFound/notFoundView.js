/*global define*/
define([
  'nex',
  'handlebars',
  'text!./notFoundTemplate.html',
  'layout/layoutView'
], function(Nex, Handlebars, notFoundTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(notFoundTemplate),
    
    layoutView: new LayoutView()
  });
});
