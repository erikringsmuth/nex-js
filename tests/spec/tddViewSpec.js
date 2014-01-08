/*global define*/
define([
  'jasmineAmd',
  'js/tdd/tddView'
], function(jasmine, TddView) {
  'use strict';

  var env = jasmine.getEnv(), describe = env.describe, it =  env.it, expect = env.expect;

  describe('The TDD view', function() {
    it('should load', function() {
      expect(TddView).toBeDefined();
    });

    it('should have a layout view', function() {
      var tddView = new TddView();
      tddView.render();
      expect(tddView.outerEl.querySelector('.navbar')).not.toBeFalsy();
    });
  });
});
