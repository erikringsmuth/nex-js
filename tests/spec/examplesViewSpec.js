/*global define*/
define([
  'jasmineAmd',
  'js/examples/examplesView'
], function(jasmine, ExamplesView) {
  'use strict';

  var env = jasmine.getEnv(),
    describe = env.describe,
    it =  env.it,
    expect = env.expect;

  describe('The examples view', function() {
    it('should load', function() {
      expect(ExamplesView).toBeDefined();
    });

    it('should have a layout view', function() {
      var examplesView = new ExamplesView();
      examplesView.render();
      expect(examplesView.outerEl.querySelector('.navbar')).not.toBeFalsy();
    });
  });
});
