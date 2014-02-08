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
        contentPlaceholder: '#main-content'
      });
      var TestView = Nex.View.extend({
        template: 'Hello Erik Ringsmuth',
        layout: LayoutView
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
        contentPlaceholder: '#main-content'
      });
      var TestView = Nex.View.extend({
        render: function() { this.el.innerHTML = 'Hello Erik Ringsmuth'; },
        layout: LayoutView
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

  describe('view.layout', function() {
    it('should be defined and an instance of View', function() {
      // Arrange
      var LayoutView = Nex.View.extend({
        template: '<div id="content"></div>',
        contentPlaceholder: '#content'
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

    it('should throw an exception if the layout doesn\'t have a contentPlaceholder', function() {
      // Arrange
      var LayoutView = Nex.View.extend();
      var TestView = Nex.View.extend({
        layout: LayoutView
      });

      // Act, Assert
      expect(function() { new TestView(); }).toThrow();
    });

    it('should give the layout view a reference to the child view as layout._initializedComponents[layout.contentPlaceholder]', function() {
      // Arrange
      var LayoutView = Nex.View.extend({
        template: '<div id="content"></div>',
        contentPlaceholder: '#content'
      });
      var TestView = Nex.View.extend({
        layout: LayoutView
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.layout._initializedComponents['#content']).toEqual(testView);
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
        contentPlaceholder: '#content'
      });
      var TestView = Nex.View.extend({
        layout: LayoutView
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.outerEl).toEqual(testView.layout.el);
    });
  });

  describe('view.contentPlaceholder', function() {
    it('should throw an exception if it\'s not a string', function() {
      // Arrange
      var TestView = Nex.View.extend({
        contentPlaceholder: {}
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

    it('should parse the HTML for event attributes', function() {
      // Arrange
      var TestView = Nex.View.extend();
      var testView = new TestView();
      spyOn(Nex.utilities, 'parseEventTypes').and.returnValue([]);

      // Act
      testView.html('<input type="text" on-keypress="keypressCallback">');

      // Assert
      expect(Nex.utilities.parseEventTypes).toHaveBeenCalled();
    });
  });

  describe('view.attachTo(selector)', function() {
    it('should attach the view to the element', function() {
      // Arrange
      var OuterView = Nex.View.extend({
        template: '<div id="placeholder"></div>'
      });
      var InnerView = Nex.View.extend({
        template: 'inner text'
      });
      var outerView = new OuterView();

      // Act
      new InnerView().attachTo(outerView.el.querySelector('#placeholder'));

      // Assert
      expect(outerView.el.innerHTML).toEqual('<div id="placeholder"><div>inner text</div></div>');
    });

    it('should throw an exception when the argument isn\'t a selector or element', function() {
      // Arrange
      var TestView = Nex.View.extend({
        template: 'inner text'
      });
      var testView = new TestView();
      var testFunction = function() {
        testView.attachTo({ prop: 'this isn\'t a selector or element' });
      };

      // Act, Assert
      expect(testFunction).toThrow();
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

  describe('view.components', function() {
    it('should create instances of the components and attach them to this view', function() {
      // Arrange
      var TestComponent = Nex.View.extend({
        template: 'A component'
      });
      var TestView = Nex.View.extend({
        template: '<div>Some components will go in the placeholder</div><div id="widget"></div>',
        components: {
          '#widget': TestComponent
        }
      });

      // Act
      var testView = new TestView();

      // Assert
      expect(testView.el.innerHTML).toEqual('<div>Some components will go in the placeholder</div><div id="widget"><div>A component</div></div>');
    });

    it('should throw an exception when rendering if a selector doesn\'t match any elements', function() {
      // Arrange
      var TestComponent = Nex.View.extend({
        template: 'A component'
      });
      var TestView = Nex.View.extend({
        template: '<div>Some components will go in the placeholder</div><div id="widget"></div>',
        components: {
          'bad-selector': TestComponent
        }
      });

      // Act
      var testFunction = function() { new TestView(); };

      // Assert
      expect(testFunction).toThrow();
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

  describe('view.dispatchEvent(event)', function() {
    it('should delegate the event to it\'s event handler', function() {
      // Arrange
      var extendingObject = {
        template: '<span><button on-click="clickHandler" id="button1">Click Me!</button></span>',
        clickHandler: function() {}
      };
      spyOn(extendingObject, 'clickHandler');

      var TestView = Nex.View.extend(extendingObject);
      var testView = new TestView();

      // Act
      testView.dispatchEvent({
        type: 'click',
        target: testView.el.querySelector('#button1')
      });

      // Assert
      expect(testView.clickHandler).toHaveBeenCalled();
    });
  });

  describe('utilities.parseEventTypes(htmlString)', function() {
    it('should return an array of the on-eventtype attributes in the HTML string', function() {
      // Arrange
      var htmlString = '<div><input on-change="changeHandler" on-focus="inputFocused" on-blur="inputLostFocus"><button on-click="clickHandler">Send</button></div>';

      // Act
      var eventTypes = Nex.utilities.parseEventTypes(htmlString);

      // Assert
      expect(eventTypes.indexOf('click') !== -1).toBe(true);
      expect(eventTypes.indexOf('blur') !== -1).toBe(true);
      expect(eventTypes.indexOf('focus') !== -1).toBe(true);
      expect(eventTypes.indexOf('change') !== -1).toBe(true);
      expect(eventTypes.indexOf('dblclick') !== -1).toBe(false);
    });
  });

});
