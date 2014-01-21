/*global define*/
define([
  'nex',
  'handlebars',
  'text!./layoutTemplate.html',
  'router',
  'bootstrap'
], function(Nex, Handlebars, layoutTemplate, router) {
  'use strict';

  return Nex.View.extend(function LayoutView() {
    this.template = Handlebars.compile(layoutTemplate);

    this.contentPlaceholderId = 'content-placeholder';

    this.model = {
      routes: router.routes,
      devMode: function devMode() { return window.location.hostname === 'localhost'; }
    };
  });
});
