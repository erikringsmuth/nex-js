/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/download/downloadView'
], function(describe, it, expect, DownloadView) {
  'use strict';

  describe('The download view', function() {
    it('should load', function() {
      expect(DownloadView).toBeDefined();
    });

    it('should have a layout view', function() {
      var downloadView = new DownloadView();
      expect(downloadView.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
