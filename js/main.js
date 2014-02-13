/*global define, require*/
define([
  'requireConfig'
], function(requireConfig) {
  'use strict';

  // Configure require.js paths and shims
  require.config(requireConfig);

  // Load the router, Bootstrap CSS JS, and get ECMAScript 5 polyfills so IE8 can use cool new Array.prototype extension methods
  require(['router', 'bootstrap', 'polyfill/es5'], function(router) {
    router
      .registerRoutes({
        home: { path: /^\/(nex-js\/)?$/i, moduleId: 'js/home/homePage' }, // matches '/' or '/nex-js/'
        api: { path: '/api', moduleId: 'js/api/apiPage' },
        examples: { path: '/examples', moduleId: 'js/examples/examplesPage' },
        tdd: { path: '/tdd', moduleId: 'js/tdd/tddPage' },
        notes: { path: '/notes', moduleId: 'js/notes/notesPage' },
        download: { path: '/download', moduleId: 'js/download/downloadPage' },
        dev: { path: '/dev', moduleId: 'js/dev/child/childPage' },
        notFound: { path: '*', moduleId: 'js/notFound/notFoundPage' }
      })
      .on('routeload', function onRouteLoad(Component, routeArguments) {
        new Component(routeArguments).attachTo('body');
        scroll(0, 0); // Scroll back to the top of the page since we aren't reloading the entire page
      })
      .init(); // Set up event handlers and trigger the initial page load
  });
});
