// {nex.js} - Unleashing the power of AMD for web applications.
//
// Version: 0.7.0
// 
// The MIT License (MIT)
// Copyright (c) 2014 Erik Ringsmuth
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.

(function(root, factory) {
  'use strict';

  // UMD (Universal Module Definition)
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.Nex = factory(root.b);
  }
}(this, function() {
  'use strict';

  // Private static variables
  var captureOnlyEventTypes = { 'blur': true, 'focus': true, 'mouseenter': true, 'mouseleave': true, 'resize': true, 'scroll': true };

  var Nex = {
    // Utility methods and properties
    utilities: {
      // Check for html5 support
      html5: 'querySelector' in document && 'localStorage' in window && 'addEventListener' in window,

      // Parse the HTML string to get 'on-eventtype' attributes. This is used to set up event handlers.
      // This is built for speed, not accuracy. The check won't guarantee it's an attribute. It doesn't
      // hurt to listen to non-existent types and that rarely happens even with the simple regex matcher.
      parseEventTypes: function parseEventTypes(htmlString) {
        // Matches a string like '<button on-click="eventCallback">Send</button>' and returns [' on-click'].
        // We split on the '-' later. JavaScript regex doesn't have lookbehind support to clean this up ahead
        // of time.
        var matches = htmlString.match(/\son-\w+(?==")/g);
        var eventTypes = [];
        if (matches) {
          for (var i = 0; i < matches.length; i++) {
            var eventType = matches[i].split('-')[1];
            if (eventTypes.indexOf(eventType) === -1) eventTypes.push(eventType);
          }
        }
        return eventTypes;
      }
    },

    // Nex.View
    View: {
      // Extend the base view like this `var MyView = Nex.View.extend(extendingView);`
      extend: function extend(extendingView) {
        if (typeof(extendingView) === 'undefined') extendingView = {};

        // Your view's constructor function. Call like this `var view = new MyView();`.
        return function View() {
          var view = this;

          // Allow the implementing view to override extendingView on this object
          for (var property in extendingView) {
            if (extendingView.hasOwnProperty(property)) {
              view[property] = extendingView[property];
            }
          }

          // view.tagName - the type of DOM element
          if (typeof(view.tagName) === 'undefined') view.tagName = 'div';

          // view.el - the view's DOM element
          if (typeof(view.el) === 'undefined') view.el = document.createElement(view.tagName);

          // view.id - the ID of the view's DOM element
          if (typeof(view.id) !== 'undefined') view.el.id = view.id;

          // view.className - the class name(s) of the view's DOM element
          if (typeof(view.className) !== 'undefined') view.el.className = view.className;

          // view.components - views that are automatically created, rendered, and attached to this view
          if (typeof(view.components) !== 'object') view.components = {};
          view._initializedComponents = {};
          for (var componentSelector in view.components) {
            if(view.components.hasOwnProperty(componentSelector)) {
              view._initializedComponents[componentSelector] = view.components[componentSelector];
              // Create an instance of the component if it's a constructor function
              if (typeof view._initializedComponents[componentSelector] === 'function') {
                // Workaround to pass the current arguments to the component constructor function
                var currentArguments = arguments;
                var Component = function() {
                  view._initializedComponents[componentSelector].apply(this, currentArguments);
                  this.__proto__ = view._initializedComponents[componentSelector].prototype;
                  return this;
                };
                view._initializedComponents[componentSelector] = new Component();
              }
              if (!view._initializedComponents[componentSelector] instanceof View) {
                throw 'Every component must be a View constructor or an instance of a View.';
              }
            }
          }

          // view.layout - the layout view contains your site's layout (header, footer, etc.)
          if (typeof(view.layout) !== 'undefined') {
            // If the layout view is a constructor function create an instance
            if (typeof view.layout === 'function') {
              view.layout = new view.layout();
            }
            if (!view.layout instanceof View) {
              throw 'The `view.layout` must be a View constructor or an instance of a View.';
            }
            if (typeof(view.layout.contentPlaceholder) !== 'string') {
              throw 'The layout view must have contentPlaceholder.';
            }
            // Set this view as a component of the layout view. That's all it is in the end.
            view.layout._initializedComponents[view.layout.contentPlaceholder] = view;
          }

          // view.contentPlaceholder - the layout view's content placeholder selector for the child view
          if (typeof(view.contentPlaceholder) !== 'undefined' && typeof(view.contentPlaceholder) !== 'string' ) {
            throw 'The contentPlaceholder must be a string.';
          }

          // view.outerEl - the view's or layout view's outer most element
          if (typeof(view.outerEl) !== 'undefined') throw '`view.outerEl` is a read only property that is automatically populated.';
          view.outerEl = view.layout ? view.layout.outerEl : view.el;

          // view.model - the model that gets passed to the template
          if (typeof(view.model) === 'undefined') view.model = {};

          // view.template() - called by view.render() to generate the view's HTML
          // Defaults to work like a precompiled template that returns an empty HTML string.
          if (typeof(view.template) === 'undefined') {
            view.template = function() {
              console.log('You should implement `View.template()`.');
              return '';
            };
          }

          // view.render(), actually view.innerRender() - call the template with the view's model and replace the
          // view's HTML. We wrap the original render method so that rendering this view will also render it's
          // layout view and attach components.
          var innerRender = function innerRender() {
            // Allow the model to be defined as a constructor function so that variables don't need to be evaluated
            // until render time
            var model;
            if (typeof(view.model) === 'function') {
              model = new view.model();
            } else {
              model = view.model;
            }

            // Compile the template and set the view's HTML
            if (typeof(view.template) === 'function') {
              // Compiled template
              view.html(view.template({model: model}));
            } else if (typeof(view.template) === 'string') {
              // Simple, non-dynamic HTML
              view.html(view.template);
            }
            
            return view;
          };

          // innerRender() is actually overridden by specifying a view.render() method
          if (typeof(view.render) !== 'undefined') innerRender = view.render;

          var shouldRenderLayout = view.layout ? true : false;
          view.render = function render() {
            // Walk up the view chain rendering layout views on the initial render
            if(shouldRenderLayout) {
              view.layout.render();
              shouldRenderLayout = false;
            }

            // Call the method that renders this view
            var innerRenderReturnValue = innerRender.call(this, arguments);

            // Attach it's components (this is how the layout attaches the child view)
            for (var componentSelector in view._initializedComponents) {
              if(view._initializedComponents.hasOwnProperty(componentSelector)) {
                var placeholderElement = view.el.querySelector(componentSelector);
                if (!placeholderElement) throw 'Invalid component selector or layout contentPlaceholder: ' + componentSelector;
                // Remove any existing children from the placeholder element
                // IE8 workaround since el.innerHTML fails when an event is currently being triggered on it
                while (placeholderElement.firstChild) placeholderElement.removeChild(placeholderElement.firstChild);
                placeholderElement.appendChild(view._initializedComponents[componentSelector].el);
              }
            }

            // Return the value from the original render method
            return innerRenderReturnValue;
          };

          // view.html() - replace view.el's HTML with the htmlString
          //
          // This also sets up event listeners defined in the htmlString.
          view.html = function html(htmlString) {
            if (Nex.utilities.html5) {
              view.el.innerHTML = htmlString;
            } else {
              // IE8 workaround since el.innerHTML and el.insertAdjacentHTML fail when an event is currently being
              // triggered on the element. Create a new element and set it's innerHTML which will work since no event
              // is occurring on this temp element.
              var tempEl = document.createElement('div');
              tempEl.innerHTML = htmlString;

              // Clear out view.el and add the new HTML
              while (view.el.firstChild) view.el.removeChild(view.el.firstChild);
              while (tempEl.firstChild) view.el.appendChild(tempEl.firstChild);
            }
            addEventListeners(Nex.utilities.parseEventTypes(htmlString));
          };

          // view.attachTo(selector|element) - attach this view to the element
          view.attachTo = function attachTo(selector) {
            var element;
            if (typeof(selector) === 'string') {
              element = document.querySelector(selector);
            } else if (selector.appendChild) {
              element = selector;
            } else {
              throw 'You can\'t attach the view to ' + selector;
            }
            if (Nex.utilities.html5) {
              element.innerHTML = '';
            } else {
              while (element.firstChild) element.removeChild(element.firstChild);
            }
            element.appendChild(view.outerEl);
          };

          // view.remove() - remove the view from the DOM
          if (typeof(view.remove) === 'undefined') {
            view.remove = function remove() {
              if (view.el.parentElement !== null) {
                view.el.parentElement.removeChild(view.el);
              }
            };
          }

          // view.dispatchEvent(event) - dispatch an event and call the event handler in it's target's
          // `on-eventtype="eventHandler"'` attribute
          view.dispatchEvent = function dispatchEvent(event) {
            // Check if the event was triggered in a nested view
            if (!event._outOfOriginatingViewScope) {
              if (!event.target) event.target = event.srcElement; // IE8
              var attrs = event.target.attributes;
              // Not an array, it's a NamedNodeMap object {'length': 1, '0': {'name': 'on-click', value: 'eventHandlerName'}}
              for (var i = 0; i < attrs.length; i++) {
                // Check if the element has a on-eventtype attribute that matches this event listener's event type
                if (attrs[i].name.substring(0, 3) === 'on-' && attrs[i].name.substring(3) === event.type) {
                  view[attrs[i].value].call(view, event);
                }
              }
              event._outOfOriginatingViewScope = true;
            }
          };

          // Set up the view's event listeners. These are defined in the template and parsed in view.html(htmlString). The
          // event listeners are bound to view.el. Typically all event types will have event listeners bound after the first
          // render. There is only one event listener per type. This even listener delegates calling the correct event
          // handler.
          //
          // Example:
          // <!-- myTemplate.html -->
          // <div> <!-- myView.el is the element the event listeners are bound to -->
          //   <input name="first-name" placeholder="Enter your name" />
          //   <button on-click="sendForm">Send</button>
          // </div>
          //
          // var MyView = View.extend({
          //   template: Handlebars.compile(myTemplate),
          //   sendForm: function (event) {
          //     this; // will reference your instance of `MyView`
          //     event.target; // will reference the DOM element the action took place on. This is the button in this example.
          //     event.currentTarget; // will reference `this.el` which is the root element that all events are bound to.
          //   }
          // })
          var eventListeners = {};
          var addEventListeners = function addEventListeners(eventTypes) {
            for (var i = 0; i < eventTypes.length; i++) {
              var eventType = eventTypes[i];
              // We only need to set up one event listener for each type
              if (!eventListeners[eventType]) {
                if (window.addEventListener) {
                  if (captureOnlyEventTypes[eventType]) {
                    view.el.addEventListener(eventType, view.dispatchEvent, true);
                  } else {
                    view.el.addEventListener(eventType, view.dispatchEvent, false);
                  }
                } else {
                  // IE 8 and older, events are prefixed with 'on'
                  view.el.attachEvent('on' + eventType, view.dispatchEvent);
                }
                eventListeners[eventType] = true;
              }
            }
          };

          // view.initialize() - a hook to add additional logic when creating an instance of the view
          if (typeof(view.initialize) === 'function') {
            view.initialize.apply(view, arguments);
          }

          // Do the initial render of the view. Don't do an initial render if it's a layout view. The initial render
          // of the content view will render the layout when it's ready.
          if (view.autoRender !== false && typeof(view.contentPlaceholder) === 'undefined') {
            view.render.call(view);
          }
        };
      }
    }
  };

  return Nex;
}));
