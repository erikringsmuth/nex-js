/*global define*/
define([
  'nex',
  'handlebars',
  'text!./layoutTemplate.html',
  'router'
], function(Nex, Handlebars, layoutTemplate, router) {
  'use strict';

  return Nex.defineComponent('layout', {
    template: Handlebars.compile(layoutTemplate),
    model: {
      routes: router.routes
    }
  });
});
