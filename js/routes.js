/*global define*/
define(['router'], function(router) {
  'use strict';

  // Define all of your routes here
  return {
    // root matches path = '/' or '/nex-js'
    root: {matchesUrl: function matchesUrl() { return router.testRoute({path: '/'}) || router.testRoute({path: '/nex-js'}); }, module: 'js/home/homeView'},
    api: {path: '/api', module: 'js/api/apiView'},
    examples: {path: '/examples', module: 'js/examples/examplesView'},
    tdd: {path: '/tdd', module: 'js/tdd/tddView'},
    notes: {path: '/notes', module: 'js/notes/notesView'},
    download: {path: '/download', module: 'js/download/downloadView'},
    dev: {path: '/dev', module: 'js/dev/child/childView'},
    notFound: {path: '*', module: 'js/notFound/NotFoundView'},

    // You can't use these routes to load a module. They're used by sub-views for their `.matchesUrl()` method.
    // todoAll matches a query string with 'todoFilter=all' or neither 'todoFilter=active' or 'todoFilter=completed'
    todoAll: {matchesUrl: function matchesUrl() { return router.testRoute({queryParameters: ['todoFilter=all']}) || !(router.routes.todoActive.matchesUrl() || router.routes.todoCompleted.matchesUrl()); }},
    todoActive: {queryParameters: ['todoFilter=active']},
    todoCompleted: {queryParameters: ['todoFilter=completed']}
  };
});
