/*global define, require*/
define([
  '../js/requireConfig'
], function(requireConfig) {
  'use strict';

  // Run the main site's configuration so that all of the normal paths and shims are set up
  require.config(requireConfig);

  // Add the Jasmine configuration
  require.config({
    paths: {
      'jasmine': './bower_components/jasmine/lib/jasmine-core/jasmine',
      'jasmine-html': './bower_components/jasmine/lib/jasmine-core/jasmine-html',
      'boot': './bower_components/jasmine/lib/jasmine-core/boot',
      'jasmineAmd': 'tests/jasmineAmd'
    },
    shim: {
      'jasmine': {
        exports: 'jasmine'
      },
      'jasmine-html': {
        deps: ['jasmine'],
        exports: 'jasmine'
      },
      'boot': {
        deps: ['jasmine', 'jasmine-html'],
        exports: 'jasmine'
      }
    }
  });

  // Load the list of specs (array of AMD module names), the router, the routes, and the Jasmine bootloader
  //
  // Note - Loading Jasmine will still create all of the normal Jasmine browser globals unless `boot.js` is re-written to use
  // the AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to `window.onload()`. Because
  // we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again. This will
  // initialize the HTML Reporter and execute the environment.
  require(['tests/specs', 'router', 'js/routes', 'boot'], function (specs, router, routes) {
    // Configure the router so that routes are set up the same way as on the main site
    router.config({
      routes: routes,
      routeLoadedCallback: function routeLoadedCallback() { } // no-op for tests
    });

    // Load the all of the specs
    require(specs, function () {
      // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
      window.onload();
    });
  });
})();
