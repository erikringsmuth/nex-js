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
    todoAll: {queryParameters: ['todoFilter=all']},
    // todoActive matches a query string with 'todoFilter=active' or neither 'todoFilter=all' or 'todoFilter=completed'. This makes it the default TodoMVC filter.
    todoActive: {matchesUrl: function matchesUrl() { return router.testRoute({queryParameters: ['todoFilter=active']}) || !(router.routes.todoAll.matchesUrl() || router.routes.todoCompleted.matchesUrl()); }},
    todoCompleted: {queryParameters: ['todoFilter=completed']}
  };
});
