/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'amd/jasmine',
  'amd/spyOn',
  'Squire',
  'js/todo/todoApp',
  'js/todo/todoModel'
], function(describe, it, expect, jasmine, spyOn, Squire, TodoApp, TodoModel) {
  'use strict';

  describe('The Todo MVC', function() {
    describe('view', function() {
      it('should load', function() {
        expect(TodoApp).toBeDefined();
      });

      it('should fetch the model when creating a new instance of the view', function(done) {
        // Arrange
        var fetchSpy = jasmine.createSpy('fetch');
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return []; };
            model.itemsRemaining = function() { return 0; };
            model.itemsCompleted = function() { return 0; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = fetchSpy;
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            new TodoApp();

            // Assert
            expect(fetchSpy).toHaveBeenCalled();
            done();
          });
      });

      it('should create a new todo when the user enters a new todo', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return []; };
            model.itemsRemaining = function() { return 0; };
            model.itemsCompleted = function() { return 0; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            var newTodoInput = todoApp.querySelector('#new-todo');
            newTodoInput.value = 'my first todo!';
            todoApp.dispatchEvent({
              type: 'keypress',
              target: todoApp.querySelector('#new-todo'),
              keyCode: 13
            });

            // Assert
            expect(todoApp.model.todos.length).toEqual(1);
            expect(todoApp.model.todos[0].title).toEqual('my first todo!');
            done();
          });
      });

      it('should trim the text when creating a new todo', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return []; };
            model.itemsRemaining = function() { return 0; };
            model.itemsCompleted = function() { return 0; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            var newTodoInput = todoApp.querySelector('#new-todo');
            newTodoInput.value = 'my first todo!  ';
            todoApp.dispatchEvent({
              type: 'keypress',
              target: todoApp.querySelector('#new-todo'),
              keyCode: 13
            });

            // Assert
            expect(todoApp.model.todos.length).toEqual(1);
            expect(todoApp.model.todos[0].title).toEqual('my first todo!');
            done();
          });
      });

      it('should not create a todo if it is blank or whitespace', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return []; };
            model.itemsRemaining = function() { return 0; };
            model.itemsCompleted = function() { return 0; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            var newTodoInput = todoApp.querySelector('#new-todo');
            newTodoInput.value = '  ';
            todoApp.dispatchEvent({
              type: 'keypress',
              target: todoApp.querySelector('#new-todo'),
              keyCode: 13
            });

            // Assert
            expect(todoApp.model.todos.length).toEqual(0);
            done();
          });
      });

      it('should clear completed todos when the user clicks clear completed', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true },
              { title: 'code some more', completed: false },
              { title: 'and test everything!', completed: true }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            todoApp.dispatchEvent({
              type: 'click',
              target: todoApp.querySelector('button#clear-completed')
            });

            // Assert
            expect(todoApp.model.todos.length).toEqual(1);
            done();
          });
      });

      it('should toggle all completed todos when the user clicks toggle all completed todos', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true },
              { title: 'code some more', completed: false },
              { title: 'and test everything!', completed: true }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            var toggleCheckbox = todoApp.querySelector('input#toggle-all');
            toggleCheckbox.checked = true;
            todoApp.dispatchEvent({
              type: 'click',
              target: toggleCheckbox
            });

            // Assert
            expect(todoApp.model.todos.every(function(todo) { return todo.completed === true; })).toBeTruthy();
            done();
          });
      });

      it('should toggle a completed todo when the user clicks the toggle checkbox', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true, id: '1' },
              { title: 'code some more', completed: false, id: '2' },
              { title: 'and test everything!', completed: true, id: '3' }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            var toggleCheckbox = todoApp.querySelector('#todo-list li[data-id="2"] input.toggle');
            toggleCheckbox.checked = true;
            todoApp.dispatchEvent({
              type: 'click',
              target: toggleCheckbox
            });

            // Assert
            expect(todoApp.model.todos[1].completed).toBeTruthy();
            done();
          });
      });

      it('should switch the todo to edit mode when a user double clicks the todo', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true, id: '1' },
              { title: 'code some more', completed: false, id: '2' },
              { title: 'and test everything!', completed: true, id: '3' }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            todoApp.dispatchEvent({
              type: 'dblclick',
              target: todoApp.querySelector('#todo-list li[data-id="2"] label')
            });

            // Assert
            expect(todoApp.model.todos[1].editing).toBeTruthy();
            done();
          });
      });

      it('should update the todo when the user hits enter in edit mode', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true, id: '1' },
              { title: 'code some more', completed: false, id: '2', editing: true },
              { title: 'and test everything!', completed: true, id: '3' }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return true; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            var todoInput = todoApp.querySelector('#todo-list li[data-id="2"] input.edit');
            todoInput.value = 'changed item';
            todoApp.dispatchEvent({
              type: 'keypress',
              target: todoInput,
              keyCode: 13
            });

            // Assert
            expect(todoApp.model.todos[1].title).toEqual('changed item');
            done();
          });
      });

      it('should update the todo if the input is blured (looses focus) in edit mode', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true, id: '1' },
              { title: 'code some more', completed: false, id: '2', editing: true },
              { title: 'and test everything!', completed: true, id: '3' }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return true; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            var todoInput = todoApp.querySelector('#todo-list li[data-id="2"] input.edit');
            todoInput.value = 'changed item';
            todoApp.dispatchEvent({
              type: 'blur',
              target: todoInput
            });

            // Assert
            expect(todoApp.model.todos[1].title).toEqual('changed item');
            done();
          });
      });

      it('should revert the todo when the user hits escape in edit mode', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true, id: '1' },
              { title: 'code some more', completed: false, id: '2', editing: true },
              { title: 'and test everything!', completed: true, id: '3' }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return true; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            var todoInput = todoApp.querySelector('#todo-list li[data-id="2"] input.edit');
            todoInput.value = 'changed item';
            todoApp.dispatchEvent({
              type: 'keydown',
              target: todoInput,
              keyCode: 27
            });

            // Assert
            expect(todoApp.model.todos[1].title).toEqual('code some more');
            done();
          });
      });

      it('should delete the todo if it\'s empty or whitespace after exiting edit mode', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true, id: '1' },
              { title: 'code some more', completed: false, id: '2', editing: true },
              { title: 'and test everything!', completed: true, id: '3' }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return true; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            var todoInput = todoApp.querySelector('#todo-list li[data-id="2"] input.edit');
            todoInput.value = ' ';
            todoApp.dispatchEvent({
              type: 'keypress',
              target: todoInput,
              keyCode: 13
            });

            // Assert
            expect(todoApp.model.todos.length).toEqual(2);
            expect(todoApp.model.todos.some(function(todo) { return todo.id === '2'; })).toBeFalsy();
            done();
          });
      });

      it('should delete a todo when the user clicks the delete button', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true, id: '1' },
              { title: 'code some more', completed: false, id: '2' },
              { title: 'and test everything!', completed: true, id: '3' }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            var todoApp = new TodoApp();

            // Act
            todoApp.dispatchEvent({
              type: 'click',
              target: todoApp.querySelector('#todo-list li[data-id="2"] button.destroy')
            });

            // Assert
            expect(todoApp.model.todos.length).toEqual(2);
            expect(todoApp.model.todos[0].id).toEqual('1');
            expect(todoApp.model.todos[1].id).toEqual('3');
            done();
          });
      });
    });

    describe('template', function() {
      it('should autofocus on the new todo input when you aren\'t editing', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return []; };
            model.itemsRemaining = function() { return 0; };
            model.itemsCompleted = function() { return 0; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            expect(todoApp.querySelector('#new-todo').autofocus).toBeTruthy();
            done();
          });
      });

      it('should leave the toggle all checkbox unchecked if there are any active todos', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true },
              { title: 'code some more', completed: false },
              { title: 'and test everything!', completed: true }
            ];
            model.routes = {
              todoAll: function() { return false; },
              todoActive: function() { return false; },
              todoCompleted: function() { return true; }
            };
            model.filteredTodos = function() {
              return [
                { title: 'code something', completed: true },
                { title: 'and test everything!', completed: true }
              ];
            };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            expect(todoApp.querySelectorAll('#toggle-all').checked).toBeFalsy();
            done();
          });
      });

      it('should not display the main section or footer when there are no todos', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return []; };
            model.itemsRemaining = function() { return 0; };
            model.itemsCompleted = function() { return 0; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            expect(todoApp.querySelector('section#main')).toBeFalsy();
            expect(todoApp.querySelector('footer#footer')).toBeFalsy();
            done();
          });
      });

      it('should only display the filtered todos', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true },
              { title: 'code some more', completed: false },
              { title: 'and test everything!', completed: true }
            ];
            model.routes = {
              todoAll: function() { return false; },
              todoActive: function() { return false; },
              todoCompleted: function() { return true; }
            };
            model.filteredTodos = function() {
              return [
                { title: 'code something', completed: true },
                { title: 'and test everything!', completed: true }
              ];
            };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            expect(todoApp.querySelectorAll('#todo-list>li').length).toEqual(2);
            done();
          });
      });

      it('should check completed todos', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true },
              { title: 'code some more', completed: false },
              { title: 'and test everything!', completed: true }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            var checkedTodos = todoApp.querySelectorAll('#todo-list li input.toggle');
            expect(checkedTodos[0].checked).toBeTruthy();
            expect(checkedTodos[1].checked).toBeFalsy();
            expect(checkedTodos[2].checked).toBeTruthy();
            done();
          });
      });

      it('should autofocus on todos being edited', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true },
              { title: 'code some more', completed: false, editing: true },
              { title: 'and test everything!', completed: true }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            expect(todoApp.querySelector('#todo-list li.editing input.edit').autofocus).toBeTruthy();
            done();
          });
      });

      it('should show a count of the number of items remaining', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true },
              { title: 'code some more', completed: false },
              { title: 'and test everything!', completed: true }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            expect(todoApp.querySelector('#todo-count strong').innerText).toEqual('1');
            done();
          });
      });

      it('should display the active filter in bold', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true },
              { title: 'code some more', completed: false },
              { title: 'and test everything!', completed: true }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            expect(todoApp.querySelector('#filters a.selected').innerText).toEqual('All');
            done();
          });
      });

      it('should have a clear completed button if there are completed todos', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: true },
              { title: 'code some more', completed: false },
              { title: 'and test everything!', completed: true }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 1; };
            model.itemsCompleted = function() { return 2; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            expect(todoApp.querySelector('#clear-completed')).not.toBeNull();
            done();
          });
      });

      it('should not display the clear completed button if there are no completed todos', function(done) {
        // Arrange
        new Squire()
          .mock('js/todo/todoModel', function TodoModel() {
            var model = this;
            model.todos = [
              { title: 'code something', completed: false },
              { title: 'code some more', completed: false },
              { title: 'and test everything!', completed: false }
            ];
            model.routes = {
              todoAll: function() { return true; },
              todoActive: function() { return false; },
              todoCompleted: function() { return false; }
            };
            model.filteredTodos = function() { return model.todos; };
            model.itemsRemaining = function() { return 3; };
            model.itemsCompleted = function() { return 0; };
            model.editing = function() { return false; };
            model.itemsRemainingText = function() { return 'items left'; };
            model.fetch = function() { return model; };
            model.save = function() { return model; };
          })
          .require(['js/todo/todoApp'], function(TodoApp) {
            // Act
            var todoApp = new TodoApp();

            // Assert
            expect(todoApp.querySelector('#clear-completed')).toBeNull();
            done();
          });
      });
    });

    describe('model', function() {
      it('filtered todos should return all todos when using the all todos filter', function() {
        // Arrange
        var model = new TodoModel();
        model.filter = 'all';
        model.todos = [
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ];

        // Act, Assert
        expect(model.filteredTodos().length).toEqual(3);
      });

      it('filtered todos should return the completed todos when using the completed filter', function() {
        // Arrange
        var model = new TodoModel();
        model.filter = 'completed';
        model.todos = [
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ];

        // Act, Assert
        expect(model.filteredTodos().length).toEqual(2);
      });

      it('filtered todos should return the active todos when using the active filter', function() {
        // Arrange
        var model = new TodoModel();
        model.filter = 'active';
        model.todos = [
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ];

        // Act, Assert
        expect(model.filteredTodos().length).toEqual(1);
      });

      it('items remaining should be a count of the active todos', function() {
        // Arrange
        var model = new TodoModel();
        model.todos = [
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ];

        // Act, Assert
        expect(model.itemsRemaining()).toEqual(1);
      });

      it('items completed should be a count of the completed todos', function() {
        // Arrange
        var model = new TodoModel();
        model.todos = [
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ];

        // Act, Assert
        expect(model.itemsCompleted()).toEqual(2);
      });

      it('editing should be true if any todos are in editing mode', function() {
        // Arrange
        var model = new TodoModel();
        model.todos = [
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false, editing: true },
          { title: 'and test everything!', completed: true }
        ];

        // Act, Assert
        expect(model.editing()).toBeTruthy();
      });

      it('items remaining text should be pluralized when there are 0 or multiple todos left', function() {
        // Arrange
        var model = new TodoModel();
        model.todos = [
          { title: 'code something', completed: false },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ];

        // Act, Assert
        expect(model.itemsRemainingText()).toEqual('items left');
      });

      it('items remaining text should not be pluralized when there is only 1 todo left', function() {
        // Arrange
        var model = new TodoModel();
        model.todos = [
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ];

        // Act, Assert
        expect(model.itemsRemainingText()).toEqual('item left');
      });

      it('fetch should retrieve todos from localStorage', function() {
        // Arrange
        var todos = JSON.stringify([
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ]);
        spyOn(window.localStorage, 'getItem').and.returnValue(todos);
        var model = new TodoModel();

        // Act
        model.fetch();

        // Assert
        expect(window.localStorage.getItem).toHaveBeenCalled();
        expect(model.todos.length).toEqual(3);
        expect(model.todos[0].title = 'code something');
      });

      it('save should write todos to localStorage', function() {
        // Arrange
        spyOn(window.localStorage, 'setItem');
        var model = new TodoModel();
        model.todos = [
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ];

        // Act
        model.save();

        // Assert
        expect(window.localStorage.setItem).toHaveBeenCalled();
      });

      it('save should not persist edit mode', function() {
        // Arrange
        spyOn(window.localStorage, 'setItem');
        var model = new TodoModel();
        model.todos = [
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false, editing: true },
          { title: 'and test everything!', completed: true }
        ];

        // Act
        model.save();

        // Assert
        var savedTodos = JSON.parse(window.localStorage.setItem.calls.argsFor(0)[1]);
        expect(savedTodos.some(function(todo) { return todo.editing; })).toBeFalsy();
      });
    });
  });
});
