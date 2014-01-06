/*global define*/
define([], function() {
  'use strict';

  // Require.js configuration
  return {
    // main.js is in `/js` but we want the baseUrl to be `/`
    // This is a fix for the github.io URL starting with /nex-js
    baseUrl: window.location.pathname.startsWith('/nex-js') ? '' : '..',
    paths: {
      'text': 'bower_components/requirejs-text/text',
      'router': 'bower_components/requirejs-router/router',
      'nex': 'bower_components/nex-js/nex',
      'handlebars': 'bower_components/handlebars/handlebars',
      'jquery': 'bower_components/jquery/jquery',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap'
    },
    shim: {
      'handlebars': {
        exports: 'Handlebars'
      },
      'bootstrap': {
        deps: ['jquery']
      }
    }
  };
});
