/*global define*/
define([
  'jasmineAmd',
  'js/download/downloadView'
], function(jasmine, DownloadView) {
  'use strict';

  var env = jasmine.getEnv(), describe = env.describe, it =  env.it, expect = env.expect;

  describe('The download view', function() {
    it('should load', function() {
      expect(DownloadView).toBeDefined();
    });

    it('should have a layout view', function() {
      var downloadView = new DownloadView();
      downloadView.render();
      expect(downloadView.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
