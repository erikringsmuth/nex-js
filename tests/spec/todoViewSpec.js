/*global define*/
define([
  'jasmineAmd',
  'js/todo/todoView'
], function(jasmine, TodoView) {
  'use strict';

  var env = jasmine.getEnv(),
    describe = env.describe,
    it =  env.it,
    expect = env.expect;

  describe('The Todo MVC view', function() {
    it('should load', function() {
      expect(TodoView).toBeDefined();
    });
  });
});
