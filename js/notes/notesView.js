/*global define*/
define([
  'nex',
  'handlebars',
  'text!./notesTemplate.html',
  'layout/layoutView'
], function(Nex, Handlebars, notesTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(notesTemplate),
    
    layoutView: new LayoutView()
  });
});
