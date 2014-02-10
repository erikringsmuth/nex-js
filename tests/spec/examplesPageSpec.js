/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/examples/examplesPage'
], function(describe, it, expect, ExamplesPage) {
  'use strict';

  describe('The examples view', function() {
    it('should load', function() {
      expect(ExamplesPage).toBeDefined();
    });

    it('should have a layout view', function() {
      var examplesPage = new ExamplesPage();
      expect(examplesPage.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
