/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/home/homeView'
], function(describe, it, expect, HomeView) {
  'use strict';

  describe('The home view', function() {
    it('should load', function() {
      expect(HomeView).toBeDefined();
    });

    it('should have a layout view', function() {
      var homeView = new HomeView();
      expect(homeView.outerEl.querySelector('.navbar')).toBeTruthy();
    });

    it('should render the Todo MVC widget', function() {
      var homeView = new HomeView();
      var todoMvcWidgetHtml = homeView.el.querySelector('#todoapp');
      expect(todoMvcWidgetHtml).toBeDefined();
    });
  });
});
