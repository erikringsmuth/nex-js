/*global define*/
define([
  'jasmineAmd',
  'js/home/homeView'
], function(jasmine, HomeView) {
  'use strict';

  var describe = jasmine.describe,
      it =  jasmine.it,
      expect = jasmine.expect;

  describe('The home view', function() {
    it('should be defined', function() {
      expect(HomeView).toBeDefined();
    });

    it('should have a layout view', function() {
      var homeView = new HomeView();
      homeView.render();
      expect(homeView.outerEl.querySelector('.navbar')).not.toBeFalsy();
    });

    it('should render the Todo MVC widget', function() {
      var homeView = new HomeView();
      homeView.render();
      var todoMvcWidgetHtml = homeView.el.querySelector('#todoapp');
      expect(todoMvcWidgetHtml).toBeDefined();
    });
  });
});
