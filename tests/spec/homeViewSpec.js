/*global define*/
define([
  'jasmineAmd',
  'js/home/homeView'
], function(jasmine, HomeView) {
  'use strict';

  var env = jasmine.getEnv(), describe = env.describe, it =  env.it, expect = env.expect;

  describe('The home view', function() {
    it('should load', function() {
      expect(HomeView).toBeDefined();
    });

    it('should have a layout view', function() {
      var homeView = new HomeView();
      homeView.render();
      expect(homeView.outerEl.querySelector('.navbar')).toBeTruthy();
    });

    it('should render the Todo MVC widget', function() {
      var homeView = new HomeView();
      homeView.render();
      var todoMvcWidgetHtml = homeView.el.querySelector('#todoapp');
      expect(todoMvcWidgetHtml).toBeDefined();
    });
  });
});
