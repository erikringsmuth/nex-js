/*global define*/
define([
  './common',
  'router'
], function(common, router) {
  'use strict';

  return function TodoModel() {
    var model = this;

    // Fields
    model.todos = [];

    // Properties

    model.routes = router.routes;

    // Filter the displayed todos based on the route
    model.filteredTodos = function() {
      if (model.routes.todoAll.matchesUrl()) return model.todos;
      if (model.routes.todoActive.matchesUrl()) return model.todos.filter(function(todo) { return !todo.completed; });
      if (model.routes.todoCompleted.matchesUrl()) return model.todos.filter(function(todo) { return todo.completed; });
    };

    model.itemsRemaining = function() {
      return model.todos.reduce(function(previous, current) { return previous + !current.completed; }, 0);
    };

    model.itemsCompleted = function() {
      return model.todos.reduce(function(previous, current) { return previous + current.completed; }, 0);
    };

    model.editing = function() {
      return model.todos.some(function(todo) { return todo.editing; });
    };

    // Set the item(s) left text
    model.itemsRemainingText = function() {
      return (model.itemsRemaining() === 1) ? 'item left' : 'items left';
    };

    // Extension methods

    // Retrieve the model from localStorage
    model.fetch = function fetch() {
      model.todos = JSON.parse(window.localStorage.getItem(common.LOCAL_STORAGE_KEY)) || [];
      return model;
    };

    // Persist the model to localStorage
    model.save = function save() {
      // Don't persist edit mode
      model.todos.forEach(function(todo) {
        delete todo.editing;
      });

      window.localStorage.setItem(common.LOCAL_STORAGE_KEY, JSON.stringify(model.todos));

      return model;
    };
  };
});
