/*global define*/
define([], function() {
  'use strict';

  // Require.js configuration
  return {
    baseUrl: '', // main.js is in `/js` but we want the baseUrl to be `/`
    paths: {
      'text': 'bower_components/requirejs-text/text',
      'router': 'bower_components/requirejs-router/router',
      'nex': 'bower_components/nex-js/nex',
      'handlebars': 'bower_components/handlebars/handlebars',
      'jquery': 'bower_components/jquery/jquery',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
      'polyfill': 'bower_components/polyfills'
    },
    shim: {
      'handlebars': {
        exports: 'Handlebars'
      },
      'bootstrap': {
        // bootstrap extends jQuery, it doesn't export anything. It requires html5shiv and respond for IE8.
        deps: ['jquery', 'bower_components/html5shiv/dist/html5shiv', 'bower_components/respond/src/respond']
      },
      'html5shiv': {
        exports: 'html5'
      }
    }
  };
});
