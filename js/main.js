/*global define, require*/
define([
  'requireConfig'
], function(requireConfig) {
  'use strict';

  // Configure require.js paths and shims
  require.config(requireConfig);

  // Load the router, Bootstrap CSS JS, and get ECMAScript 5 polyfills so IE8 can use cool new Array.prototype extension methods
  require(['router', 'bootstrap', 'polyfill/es5'], function(router) {
    // Configure the router
    router.config({
      // Define all of your routes here
      routes: {
        // root matches path = '/' or '/nex-js/'
        root: {testRoute: function() { return router.testRoute({path: '/'}) || router.testRoute({path: '/nex-js/'}); }, moduleId: 'js/home/homeView'},
        api: {path: '/api', moduleId: 'js/api/apiView'},
        examples: {path: '/examples', moduleId: 'js/examples/examplesView'},
        tdd: {path: '/tdd', moduleId: 'js/tdd/tddView'},
        notes: {path: '/notes', moduleId: 'js/notes/notesView'},
        download: {path: '/download', moduleId: 'js/download/downloadView'},
        dev: {path: '/dev', moduleId: 'js/dev/child/childView'},
        notFound: {path: '*', moduleId: 'js/notFound/notFoundView'}
      },

      // When a route loads, render the view and attach it to the document
      routeLoadedCallback: function routeLoadedCallback(View, routeArguments) {
        new View(routeArguments).attachTo('body');
        
        // Scroll back to the top of the page since we aren't reloading the entire page
        scroll(0, 0);
      }
    });

    // Trigger the initial page load
    router.loadCurrentRoute();
  });
});
