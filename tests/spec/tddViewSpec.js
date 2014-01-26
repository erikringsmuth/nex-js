/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/tdd/tddView'
], function(describe, it, expect, TddView) {
  'use strict';

  describe('The TDD view', function() {
    it('should load', function() {
      expect(TddView).toBeDefined();
    });

    it('should have a layout view', function() {
      var tddView = new TddView();
      expect(tddView.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
