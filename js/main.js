/*global define, require*/
define([
  'requireConfig'
], function(requireConfig) {
  'use strict';

  // Configure require.js paths and shims
  require.config(requireConfig);

  // Load the router, Bootstrap CSS JS, and get ECMAScript 5 polyfills so IE8 can use cool new Array.prototype extension methods
  require(['router', 'bootstrap', 'polyfill/es5'], function(router) {
    // Register your routes
    router.registerRoutes({
      // home matches path = '/' or '/nex-js/'
      home: {path: /^\/(nex-js\/)?$/i, moduleId: 'js/home/homePage'},
      api: {path: '/api', moduleId: 'js/api/apiPage'},
      examples: {path: '/examples', moduleId: 'js/examples/examplesPage'},
      tdd: {path: '/tdd', moduleId: 'js/tdd/tddPage'},
      notes: {path: '/notes', moduleId: 'js/notes/notesPage'},
      download: {path: '/download', moduleId: 'js/download/downloadPage'},
      dev: {path: '/dev', moduleId: 'js/dev/child/childPage'},
      notFound: {path: '*', moduleId: 'js/notFound/notFoundPage'}
    });

    router.on('routeload', function onRouteLoad(View, routeArguments) {
      new View(routeArguments).attachTo('body');
      
      // Scroll back to the top of the page since we aren't reloading the entire page
      scroll(0, 0);
    });

    // Trigger the initial page load
    router.init();
  });
});
