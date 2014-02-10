/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/tdd/tddPage'
], function(describe, it, expect, TddPage) {
  'use strict';

  describe('The TDD page', function() {
    it('should load', function() {
      expect(TddPage).toBeDefined();
    });

    it('should have a layout page', function() {
      var tddPage = new TddPage();
      expect(tddPage.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
