/*global define*/
define([
  'jasmineAmd',
  'js/api/apiView'
], function(jasmine, ApiView) {
  'use strict';

  var env = jasmine.getEnv(), describe = env.describe, it =  env.it, expect = env.expect;

  describe('The API view', function() {
    it('should load', function() {
      expect(ApiView).toBeDefined();
    });

    it('should have a layout view', function() {
      var apiView = new ApiView();
      apiView.render();
      expect(apiView.outerEl.querySelector('.navbar')).not.toBeFalsy();
    });
  });
});
