/*global define, require*/
define([
  'requireConfig'
], function(requireConfig) {
  'use strict';

  // Configure require.js paths and shims
  require.config(requireConfig);

  // Use the RequireJS Router to run the app
  require(['router', 'js/routes'], function(router, routes) {
    // Configure the router
    router.config({
      routes: routes,

      // When a route loads, render the view and attach it to the document
      routeLoadedCallback: function routeLoadedCallback(View) {
        var body = document.querySelector('body');
        body.innerHTML = '';
        body.appendChild(new View().render().outerEl);
      }
    });

    // Trigger the initial page load
    router.loadCurrentRoute();
  });
});
