/*global require*/
(function() {
  'use strict';

  // Configure require.js
  require.config({
    paths: {
      'text': '../bower_components/requirejs-text/text',
      'router': '../bower_components/requirejs-router/router',
      'nex': '../bower_components/nex-js/nex',
      'handlebars': '../bower_components/handlebars/handlebars',
      'jquery': '../bower_components/jquery/jquery',
      'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap'
    },
    shim: {
      'handlebars': {
        exports: 'Handlebars'
      },
      'bootstrap': {
        deps: ['jquery']
      }
    }
  });

  // Use the RequireJS Router to run the app
  require(['router'], function(router) {
    // Configure the router
    router.config({
      routes: {
        // root matches path = '/' or '/nex-js'
        root: {matchesUrl: function matchesUrl() { return router.testRoute({path: '/'}) || router.testRoute({path: '/nex-js'}); }, module: 'home/homeView'},
        api: {path: '/api', module: 'api/apiView'},
        examples: {path: '/examples', module: 'examples/examplesView'},
        notes: {path: '/notes', module: 'notes/notesView'},
        dev: {path: '/dev', module: 'dev/child/childView'},
        notFound: {path: '*', module: 'notFound/NotFoundView'},

        // You can't use these routes to load a module. They're used by sub-views for their `.matchesUrl()` method.
        // todoAll matches a query string with 'todoFilter=all' or neither 'todoFilter=active' or 'todoFilter=completed'
        todoAll: {matchesUrl: function matchesUrl() { return router.testRoute({queryParameters: ['todoFilter=all']}) || !(router.routes.todoActive.matchesUrl() || router.routes.todoCompleted.matchesUrl()); }},
        todoActive: {queryParameters: ['todoFilter=active']},
        todoCompleted: {queryParameters: ['todoFilter=completed']}
      },

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
})();
