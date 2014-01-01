/*global define*/
define([
  'nex',
  'handlebars',
  './todoModel',
  'text!./todoTemplate.html',
  'todo/common'
], function(Nex, Handlebars, TodoModel, todoTemplate, common) {
  'use strict';

  return Nex.View.extend({
    // Delegate events bound to the root element of this view
    events: {
      'keypress #new-todo': 'createNewTodoOnEnter',
      'click #clear-completed': 'clearCompletedTodos',
      'click #toggle-all': 'toggleAllCompleteTodos',
      'click .toggle': 'toggleCompletedTodo',
      'dblclick label': 'editTodo',
      'click .destroy': 'deleteTodo',
      'keypress .edit': 'updateTodoOnEnter',
      'keydown .edit': 'revertTodoOnEscape',
      'blur .edit': 'leaveEditMode'
    },

    // The compiled handlebars template
    template: Handlebars.compile(todoTemplate),

    // The view's model
    model: new TodoModel().fetch(),

    // Create a new todo
    createNewTodoOnEnter: function createNewTodoOnEnter(event) {
      if (event.keyCode === common.ENTER_KEY) {
        var todo = {
          title: event.target.value.trim(),
          completed: false
        };
        if (todo.title) {
          this.model.todos.push(todo);
          this.model.save();
          this.render();
        }
      }
    },

    // Clear all completed todos
    clearCompletedTodos: function clearCompletedTodos() {
      this.model.todos = this.model.todos.filter(function(element) { return !element.completed; });
      this.model.save();
      this.render();
    },

    // Toggle all todos to completed or back to active if all are already completed
    toggleAllCompleteTodos: function toggleAllCompleteTodos(event) {
      this.model.todos.forEach(function(element) {
        element.completed = event.target.checked;
      });
      this.model.save();
      this.render();
    },

    // Toggles a todo to completed or active
    toggleCompletedTodo: function toggleCompletedTodo(event) {
      var index = this.getTodoIndex(event.target);
      this.model.todos[index].completed = event.target.checked;
      this.model.save();
      this.render();
    },

    // Switches a todo to edit mode
    editTodo: function editTodo(event) {
      var index = this.getTodoIndex(event.target);
      this.model.todos[index].editing = true;
      this.render();
    },

    // Remove a todo
    deleteTodo: function deleteTodo(event) {
      var index = this.getTodoIndex(event.target);
      this.model.todos.splice(index, 1);
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
        var todo = this.model.todos[this.getTodoIndex(event.target)];
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
    updateTodo: function updateTodoOnEnter(event) {
      var index = this.getTodoIndex(event.target);
      var todo = this.model.todos[index];
      todo.title = event.target.value.trim();
      todo.editing = false;

      // Delete the todo if it's empty
      if (!todo.title) {
        this.model.todos.splice(index, 1);
      }

      this.model.save();
      this.render();
    },

    // Helper method to get the todo's index from its HTML data-index attribute
    getTodoIndex: function getTodoIndex(element) {
      var parent = element.parentNode;
      if (parent.tagName === 'LI') {
        return parent.dataset.index;
      } else {
        return this.getTodoIndex(parent);
      }
    }
  });
});
