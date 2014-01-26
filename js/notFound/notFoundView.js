/*global define*/
define([
  'nex',
  'handlebars',
  'text!./notFoundTemplate.html',
  'js/layout/layoutView'
], function(Nex, Handlebars, notFoundTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(notFoundTemplate),
    layout: LayoutView
  });
});
