/*global define*/
define([
  'nex',
  'handlebars',
  'text!./notFoundTemplate.html',
  'js/layout/layout'
], function(Nex, Handlebars, notFoundTemplate, Layout) {
  'use strict';

  return Nex.defineComponent('not-found-page', {
    template: Handlebars.compile(notFoundTemplate),
    layout: Layout
  });
});
