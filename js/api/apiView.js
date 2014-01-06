/*global define*/
define([
  'nex',
  'handlebars',
  'text!./apiTemplate.html',
  'js/layout/layoutView'
], function(Nex, Handlebars, apiTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(apiTemplate),
    
    layoutView: new LayoutView()
  });
});
