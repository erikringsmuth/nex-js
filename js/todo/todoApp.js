/*global define*/
define([
  'nex',
  'handlebars',
  './todoModel',
  'text!./todoTemplate.html',
  './common'
], function(Nex, Handlebars, TodoModel, todoTemplate, common) {
  'use strict';

  return Nex.defineComponent('todo-app', {
    // The compiled template
    template: Handlebars.compile(todoTemplate),

    // Get the model during initialization
    model: new TodoModel().fetch(),

    // Create a new todo
    createNewTodoOnEnter: function createNewTodoOnEnter(event) {
      if (event.keyCode === common.ENTER_KEY && event.target.value.trim()) {
        var todo = {
          id: common.guid(),
          title: event.target.value.trim(),
          completed: false
        };
        this.model.todos.push(todo);
        this.model.save();
        this.render();
      }
    },

    // Clear all completed todos
    clearCompletedTodos: function clearCompletedTodos() {
      this.model.todos = this.model.todos.filter(function(todo) { return !todo.completed; });
      this.model.save();
      this.render();
    },

    // Toggle all todos to completed or back to active if all are already completed
    toggleAllCompleteTodos: function toggleAllCompleteTodos(event) {
      this.model.todos.forEach(function(todo) { todo.completed = event.target.checked; });
      this.model.save();
      this.render();
    },

    // Toggles a todo to completed or active
    toggleCompletedTodo: function toggleCompletedTodo(event) {
      this.getTodo(event.target).completed = event.target.checked;
      this.model.save();
      this.render();
    },

    // Switches a todo to edit mode
    editTodo: function editTodo(event) {
      this.getTodo(event.target).editing = true;
      this.render();
    },

    // Remove a todo
    deleteTodo: function deleteTodo(event) {
      this.model.todos.splice(this.model.todos.indexOf(this.getTodo(event.target)), 1);
      this.model.save();
      this.render();
    },

    // Update the todo if the enter was pressed and delete if empty
    updateTodoOnEnter: function updateTodoOnEnter(event) {
      if (event.keyCode === common.ENTER_KEY) {
        this.updateTodo(event);
      }
    },

    // Discard changes if escape was pressed
    revertTodoOnEscape: function revertTodoOnEscape(event) {
      if (event.keyCode === common.ESCAPE_KEY) {
        var todo = this.getTodo(event.target);
        todo.editing = false;
        event.target.value = todo.title;
        this.render();
      }
    },

    // Exit edit mode on a todo
    leaveEditMode: function leaveEditMode(event) {
      this.updateTodo(event);
    },

    // Update the todo or delete if empty
    updateTodo: function updateTodo(event) {
      var todo = this.getTodo(event.target);
      todo.title = event.target.value.trim();
      todo.editing = false;

      // Delete the todo if it's empty
      if (!todo.title) {
        this.model.todos.splice(this.model.todos.indexOf(todo), 1);
      }

      this.model.save();
      this.render();
    },

    // Helper method to get the todo using the element's HTML data-id attribute
    getTodo: function getTodo(element) {
      var parent = element.parentNode;
      if (parent.tagName === 'LI') {
        return this.model.todos.filter(function(todo) { return parent.dataset.id === todo.id; })[0];
      } else {
        return this.getTodo(parent);
      }
    }
  });
});
