/*global define*/
define([
  'nex',
  'handlebars',
  'text!./layoutTemplate.html',
  'router',
  'bootstrap'
], function(Nex, Handlebars, layoutTemplate, router) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(layoutTemplate),

    contentPlaceholderId: 'content-placeholder',

    model: {
      routes: router.routes,
      devMode: function devMode() { return window.location.hostname === 'localhost'; }
    }
  });
});
