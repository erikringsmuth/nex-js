/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/api/apiView'
], function(describe, it, expect, ApiView) {
  'use strict';

  describe('The API view', function() {
    it('should load', function() {
      expect(ApiView).toBeDefined();
    });

    it('should have a layout view', function() {
      var apiView = new ApiView();
      apiView.render();
      expect(apiView.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
