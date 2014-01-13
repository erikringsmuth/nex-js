/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'amd/jasmine',
  'amd/spyOn',
  'Squire',
  'js/todo/todoView'
], function(describe, it, expect, jasmine, spyOn, Squire, TodoView) {
  'use strict';

  describe('The Todo MVC', function() {
    describe('view', function() {
      it('should load', function() {
        expect(TodoView).toBeDefined();
      });

      it('should fetch the model when creating a new instance of the view', function(done) {
        var fetchSpy = jasmine.createSpy('fetch');
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
          model.fetch = fetchSpy;
          model.save = function() { return model; };
        })
        .require(['js/todo/todoView'], function(TodoView) {
          new TodoView();
          expect(fetchSpy).toHaveBeenCalled();
          done();
        });
      });

      it('should create a new todo when the user enters a new todo', function(done) {
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

          var newTodoInput = todoView.el.querySelector('#new-todo');
          newTodoInput.value = 'my first todo!';
          todoView.dispatchMockEvent({
            type: 'keypress',
            target: todoView.el.querySelector('#new-todo'),
            keyCode: 13
          });

          expect(todoView.model.todos.length).toEqual(1);
          expect(todoView.model.todos[0].title).toEqual('my first todo!');
          done();
        });
      });

      it('should clear completed todos when the user clicks clear completed', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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

          todoView.dispatchMockEvent({
            type: 'click',
            target: todoView.el.querySelector('button#clear-completed')
          });

          expect(todoView.model.todos.length).toEqual(1);
          done();
        });
      });

      it('should toggle all completed todos when the user clicks toggle all completed todos', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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

          var toggleCheckbox = todoView.el.querySelector('input#toggle-all');
          toggleCheckbox.checked = true;
          todoView.dispatchMockEvent({
            type: 'click',
            target: toggleCheckbox
          });

          expect(todoView.model.todos.every(function(todo) { return todo.completed === true; })).toBeTruthy();
          done();
        });
      });

      it('should toggle a completed todo when the user clicks the toggle checkbox', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true, id: '1' },
            { title: 'code some more', completed: false, id: '2' },
            { title: 'and test everything!', completed: true, id: '3' }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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

          var toggleCheckbox = todoView.el.querySelector('#todo-list li[data-id="2"] input.toggle');
          toggleCheckbox.checked = true;
          todoView.dispatchMockEvent({
            type: 'click',
            target: toggleCheckbox
          });

          expect(todoView.model.todos[1].completed).toBeTruthy();
          done();
        });
      });

      it('should switch the todo to edit mode when a user double clicks the todo', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true, id: '1' },
            { title: 'code some more', completed: false, id: '2' },
            { title: 'and test everything!', completed: true, id: '3' }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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

          todoView.dispatchMockEvent({
            type: 'dblclick',
            target: todoView.el.querySelector('#todo-list li[data-id="2"] label')
          });

          expect(todoView.model.todos[1].editing).toBeTruthy();
          done();
        });
      });

      it('should delete a todo when the user clicks the delete button', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true, id: '1' },
            { title: 'code some more', completed: false, id: '2' },
            { title: 'and test everything!', completed: true, id: '3' }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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

          todoView.dispatchMockEvent({
            type: 'click',
            target: todoView.el.querySelector('#todo-list li[data-id="2"] button.destroy')
          });

          expect(todoView.model.todos.length).toEqual(2);
          expect(todoView.model.todos[0].id).toEqual('1');
          expect(todoView.model.todos[1].id).toEqual('3');
          done();
        });
      });

      it('should update the todo when the user hits enter', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true, id: '1' },
            { title: 'code some more', completed: false, id: '2', editing: true },
            { title: 'and test everything!', completed: true, id: '3' }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
          model.itemsRemaining = function() { return 1; };
          model.itemsCompleted = function() { return 2; };
          model.editing = function() { return true; };
          model.itemsRemainingText = function() { return 'items left'; };
          model.fetch = function() { return model; };
          model.save = function() { return model; };
        })
        .require(['js/todo/todoView'], function(TodoView) {
          var todoView = new TodoView();
          todoView.render();

          var todoInput = todoView.el.querySelector('#todo-list li[data-id="2"] input.edit');
          todoInput.value = 'changed item';
          todoView.dispatchMockEvent({
            type: 'keypress',
            target: todoInput,
            keyCode: 13
          });

          expect(todoView.model.todos[1].title).toEqual('changed item');
          done();
        });
      });

      it('should revert the todo when the user hits escape', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true, id: '1' },
            { title: 'code some more', completed: false, id: '2', editing: true },
            { title: 'and test everything!', completed: true, id: '3' }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
          model.itemsRemaining = function() { return 1; };
          model.itemsCompleted = function() { return 2; };
          model.editing = function() { return true; };
          model.itemsRemainingText = function() { return 'items left'; };
          model.fetch = function() { return model; };
          model.save = function() { return model; };
        })
        .require(['js/todo/todoView'], function(TodoView) {
          var todoView = new TodoView();
          todoView.render();

          var todoInput = todoView.el.querySelector('#todo-list li[data-id="2"] input.edit');
          todoInput.value = 'changed item';
          todoView.dispatchMockEvent({
            type: 'keydown',
            target: todoInput,
            keyCode: 27
          });

          expect(todoView.model.todos[1].title).toEqual('code some more');
          done();
        });
      });
    });

    describe('template', function() {
      it('should autofocus on the new todo input when you aren\'t editing', function(done) {
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
          expect(todoView.el.querySelector('#new-todo').autofocus).toBeTruthy();
          done();
        });
      });

      it('should leave the toggle all checkbox unchecked if there are any active todos', function(done) {
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
          expect(todoView.el.querySelectorAll('#toggle-all').checked).toBeFalsy();
          done();
        });
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

      it('should check completed todos', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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
          var checkedTodos = todoView.el.querySelectorAll('#todo-list li input.toggle');
          expect(checkedTodos[0].checked).toBeTruthy();
          expect(checkedTodos[1].checked).toBeFalsy();
          expect(checkedTodos[2].checked).toBeTruthy();
          done();
        });
      });

      it('should autofocus on todos being edited', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false, editing: true },
            { title: 'and test everything!', completed: true }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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
          expect(todoView.el.querySelector('#todo-list li.editing input.edit').autofocus).toBeTruthy();
          done();
        });
      });

      it('should show a count of the number of items remaining', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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
          expect(todoView.el.querySelector('#todo-count strong').innerText).toEqual('1');
          done();
        });
      });

      it('should display the active filter in bold', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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
          expect(todoView.el.querySelector('#filters a.selected').innerText).toEqual('All');
          done();
        });
      });

      it('should have a clear completed button if there are completed todos', function(done) {
        new Squire().mock('js/todo/todoModel', function TodoModel() {
          var model = this;
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          model.routes = {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          };
          model.filteredTodos = function() { return model.todos; };
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
          expect(todoView.el.querySelector('#clear-completed')).not.toBeNull();
          done();
        });
      });
    });

    describe('model', function() {
      it('filtered todos should return all todos when using the all todos filter', function(done) {
        new Squire().mock('router', {
          routes: {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          }
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          expect(model.filteredTodos().length).toEqual(3);
          done();
        });
      });

      it('filtered todos should return the completed todos when using the completed filter', function(done) {
        new Squire().mock('router', {
          routes: {
            todoAll: { matchesUrl: function() { return false; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return true; } }
          }
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          expect(model.filteredTodos().length).toEqual(2);
          done();
        });
      });

      it('filtered todos should return the active todos when using the active filter', function(done) {
        new Squire().mock('router', {
          routes: {
            todoAll: { matchesUrl: function() { return false; } },
            todoActive: { matchesUrl: function() { return true; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          }
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          expect(model.filteredTodos().length).toEqual(1);
          done();
        });
      });

      it('items remaining should be a count of the active todos', function(done) {
        new Squire().mock('router', {
          routes: {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          }
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          expect(model.itemsRemaining()).toEqual(1);
          done();
        });
      });

      it('items completed should be a count of the completed todos', function(done) {
        new Squire().mock('router', {
          routes: {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          }
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          expect(model.itemsCompleted()).toEqual(2);
          done();
        });
      });

      it('editing should be true if any todos are in editing mode', function(done) {
        new Squire().mock('router', {
          routes: {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          }
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false, editing: true },
            { title: 'and test everything!', completed: true }
          ];
          expect(model.editing()).toBeTruthy();
          done();
        });
      });

      it('items remaining text should be pluralized when there are 0 or multiple todos left', function(done) {
        new Squire().mock('router', {
          routes: {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          }
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: false },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          expect(model.itemsRemainingText()).toEqual('items left');
          done();
        });
      });

      it('items remaining text should not be pluralized when there is only 1 todo left', function(done) {
        new Squire().mock('router', {
          routes: {
            todoAll: { matchesUrl: function() { return true; } },
            todoActive: { matchesUrl: function() { return false; } },
            todoCompleted: { matchesUrl: function() { return false; } }
          }
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          expect(model.itemsRemainingText()).toEqual('item left');
          done();
        });
      });

      it('fetch should retrieve todos from localStorage', function(done) {
        var todos = JSON.stringify([
          { title: 'code something', completed: true },
          { title: 'code some more', completed: false },
          { title: 'and test everything!', completed: true }
        ]);
        spyOn(window.localStorage, 'getItem').and.returnValue(todos);

        new Squire().mock('router', {
          routes: {}
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.fetch();
          expect(window.localStorage.getItem).toHaveBeenCalled();
          expect(model.todos.length).toEqual(3);
          expect(model.todos[0].title = 'code something');
          done();
        });
      });

      it('save should write todos to localStorage', function(done) {
        spyOn(window.localStorage, 'setItem');

        new Squire().mock('router', {
          routes: {}
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false },
            { title: 'and test everything!', completed: true }
          ];
          model.save();
          expect(window.localStorage.setItem).toHaveBeenCalled();
          done();
        });
      });

      it('save should not persist edit mode', function(done) {
        spyOn(window.localStorage, 'setItem');

        new Squire().mock('router', {
          routes: {}
        })
        .require(['js/todo/todoModel'], function(TodoModel) {
          var model = new TodoModel();
          model.todos = [
            { title: 'code something', completed: true },
            { title: 'code some more', completed: false, editing: true },
            { title: 'and test everything!', completed: true }
          ];
          model.save();
          var savedTodos = JSON.parse(window.localStorage.setItem.calls.argsFor(0)[1]);
          expect(savedTodos.some(function(todo) { return todo.editing; })).toBeFalsy();
          done();
        });
      });
    });
  });
});
