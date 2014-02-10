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

  describe('Nex.defineComponent(componentName, componentProperties)', function() {
    it('should return a constructor function', function() {
      var TestComponent = Nex.defineComponent('test-component');
      expect(typeof TestComponent).toEqual('function');
    });
  });

  describe('component.render()', function() {
    it('should process the function template and add the result HTML to component', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        template: function(component) { return '<div>Hello ' + component.model.name + '</div>'; },
        model: {
          name: 'Erik Ringsmuth'
        }
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should process the function template with a constructor function model and add the result HTML to component', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        template: function(component) { return '<div>Hello ' + component.model.name + '</div>'; },
        model: function() {
          this.name = 'Erik Ringsmuth';
        }
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should process the string template and add the result HTML to component', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        template: '<div>Hello Erik Ringsmuth</div>'
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    it('should render the layout component and attach the child to the layout', function() {
      // Arrange
      var Layout = Nex.defineComponent('test-component', {
        template: '<header></header><component name="content-placeholder"></component>',
        contentPlaceholder: '#main-content'
      });
      var TestComponent = Nex.defineComponent('test-component', {
        template: 'Hello Erik Ringsmuth',
        layout: Layout
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.outerEl.innerHTML).toEqual('<header></header><component name="test-component">Hello Erik Ringsmuth</component>');
    });

    it('should allow render to be overridden', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        render: function() { this.innerHTML = 'Hello Erik Ringsmuth'; }
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.innerHTML).toEqual('Hello Erik Ringsmuth');
    });

    it('should render the layout component and attach the child to the layout even if render is overridden', function() {
      // Arrange
      var Layout = Nex.defineComponent('layout', {
        template: '<header></header><component name="content-placeholder"></component>'
      });
      var TestComponent = Nex.defineComponent('test-component', {
        render: function() { this.innerHTML = 'Hello Erik Ringsmuth'; },
        layout: Layout
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.outerEl.innerHTML).toEqual('<header></header><component name="test-component">Hello Erik Ringsmuth</component>');
    });
  });

  describe('The component\'s DOM element', function() {
    it('should default to a <component> tag', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component');

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent).toBeDefined();
      expect(testComponent.tagName).toEqual('COMPONENT');
    });
  });

  describe('component.model', function() {
    it('should be set', function() {
      // Arrange
      var model = {
        property1: 'jon doe'
      };
      var TestComponent = Nex.defineComponent('test-component', {
        model: model
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.model).toEqual(model);
    });
  });

  describe('component.template()', function() {
    it('should default to a compiled template (function) that returns an empty string', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component');

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(typeof(testComponent.template)).toEqual('function');
      expect(testComponent.template()).toEqual('');
    });
  });

  describe('component.layout', function() {
    it('should throw an exception if the layout itn\'t of type Component', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        layout: {}
      });

      // Act, Assert
      expect(function() { new TestComponent(); }).toThrow();
    });
  });

  describe('component.outerEl', function() {
    it('should be component if no layout component is defined', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component');

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.outerEl).toEqual(testComponent);
    });

    it('should be the layout if a layout is defined', function() {
      // Arrange
      var Layout = Nex.defineComponent('layout', {
        template: '<component name="content-placeholder"></component>'
      });
      var TestComponent = Nex.defineComponent('test-component', {
        layout: Layout
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.outerEl).toEqual(testComponent.layout);
    });
  });

  describe('component.remove()', function() {
    it('should remove the component from the document', function() {
      // Arrange
      // Create an inner component
      var TestComponent = Nex.defineComponent('test-component', {
        template: 'some text'
      });
      // Create an outer component
      var OuterComponent = Nex.defineComponent('outer-component', {
        template: '<component name="test-component"></component>',
        components: [TestComponent]
      });
      var outerComponent = new OuterComponent();

      // Act
      outerComponent.querySelector('component [name="test-component"]').remove();

      // Assert
      expect(outerComponent.querySelector('component [name="test-component"]')).toBeNull();
    });
  });

  describe('component.html()', function() {
    it('should replace component\'s innerHTML', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        template: 'some text'
      });
      var testComponent = new TestComponent();

      // Act
      testComponent.html('<div id="main-content"><div>New content</div></div>');

      // Assert
      expect(testComponent.querySelector('#main-content').innerHTML).toEqual('<div>New content</div>');
    });

    it('should parse the HTML for event attributes', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component');
      var testComponent = new TestComponent();
      spyOn(Nex.utilities, 'parseEventTypes').and.returnValue([]);

      // Act
      testComponent.html('<input type="text" on-keypress="keypressCallback">');

      // Assert
      expect(Nex.utilities.parseEventTypes).toHaveBeenCalled();
    });
  });

  describe('component.attachTo(selector|element)', function() {
    it('should attach the component to the element', function() {
      // Arrange
      var OuterComponent = Nex.defineComponent('outer-component', {
        template: '<div id="placeholder"></div>'
      });
      var InnerComponent = Nex.defineComponent('inner-component', {
        template: 'inner text'
      });
      var outerComponent = new OuterComponent();

      // Act
      new InnerComponent().attachTo(outerComponent.querySelector('#placeholder'));

      // Assert
      expect(outerComponent.innerHTML).toEqual('<div id="placeholder"><component name="inner-component">inner text</component></div>');
    });

    it('should throw an exception when the argument isn\'t a selector or element', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        template: 'inner text'
      });
      var testComponent = new TestComponent();
      var testFunction = function() {
        testComponent.attachTo({ prop: 'this isn\'t a selector or element' });
      };

      // Act, Assert
      expect(testFunction).toThrow();
    });
  });

  describe('component.ready()', function() {
    it('should be called when creating an instance of a component', function() {
      // Arrange
      var extendingObject = {
        ready: function ready() {}
      };
      var TestComponent = Nex.defineComponent('test-component', extendingObject);
      spyOn(extendingObject, 'ready');

      // Act
      var testComponent = new TestComponent('arg1', 'arg2');

      // Assert
      expect(testComponent.ready).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('component.tagName', function() {
    it('should create component with that tagName', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        tagName: 'span'
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.tagName).toEqual('SPAN');
    });
  });

  describe('component.id', function() {
    it('should set the ID of component', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        id: 'awesome-id'
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.id).toEqual('awesome-id');
    });
  });

  describe('component.className', function() {
    it('should set the class of component', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        className: 'awesome-class'
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.className).toEqual('awesome-class');
    });
  });

  describe('component.components', function() {
    it('should create instances of the components and attach them to this component', function() {
      // Arrange
      var InnerComponent = Nex.defineComponent('test-component', {
        template: 'A component'
      });
      var OuterComponent = Nex.defineComponent('outer-component', {
        template: '<div>Some components will go in the placeholder</div><component name="test-component"></component>',
        components: [InnerComponent]
      });

      // Act
      var outerComponent = new OuterComponent();

      // Assert
      expect(outerComponent.innerHTML).toEqual('<div>Some components will go in the placeholder</div><component name="test-component">A component</component>');
    });

    it('should not attach a component if it\'s not defined in the template', function() {
      // Arrange
      var InnerComponent = Nex.defineComponent('test-component', {
        template: 'A component'
      });
      var OuterComponent = Nex.defineComponent('outer-component', {
        template: '<div>Some components will go in the placeholder</div><component name="other-component"></component>',
        components: [InnerComponent]
      });

      // Act
      var outerComponent = new OuterComponent();

      // Assert
      expect(outerComponent.innerHTML).toEqual('<div>Some components will go in the placeholder</div><component name="other-component"></component>');
    });
  });

  describe('component.registerComponent(Component, componentName)', function() {
    it('should register, render, and attach a component to another component', function() {
      // Arrange
      var OuterComponent = Nex.defineComponent('outer-component', {
        template: '<h1>Outer Component</h1><component name="inner-component"></component>'
      });
      var outerComponent = new OuterComponent(); // This renders it
      var InnerComponent = Nex.defineComponent('inner-component', {
        template: 'Inner Component!'
      });

      // Act
      outerComponent.registerComponent(InnerComponent);

      // Assert
      expect(outerComponent.innerHTML).toEqual('<h1>Outer Component</h1><component name="inner-component">Inner Component!</component>');
    });
  });

  describe('component.autoRender', function() {
    it('should prevent the component from being rendered when an instance is created if it\'s set to false', function() {
      // Arrange
      var TestComponent = Nex.defineComponent('test-component', {
        template: '<div>this should not show up</div>',
        autoRender: false
      });

      // Act
      var testComponent = new TestComponent();

      // Assert
      expect(testComponent.innerHTML).toEqual('');
    });
  });

  describe('component.dispatchEvent(event)', function() {
    it('should delegate the event to it\'s event handler', function() {
      // Arrange
      var extendingObject = {
        template: '<span><button on-click="clickHandler" id="button1">Click Me!</button></span>',
        clickHandler: function() {}
      };
      spyOn(extendingObject, 'clickHandler');

      var TestComponent = Nex.defineComponent('test-component', extendingObject);
      var testComponent = new TestComponent();

      // Act
      testComponent.dispatchEvent({
        type: 'click',
        target: testComponent.querySelector('#button1')
      });

      // Assert
      expect(testComponent.clickHandler).toHaveBeenCalled();
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
