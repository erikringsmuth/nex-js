/*global define*/
define([
  'nex',
  'handlebars',
  'text!./layoutTemplate.html',
  'router'
], function(Nex, Handlebars, layoutTemplate, router) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(layoutTemplate),

    contentPlaceholder: '#content-placeholder',

    model: {
      routes: router.routes
    }
  });
});
