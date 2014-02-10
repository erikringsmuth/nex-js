/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/api/apiPage'
], function(describe, it, expect, ApiPage) {
  'use strict';

  describe('The API view', function() {
    it('should load', function() {
      expect(ApiPage).toBeDefined();
    });

    it('should have a layout view', function() {
      var apiPage = new ApiPage();
      expect(apiPage.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
