/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/download/downloadPage'
], function(describe, it, expect, DownloadPage) {
  'use strict';

  describe('The download page', function() {
    it('should load', function() {
      expect(DownloadPage).toBeDefined();
    });

    it('should have a layout page', function() {
      var downloadPage = new DownloadPage();
      expect(downloadPage.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
