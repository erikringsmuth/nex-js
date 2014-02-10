/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/home/homePage'
], function(describe, it, expect, HomePage) {
  'use strict';

  describe('The home view', function() {
    it('should load', function() {
      expect(HomePage).toBeDefined();
    });

    it('should have a layout view', function() {
      var homePage = new HomePage();
      expect(homePage.outerEl.querySelector('.navbar')).toBeTruthy();
    });

    it('should have the Todo MVC component', function() {
      var homePage = new HomePage();
      var todoMvcWidgetHtml = homePage.querySelector('#todoapp');
      expect(todoMvcWidgetHtml).toBeDefined();
    });
  });
});
