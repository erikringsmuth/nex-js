/*global define, require*/
define([
  '../js/requireConfig'
], function(requireConfig) {
  'use strict';

  // Run the main site's configuration so that all of the normal paths and shims are set up
  require.config(requireConfig);

  // Shim jasmine. jasmine.js creates the `window.jasmineRequire` global. jasmine-html.js adds properties to that global.
  require.config({
    baseUrl: '..',
    paths: {
      'jasmine': 'bower_components/jasmine/lib/jasmine-core/jasmine',
      'jasmine-html': 'bower_components/jasmine/lib/jasmine-core/jasmine-html',
      'jasmineAmd': 'tests/jasmineAmd',
      'Squire': 'bower_components/squire/src/Squire'
    },
    shim: {
      'jasmine': {
        exports: 'jasmineRequire'
      },
      'jasmine-html': {
        deps: ['jasmine'],
        exports: 'jasmineRequire'
      }
    }
  });

  // Load the HTML bootloader and all of the specs
  require(['tests/bootAmd', 'tests/specList', 'router', 'js/routes'], function (boot, specList, router, routes) {
    // Configure the router so that routes are set up the same way as on the main site
    router.config({
      routes: routes,
      routeLoadedCallback: function routeLoadedCallback() { } // no-op for tests
    });

    // Load the specs, initialize the HTML Reporter, and execute the environment
    require(specList, function() {
      boot.initializeHtmlReporter();
      boot.execute();
    });
  });
});
