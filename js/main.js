/*global define, require*/
define([
  'requireConfig'
], function(requireConfig) {
  'use strict';

  // Configure require.js paths and shims
  require.config(requireConfig);

  // Load the router
  require(['router', 'js/routes'], function(router, routes) {
    // Configure the router
    router.config({
      routes: routes,

      // When a route loads, render the view and attach it to the document
      routeLoadedCallback: function routeLoadedCallback(View) {
        var body = document.querySelector('body');
        body.innerHTML = '';
        body.appendChild(new View().render().outerEl);
        
        // Scroll back to the top of the page since we're just replacing the innerHTML
        scroll(0, 0);
      }
    });

    // Trigger the initial page load
    router.loadCurrentRoute();
  });
});
