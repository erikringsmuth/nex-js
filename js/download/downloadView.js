/*global define*/
define([
  'nex',
  'handlebars',
  'text!./downloadTemplate.html',
  'layout/layoutView'
], function(Nex, Handlebars, downloadTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(downloadTemplate),
    
    layoutView: new LayoutView()
  });
});
