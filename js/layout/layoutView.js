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

    contentPlaceholderId: 'content-placeholder',

    model: {
      routes: router.routes,
      devMode: window.location.hostname === 'localhost'
    }
  });
});
