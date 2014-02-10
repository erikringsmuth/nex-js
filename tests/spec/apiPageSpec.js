/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/api/apiPage'
], function(describe, it, expect, ApiPage) {
  'use strict';

  describe('The API page', function() {
    it('should load', function() {
      expect(ApiPage).toBeDefined();
    });

    it('should have a layout page', function() {
      var apiPage = new ApiPage();
      expect(apiPage.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
