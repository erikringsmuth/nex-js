/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'amd/spyOn',
  'nex'
], function(describe, it, expect, spyOn, Nex) {
  'use strict';

  describe('Loading nex-js with an AMD loader like require.js', function() {
    it('should not add nex-js to the global scope', function() {
      expect(window.Nex).toBeUndefined();
    });
  });

  describe('Extending the base View', function() {
    it('should return a constructor function', function() {
      var TestView = Nex.View.extend();
      expect(typeof TestView).toEqual('function');
    });
  });

  describe('view.render()', function() {
    it('should process the function template with an object model and add the result HTML to view.el', function() {
      // Arrange
      var TestView = Nex.View.extend({
        template: function(args) { return '<div>Hello ' + args.model.name + '</div>'; },
        model: {
          name: 'Erik Ringsmuth'
        }
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should process the function template with a constructor function model and add the result HTML to view.el', function() {
      // Arrange
      var TestView = Nex.View.extend({
        template: function(args) { return '<div>Hello ' + args.model.name + '</div>'; },
        model: function() {
          this.name = 'Erik Ringsmuth';
        }
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should process the string template and add the result HTML to view.el', function() {
      // Arrange
      var TestView = Nex.View.extend({
        template: '<div>Hello Erik Ringsmuth</div>'
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should render the layout view and attach the child to the layout', function() {
      // Arrange
      var LayoutView = Nex.View.extend({
        template: '<div id="main-content"></div>',
        contentPlaceholderId: 'main-content'
      });
      var TestView = Nex.View.extend({
        template: 'Hello Erik Ringsmuth',
        layout: new LayoutView()
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.outerEl.innerHTML).toEqual('<div id="main-content"><div>Hello Erik Ringsmuth</div></div>');
    });

    it('should allow render to be overridden', function() {
      // Arrange
      var TestView = Nex.View.extend({
        render: function() { this.el.innerHTML = '<div>Hello Erik Ringsmuth</div>'; }
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should render the layout view and attach the child to the layout even if render is overridden', function() {
      // Arrange
      var LayoutView = Nex.View.extend({
        template: '<div id="main-content"></div>',
        contentPlaceholderId: 'main-content'
      });
      var TestView = Nex.View.extend({
        render: function() { this.el.innerHTML = 'Hello Erik Ringsmuth'; },
        layout: new LayoutView()
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.outerEl.innerHTML).toEqual('<div id="main-content"><div>Hello Erik Ringsmuth</div></div>');
    });
  });

  describe('view.el', function() {
    it('should default to a div', function() {
      // Arrange
      var TestView = Nex.View.extend();

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el).toBeDefined();
      expect(testView.el.tagName).toEqual('DIV');
    });
  });

  describe('view.model', function() {
    it('should be set', function() {
      // Arrange
      var model = {
        property1: 'jon doe'
      };
      var TestView = Nex.View.extend({
        model: model
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.model).toEqual(model);
    });
  });

  describe('view.template()', function() {
    it('should default to a compiled template (function) that returns an empty string', function() {
      // Arrange
      var TestView = Nex.View.extend();

      // Act
      var testView = new TestView();

      // Assert
      expect(typeof(testView.template)).toEqual('function');
      expect(testView.template()).toEqual('');
    });
  });

  describe('view.on', function() {
    it('should attach delegate events to view.el and call the event handlers when the events are intercepted', function() {
      // Arrange
      var extendingObject = {
        on: {
          'click span button#button1': function() {}
        },
        template: '<span><button id="button1">Click Me!</button></span>'
      };
      spyOn(extendingObject.on, 'click span button#button1');

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();

      // Act
      testView.dispatchMockEvent({
        type: 'click',
        target: testView.el.querySelector('#button1')
      });

      // Assert
      expect(testView.on['click span button#button1']).toHaveBeenCalled();
    });
  });

  describe('view.layout', function() {
    it('should be defined and an instance of View', function() {
      // Arrange
      var LayoutView = Nex.View.extend({
        template: '<div id="content"></div>',
        contentPlaceholderId: 'content'
      });
      var TestView = Nex.View.extend({
        layout: LayoutView
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.layout).toBeDefined();
      expect(testView.layout instanceof LayoutView).toBeTruthy();
    });

    it('should throw an exception if the layout itn\'t of type View', function() {
      // Arrange
      var TestView = Nex.View.extend({
        layout: {}
      });

      // Act, Assert
      expect(function() { new TestView(); }).toThrow();
    });

    it('should throw an exception if the layout doesn\'t have a contentPlaceholderId', function() {
      // Arrange
      var LayoutView = Nex.View.extend();
      var TestView = Nex.View.extend({
        layout: new LayoutView()
      });

      // Act, Assert
      expect(function() { new TestView(); }).toThrow();
    });

    it('should give the layout view a reference to the child view as layout.childView', function() {
      // Arrange
      var LayoutView = Nex.View.extend({
        template: '<div id="content"></div>',
        contentPlaceholderId: 'content'
      });
      var TestView = Nex.View.extend({
        layout: new LayoutView()
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.layout.childView).toEqual(testView);
    });
  });

  describe('view.outerEl', function() {
    it('should be view.el if no layout view is defined', function() {
      // Arrange
      var TestView = Nex.View.extend();

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.outerEl).toEqual(testView.el);
    });

    it('should be layout.el if a layout view is defined', function() {
      // Arrange
      var LayoutView = Nex.View.extend({
        template: '<div id="content"></div>',
        contentPlaceholderId: 'content'
      });
      var TestView = Nex.View.extend({
        layout: new LayoutView()
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.outerEl).toEqual(testView.layout.el);
    });
  });

  describe('view.contentPlaceholderId', function() {
    it('should throw an exception if it\'s not a string', function() {
      // Arrange
      var TestView = Nex.View.extend({
        contentPlaceholderId: {}
      });

      // Act, Assert
      expect(function() { new TestView(); }).toThrow();
    });
  });

  describe('view.remove()', function() {
    it('should remove the view from anything it\'s attached to', function() {
      // Arrange
      // Create an outer view
      var OuterView = Nex.View.extend({
        template: '<div id="container"></div>'
      });
      var outerView = new OuterView();
      outerView.render();

      // Create an inner view
      var TestView = Nex.View.extend({
        template: 'some text'
      });
      var testView = new TestView();

      outerView.el.querySelector('#container').appendChild(testView.outerEl);

      // Act
      testView.remove();

      // Assert
      expect(outerView.el.querySelector('#container').innerHTML).toEqual('');
    });
  });

  describe('view.html()', function() {
    it('should replace view.el\'s innerHTML', function() {
      // Arrange
      var TestView = Nex.View.extend({
        template: 'some text'
      });
      var testView = new TestView();

      // Act
      testView.html('<div id="main-content"><div>New content</div></div>');

      // Assert
      expect(testView.el.querySelector('#main-content').innerHTML).toEqual('<div>New content</div>');
    });
  });

  describe('view.initialize()', function() {
    it('should be called when creating an instance of a view', function() {
      // Arrange
      var extendingObject = {
        initialize: function initialize() {}
      };
      var TestView = Nex.View.extend(extendingObject);
      spyOn(extendingObject, 'initialize');

      // Act
      var testView = new TestView('arg1', 'arg2');

      // Assert
      expect(testView.initialize).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('view.tagName', function() {
    it('should create view.el with that tagName', function() {
      // Arrange
      var TestView = Nex.View.extend({
        tagName: 'span'
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el.tagName).toEqual('SPAN');
    });
  });

  describe('view.id', function() {
    it('should set the ID of view.el', function() {
      // Arrange
      var TestView = Nex.View.extend({
        id: 'awesome-id'
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el.id).toEqual('awesome-id');
    });
  });

  describe('view.className', function() {
    it('should set the class of view.el', function() {
      // Arrange
      var TestView = Nex.View.extend({
        className: 'awesome-class'
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el.className).toEqual('awesome-class');
    });
  });

  describe('view.autoRender', function() {
    it('should prevent the view from being rendered when an instance is created if it\'s set to false', function() {
      // Arrange
      var TestView = Nex.View.extend({
        template: '<div>this should not show up</div>',
        autoRender: false
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el.innerHTML).toEqual('');
    });
  });

  describe('view.dispatchMockEvent(mockEvent)', function() {
    it('should trigger a mock event that is handled by the event handlers', function() {
      // Arrange
      var extendingObject = {
        on: {
          'click span button#button1': function() {}
        },
        template: '<span><button id="button1">Click Me!</button></span>'
      };
      spyOn(extendingObject.on, 'click span button#button1');

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();

      // Act
      testView.dispatchMockEvent({
        type: 'click',
        target: testView.el.querySelector('#button1')
      });

      // Assert
      expect(testView.on['click span button#button1']).toHaveBeenCalled();
    });

    it('should throw an exception when no mockEvent.type is specified', function() {
      // Arrange
      var extendingObject = {
        on: {
          'click span button#button1': function() {}
        },
        template: '<span><button id="button1">Click Me!</button></span>'
      };

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();

      var testFunction = function() {
        testView.dispatchMockEvent({
          target: testView.el.querySelector('#button1')
        });
      };

      // Act, Assert
      expect(testFunction).toThrow();
    });

    it('should throw an exception when no mockEvent.target is specified', function() {
      // Arrange
      var extendingObject = {
        on: {
          'click span button#button1': function() {}
        },
        template: '<span><button id="button1">Click Me!</button></span>'
      };

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();

      var testFunction = function() {
        testView.dispatchMockEvent({
          type: 'click'
        });
      };

      // Act, Assert
      expect(testFunction).toThrow();
    });

    it('should throw an exception when there aren\'t any event handlers for that type', function() {
      // Arrange
      var extendingObject = {
        on: {
          'click span button#button1': function() {}
        },
        template: '<span><button id="button1">Click Me!</button></span>'
      };
      
      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();
      testView.render();

      var testFunction = function() {
        testView.dispatchMockEvent({
          type: 'hover',
          target: testView.el.querySelector('#button1')
        });
      };

      // Act, Assert
      expect(testFunction).toThrow();
    });
  });

});
