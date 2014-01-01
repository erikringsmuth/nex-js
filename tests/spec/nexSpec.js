/*global define*/
define([
  'jasmineAmd',
  'nex'
], function(jasmine, Nex) {
  'use strict';

  jasmine.describe('Loading nex-js with an AMD loader like require.js', function() {
    jasmine.it('should not add nex-js to the global scope', function() {
      jasmine.expect(window.Nex).toBeUndefined();
    });
  });

  jasmine.describe('Extending the base View', function() {
    jasmine.it('should return a constructor function', function() {
      var TestView = Nex.View.extend();
      jasmine.expect(typeof TestView).toEqual('function');
    });
  });

  jasmine.describe('view.render()', function() {
    jasmine.it('should process the function template with an object model and add the result HTML to view.el', function() {
      var TestView = Nex.View.extend({
        template: function(args) { return '<div>Hello ' + args.model.name + '</div>'; },
        model: {
          name: 'Erik Ringsmuth'
        }
      });
      var testView = new TestView().render();
      jasmine.expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    jasmine.it('should process the function template with a constructor function model and add the result HTML to view.el', function() {
      var TestView = Nex.View.extend({
        template: function(args) { return '<div>Hello ' + args.model.name + '</div>'; },
        model: function() {
          this.name = 'Erik Ringsmuth';
        }
      });
      var testView = new TestView().render();
      jasmine.expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    jasmine.it('should process the string template and add the result HTML to view.el', function() {
      var TestView = Nex.View.extend({
        template: '<div>Hello Erik Ringsmuth</div>'
      });
      var testView = new TestView().render();
      jasmine.expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    jasmine.it('should render the layout view and attach the child to the layout', function() {
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
      jasmine.expect(testView.outerEl.innerHTML).toEqual('<div id="main-content"><div>Hello Erik Ringsmuth</div></div>');
    });

    jasmine.it('should allow render to be overridden', function() {
      var TestView = Nex.View.extend({
        render: function() { this.el.innerHTML = '<div>Hello Erik Ringsmuth</div>'; }
      });
      var testView = new TestView();
      testView.render();
      jasmine.expect(testView.el.innerHTML).toEqual('<div>Hello Erik Ringsmuth</div>');
    });

    jasmine.it('should render the layout view and attach the child to the layout even if render is overridden', function() {
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
      jasmine.expect(testView.outerEl.innerHTML).toEqual('<div id="main-content"><div>Hello Erik Ringsmuth</div></div>');
    });
  });

  jasmine.describe('view.el', function() {
    var TestView = Nex.View.extend();
    var testView = new TestView();
    jasmine.it('should default to a div', function() {
      jasmine.expect(testView.el).toBeDefined();
      jasmine.expect(testView.el.tagName).toEqual('DIV');
    });
  });

  jasmine.describe('view.model', function() {
    var model = {
      property1: 'jon doe'
    };
    var TestView = Nex.View.extend({
      model: model
    });
    var testView = new TestView();
    jasmine.it('should be set', function() {
      jasmine.expect(testView.model).toEqual(model);
    });
  });

  jasmine.describe('view.template()', function() {
    var TestView = Nex.View.extend();
    var testView = new TestView();
    jasmine.it('should default to a compiled template (function) that returns an empty string', function() {
      jasmine.expect(typeof(testView.template)).toEqual('function');
      jasmine.expect(testView.template()).toEqual('');
    });
  });

  jasmine.describe('view.events', function() {
    var extendingObject = {
      events: {
        'click span button#button1': 'buttonEventHandler'
      },
      template: '<span><button id="button1">Click Me!</button></span>',
      buttonEventHandler: function() {}
    };
    jasmine.spyOn(extendingObject, 'buttonEventHandler');

    var TestView = Nex.View.extend(extendingObject);
    var testView = new TestView().render();

    // Create and trigger a simulated event (this doesn't actually work)
    // var event = new MouseEvent('click', {
    //   'view': window,
    //   'bubbles': true,
    //   'cancelable': true
    // });
    // testView.el.querySelector('#button1').dispatchEvent(event);

    jasmine.xit('should attach delegate events to view.el and call the event handlers when the events are intercepted', function() {
      jasmine.expect(testView.buttonEventHandler).toHaveBeenCalled();
    });
  });

  jasmine.describe('view.layoutView', function() {
    jasmine.it('should be defined and an instance of View', function() {
      var LayoutView = Nex.View.extend({
        contentPlaceholderId: '#main-content'
      });
      var TestView = Nex.View.extend({
        layoutView: new LayoutView()
      });
      var testView = new TestView();
      jasmine.expect(testView.layoutView).toBeDefined();
      jasmine.expect(testView.layoutView instanceof LayoutView).toBeTruthy();
    });

    jasmine.it('should throw an exception if the layoutView itn\'t of type View', function() {
      var TestView = Nex.View.extend({
        layoutView: {}
      });
      jasmine.expect(function() { new TestView(); }).toThrow();
    });

    jasmine.it('should throw an exception if the layoutView doesn\'t have a contentPlaceholderId', function() {
      var LayoutView = Nex.View.extend();
      var TestView = Nex.View.extend({
        layoutView: new LayoutView()
      });
      jasmine.expect(function() { new TestView(); }).toThrow();
    });

    jasmine.it('should give the layout view a reference to the child view as layoutView.childView', function() {
      var LayoutView = Nex.View.extend({
        contentPlaceholderId: 'main-content'
      });
      var TestView = Nex.View.extend({
        layoutView: new LayoutView()
      });
      var testView = new TestView();
      var layoutView = testView.layoutView;
      jasmine.expect(layoutView.childView).toEqual(testView);
    });
  });

  jasmine.describe('view.outerEl', function() {
    jasmine.it('should be view.el if no layout view is defined', function() {
      var TestView = Nex.View.extend();
      var testView = new TestView();
      jasmine.expect(testView.outerEl).toEqual(testView.el);
    });

    jasmine.it('should be layoutView.el if a layout view is defined', function() {
      var LayoutView = Nex.View.extend({
        contentPlaceholderId: 'main-content'
      });
      var TestView = Nex.View.extend({
        layoutView: new LayoutView()
      });
      var testView = new TestView();
      var layoutView = testView.layoutView;
      jasmine.expect(testView.outerEl).toEqual(layoutView.el);
    });
  });

  jasmine.describe('view.contentPlaceholderId', function() {
    jasmine.it('should throw an exception if it\'s not a string', function() {
      var TestView = Nex.View.extend({
        contentPlaceholderId: {}
      });
      jasmine.expect(function() { new TestView(); }).toThrow();
    });
  });

  jasmine.describe('view.remove()', function() {
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
    jasmine.it('should remove the view from anything it\'s attached to', function() {
      jasmine.expect(outerView.el.querySelector('#container').innerHTML).toEqual('');
    });
  });

  jasmine.describe('view.initialize()', function() {
    jasmine.it('should be called when creating an instance of a view', function() {
      var extendingObject = {
        initialize: function initialize() {}
      };
      var TestView = Nex.View.extend(extendingObject);
      jasmine.spyOn(extendingObject, 'initialize');
      var testView = new TestView('arg1', 'arg2');
      jasmine.expect(testView.initialize).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  jasmine.describe('view.tagName', function() {
    jasmine.it('should create view.el with that tagName', function() {
      var TestView = Nex.View.extend({
        tagName: 'span'
      });
      var testView = new TestView();
      jasmine.expect(testView.el.tagName).toEqual('SPAN');
    });
  });

  jasmine.describe('view.id', function() {
    jasmine.it('should set the ID of view.el', function() {
      var TestView = Nex.View.extend({
        id: 'awesome-id'
      });
      var testView = new TestView();
      jasmine.expect(testView.el.id).toEqual('awesome-id');
    });
  });

  jasmine.describe('view.className', function() {
    jasmine.it('should set the class of view.el', function() {
      var TestView = Nex.View.extend({
        className: 'awesome-class'
      });
      var testView = new TestView();
      jasmine.expect(testView.el.className).toEqual('awesome-class');
    });
  });
});
