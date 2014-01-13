/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/examples/examplesView'
], function(describe, it, expect, ExamplesView) {
  'use strict';

  describe('The examples view', function() {
    it('should load', function() {
      expect(ExamplesView).toBeDefined();
    });

    it('should have a layout view', function() {
      var examplesView = new ExamplesView();
      examplesView.render();
      expect(examplesView.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
