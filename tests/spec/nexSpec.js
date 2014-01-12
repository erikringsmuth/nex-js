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
      var TestView = Nex.View.extend({
        template: function(args) { return '<div>Hello ' + args.model.name + '</div>'; },
        model: {
          name: 'Erik Ringsmuth'
        }
      });
      var testView = new TestView().render();
      expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should process the function template with a constructor function model and add the result HTML to view.el', function() {
      var TestView = Nex.View.extend({
        template: function(args) { return '<div>Hello ' + args.model.name + '</div>'; },
        model: function() {
          this.name = 'Erik Ringsmuth';
        }
      });
      var testView = new TestView().render();
      expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should process the string template and add the result HTML to view.el', function() {
      var TestView = Nex.View.extend({
        template: '<div>Hello Erik Ringsmuth</div>'
      });
      var testView = new TestView().render();
      expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should render the layout view and attach the child to the layout', function() {
      var LayoutView = Nex.View.extend({
        template: '<div id="main-content"></div>',
        contentPlaceholderId: 'main-content'
      });
      var TestView = Nex.View.extend({
        template: 'Hello Erik Ringsmuth',
        layoutView: new LayoutView()
      });
      var testView = new TestView();
      testView.render();
      expect(testView.outerEl.innerHTML).toEqual('<div id="main-content"><div>Hello Erik Ringsmuth</div></div>');
    });

    it('should allow render to be overridden', function() {
      var TestView = Nex.View.extend({
        render: function() { this.el.innerHTML = '<div>Hello Erik Ringsmuth</div>'; }
      });
      var testView = new TestView();
      testView.render();
      expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should render the layout view and attach the child to the layout even if render is overridden', function() {
      var LayoutView = Nex.View.extend({
        template: '<div id="main-content"></div>',
        contentPlaceholderId: 'main-content'
      });
      var TestView = Nex.View.extend({
        render: function() { this.el.innerHTML = 'Hello Erik Ringsmuth'; },
        layoutView: new LayoutView()
      });
      var testView = new TestView();
      testView.render();
      expect(testView.outerEl.innerHTML).toEqual('<div id="main-content"><div>Hello Erik Ringsmuth</div></div>');
    });
  });

  describe('view.el', function() {
    var TestView = Nex.View.extend();
    var testView = new TestView();
    it('should default to a div', function() {
      expect(testView.el).toBeDefined();
      expect(testView.el.tagName).toEqual('DIV');
    });
  });

  describe('view.model', function() {
    var model = {
      property1: 'jon doe'
    };
    var TestView = Nex.View.extend({
      model: model
    });
    var testView = new TestView();
    it('should be set', function() {
      expect(testView.model).toEqual(model);
    });
  });

  describe('view.template()', function() {
    var TestView = Nex.View.extend();
    var testView = new TestView();
    it('should default to a compiled template (function) that returns an empty string', function() {
      expect(typeof(testView.template)).toEqual('function');
      expect(testView.template()).toEqual('');
    });
  });

  describe('view.events', function() {
    it('should attach delegate events to view.el and call the event handlers when the events are intercepted', function() {
      var extendingObject = {
        events: {
          'click span button#button1': 'buttonEventHandler'
        },
        template: '<span><button id="button1">Click Me!</button></span>',
        buttonEventHandler: function() {}
      };
      spyOn(extendingObject, 'buttonEventHandler');

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();
      testView.render();

      testView.dispatchMockEvent({
        type: 'click',
        target: testView.el.querySelector('#button1')
      });

      expect(testView.buttonEventHandler).toHaveBeenCalled();
    });
  });

  describe('view.layoutView', function() {
    it('should be defined and an instance of View', function() {
      var LayoutView = Nex.View.extend({
        contentPlaceholderId: '#main-content'
      });
      var TestView = Nex.View.extend({
        layoutView: new LayoutView()
      });
      var testView = new TestView();
      expect(testView.layoutView).toBeDefined();
      expect(testView.layoutView instanceof LayoutView).toBeTruthy();
    });

    it('should throw an exception if the layoutView itn\'t of type View', function() {
      var TestView = Nex.View.extend({
        layoutView: {}
      });
      expect(function() { new TestView(); }).toThrow();
    });

    it('should throw an exception if the layoutView doesn\'t have a contentPlaceholderId', function() {
      var LayoutView = Nex.View.extend();
      var TestView = Nex.View.extend({
        layoutView: new LayoutView()
      });
      expect(function() { new TestView(); }).toThrow();
    });

    it('should give the layout view a reference to the child view as layoutView.childView', function() {
      var LayoutView = Nex.View.extend({
        contentPlaceholderId: 'main-content'
      });
      var TestView = Nex.View.extend({
        layoutView: new LayoutView()
      });
      var testView = new TestView();
      var layoutView = testView.layoutView;
      expect(layoutView.childView).toEqual(testView);
    });
  });

  describe('view.outerEl', function() {
    it('should be view.el if no layout view is defined', function() {
      var TestView = Nex.View.extend();
      var testView = new TestView();
      expect(testView.outerEl).toEqual(testView.el);
    });

    it('should be layoutView.el if a layout view is defined', function() {
      var LayoutView = Nex.View.extend({
        contentPlaceholderId: 'main-content'
      });
      var TestView = Nex.View.extend({
        layoutView: new LayoutView()
      });
      var testView = new TestView();
      var layoutView = testView.layoutView;
      expect(testView.outerEl).toEqual(layoutView.el);
    });
  });

  describe('view.contentPlaceholderId', function() {
    it('should throw an exception if it\'s not a string', function() {
      var TestView = Nex.View.extend({
        contentPlaceholderId: {}
      });
      expect(function() { new TestView(); }).toThrow();
    });
  });

  describe('view.remove()', function() {
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
    testView.render();

    outerView.el.querySelector('#container').appendChild(testView.outerEl);

    testView.remove();
    it('should remove the view from anything it\'s attached to', function() {
      expect(outerView.el.querySelector('#container').innerHTML).toEqual('');
    });
  });

  describe('view.initialize()', function() {
    it('should be called when creating an instance of a view', function() {
      var extendingObject = {
        initialize: function initialize() {}
      };
      var TestView = Nex.View.extend(extendingObject);
      spyOn(extendingObject, 'initialize');
      var testView = new TestView('arg1', 'arg2');
      expect(testView.initialize).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('view.tagName', function() {
    it('should create view.el with that tagName', function() {
      var TestView = Nex.View.extend({
        tagName: 'span'
      });
      var testView = new TestView();
      expect(testView.el.tagName).toEqual('SPAN');
    });
  });

  describe('view.id', function() {
    it('should set the ID of view.el', function() {
      var TestView = Nex.View.extend({
        id: 'awesome-id'
      });
      var testView = new TestView();
      expect(testView.el.id).toEqual('awesome-id');
    });
  });

  describe('view.className', function() {
    it('should set the class of view.el', function() {
      var TestView = Nex.View.extend({
        className: 'awesome-class'
      });
      var testView = new TestView();
      expect(testView.el.className).toEqual('awesome-class');
    });
  });

  describe('view.dispatchMockEvent(mockEvent)', function() {
    it('should trigger a mock event that is handled by the event handlers', function() {
      var extendingObject = {
        events: {
          'click span button#button1': 'buttonEventHandler'
        },
        template: '<span><button id="button1">Click Me!</button></span>',
        buttonEventHandler: function() {}
      };
      spyOn(extendingObject, 'buttonEventHandler');

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();
      testView.render();

      testView.dispatchMockEvent({
        type: 'click',
        target: testView.el.querySelector('#button1')
      });

      expect(testView.buttonEventHandler).toHaveBeenCalled();
    });

    it('should throw an exception when no mockEvent.type is specified', function() {
      var extendingObject = {
        events: {
          'click span button#button1': 'buttonEventHandler'
        },
        template: '<span><button id="button1">Click Me!</button></span>',
        buttonEventHandler: function() {}
      };
      spyOn(extendingObject, 'buttonEventHandler');

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();
      testView.render();

      var testFunction = function() {
        testView.dispatchMockEvent({
          target: testView.el.querySelector('#button1')
        });
      };

      expect(testFunction).toThrow();
    });

    it('should throw an exception when no mockEvent.target is specified', function() {
      var extendingObject = {
        events: {
          'click span button#button1': 'buttonEventHandler'
        },
        template: '<span><button id="button1">Click Me!</button></span>',
        buttonEventHandler: function() {}
      };
      spyOn(extendingObject, 'buttonEventHandler');

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();
      testView.render();

      var testFunction = function() {
        testView.dispatchMockEvent({
          type: 'click'
        });
      };

      expect(testFunction).toThrow();
    });

    it('should throw an exception when there aren\'t any event handlers for that type', function() {
      var extendingObject = {
        events: {
          'click span button#button1': 'buttonEventHandler'
        },
        template: '<span><button id="button1">Click Me!</button></span>',
        buttonEventHandler: function() {}
      };
      spyOn(extendingObject, 'buttonEventHandler');

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();
      testView.render();

      var testFunction = function() {
        testView.dispatchMockEvent({
          type: 'hover',
          target: testView.el.querySelector('#button1')
        });
      };

      expect(testFunction).toThrow();
    });
  });

});
