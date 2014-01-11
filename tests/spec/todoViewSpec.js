/*global define*/
define([
  'jasmineAmd',
  'Squire',
  'js/todo/todoView'
], function(jasmine, Squire, TodoView) {
  'use strict';

  var env = jasmine.getEnv(), describe = env.describe, it = env.it, expect = env.expect;

  describe('The Todo MVC', function() {
    describe('view', function() {
      it('should load', function() {
        expect(TodoView).toBeDefined();
      });

      it('should fetch the model when creating a new instance of the view');

      it('should create a new todo when the user enters a new todo');

      it('should clear completed todos when the user clicks clear completed');

      it('should toggle all completed todos when the user clicks toggle all completed todos');

      it('should toggle a completed todo when the user clicks the toggle checkbox');

      it('should switch the todo to edit mode when a user double clicks the todo');

      it('should delete a todo when the user clicks the delete button');

      it('should update the todo when the user hits enter');

      it('should revert the todo when the user hits escape');
    });

    describe('template', function() {
      it('should autofocus on the new todo input unless you are editing');

      it('should leave the toggle all checkbox unchecked if there are any active todos');

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

      it('should only display the filtered todos', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return false; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return true; } }
          };
          model.filteredTodos = function() { return [
            { title: 'code something', completed: true },
            { title: 'and test everything!', completed: true }
          ]; };
          model.itemsRemaining = function() { return 1; };
          model.itemsCompleted = function() { return 2; };
          model.editing = function() { return false; };
          model.itemsRemainingText = function() { return 'items left'; };
          model.fetch = function() { return model; };
          model.save = function() { return model; };
        })
        .require(['js/todo/todoView'], function(TodoView) {
          var todoView = new TodoView();
          todoView.render();
          expect(todoView.el.querySelectorAll('#todo-list>li').length).toEqual(2);
          done();
        });
      });

      it('should check completed todos');

      it('should autofocus on todos being edited');

      it('should show a count of the number of items remaining');

      it('should display the active filter in bold');

      it('should have a clear completed button if there are completed todos');
    });

    describe('model', function() {
      it('filtered todos should return all todos when using the all todos filter');

      it('filtered todos should return the completed todos when using the completed filter');

      it('filtered todos should return the active todos when using the active filter');

      it('items remaining should be a count of the active todos');

      it('items completed should be a count of the completed todos');

      it('editing should be true if any todos are in editing mode');

      it('items remaining text should correctly pluralize "item(s)" depending on the todo count');

      it('fetch should retrieve todos from localStorage');

      it('save should write todos to localStorage');
    });
  });
});
