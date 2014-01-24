/*global define, require*/
define([
  'requireConfig'
], function(requireConfig) {
  'use strict';

  // Configure require.js paths and shims
  require.config(requireConfig);

  // Load the router and get ECMAScript 5 polyfills so IE8 can use cool new Array.prototype extension methods
  require(['router', 'polyfill/es5'], function(router) {
    // Configure the router
    router.config({
      // Define all of your routes here
      routes: {
        // root matches path = '/' or '/nex-js/'
        root: {matchesUrl: function matchesUrl() { return router.testRoute({path: '/'}) || router.testRoute({path: '/nex-js/'}); }, module: 'js/home/homeView'},
        api: {path: '/api', module: 'js/api/apiView'},
        examples: {path: '/examples', module: 'js/examples/examplesView'},
        tdd: {path: '/tdd', module: 'js/tdd/tddView'},
        notes: {path: '/notes', module: 'js/notes/notesView'},
        download: {path: '/download', module: 'js/download/downloadView'},
        dev: {path: '/dev', module: 'js/dev/child/childView'},
        notFound: {path: '*', module: 'js/notFound/NotFoundView'}
      },

      // When a route loads, render the view and attach it to the document
      routeLoadedCallback: function routeLoadedCallback(View, routeArguments) {
        var body = document.querySelector('body');
        body.innerHTML = '';
        body.appendChild(new View(routeArguments).render().outerEl);
        
        // Scroll back to the top of the page since we're just replacing the innerHTML
        scroll(0, 0);
      }
    });

    // Trigger the initial page load
    router.loadCurrentRoute();
  });
});
