/*global define*/
define([
  'jasmineAmd',
  'Squire',
  'js/todo/todoView'
], function(jasmine, Squire, TodoView) {
  'use strict';

  var env = jasmine.getEnv(), describe = env.describe, it = env.it, expect = env.expect;

  describe('The Todo MVC view', function() {
    it('should load', function() {
      expect(TodoView).toBeDefined();
    });

    it('should not display the main section or footer when there are no todos', function(done) {
      new Squire().mock('js/todo/todoModel', function TodoModel() {
        var model = this;
        model.todos = [];
        model.routes = {
          todoAll: { matchesUrl: function() { return true; } },
          todoActive: { matchesUrl: function() { return false; } },
          todoCompleted: { matchesUrl: function() { return false; } }
        };
        model.filteredTodos = function() { return []; };
        model.itemsRemaining = function() { return 0; };
        model.itemsCompleted = function() { return 0; };
        model.editing = function() { return false; };
        model.itemsRemainingText = function() { return 'items left'; };
        model.fetch = function() { return model; };
        model.save = function() { return model; };
      })
      .require(['js/todo/todoView'], function(TodoView) {
        var todoView = new TodoView();
        todoView.render();
        expect(todoView.el.querySelector('section#main')).toBeFalsy();
        expect(todoView.el.querySelector('footer#footer')).toBeFalsy();
        done();
      });
    });
  });
});
