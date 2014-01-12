// {nex.js} - Powerful, modular, AMD compatible views.
//
// Version: 0.1.9
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

/*global define, console*/
/*jshint loopfunc: true*/
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

  var Nex = {
    // Nex.View
    View: {
      // Extend the base view like this `var MyView = Nex.View.extend({});` where the object being passed in is `extendingView`.
      extend: function extend(extendingView) {
        if (typeof(extendingView) === 'undefined') extendingView = {};

        // Your view's constructor function. Call like this `var view = new MyView();`.
        return function View() {
          var view = this;

          // Allow the implementing view to override extendingView on this object
          for (var property in extendingView) {
            view[property] = extendingView[property];
          }

          // view.tagName - the type of DOM element
          if (typeof(view.tagName) === 'undefined') view.tagName = 'div';

          // view.el - the view's DOM element
          if (typeof(view.el) === 'undefined') view.el = document.createElement(view.tagName);

          // view.layoutView - the layout view contains your site's layout (header, footer, etc.)
          if (typeof(view.layoutView) !== 'undefined') {
            if (!view.layoutView instanceof View) {
              throw 'The `view.layoutView` must be an instance of a View.';
            }
            if (typeof(view.layoutView.contentPlaceholderId) !== 'string') {
              throw 'The layout view must have `view.contentPlaceholderId` specified.';
            }
            // Give the layout view a reference to the child view in case it needs to modify its render method
            view.layoutView.childView = view;
          }

          // view.contentPlaceholderId - the ID of a layout view's content placeholder element
          if (typeof(view.contentPlaceholderId) !== 'undefined' && typeof(view.contentPlaceholderId) !== 'string' ) {
            throw 'The `contentPlaceholderId` must be a string.';
          }

          // view.childView - the child view is attached to the layout if it needs to be re-rendered without re-rendering the child view
          if (typeof(view.childView) !== 'undefined') throw 'You can\'t specify `view.childView`. This is set automatically on the layout when a view specifies `view.layoutView`.';

          // view.outerEl - the view's or layout view's outer most element
          if (typeof(view.outerEl) !== 'undefined') throw '`view.outerEl` is a read only property that is automatically populated.';
          view.outerEl = view.layoutView ? view.layoutView.outerEl : view.el;

          // view.id - the ID of the view's DOM element
          if (typeof(view.id) !== 'undefined') view.el.id = view.id;

          // view.className - the class name(s) of the view's DOM element
          if (typeof(view.className) !== 'undefined') view.el.className = view.className;

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

          // view.render() - call the template with the view's model and set the result to `el.innerHTML`
          //
          // In order to guarantee that the layout view will be rendered when this view is rendered we need to wrap
          // the `render()` method in a render method that will also render the layout.
          var innerRender = function innerRender() {
            // Allow the model to be defined as a constructor function so that variables don't need to be
            // evaluated until render time
            var model;
            if (typeof(view.model) === 'function') {
              model = new view.model();
            } else {
              model = view.model;
            }

            // Compile the template and set `view.el.innerHTML`
            if (typeof(view.template) === 'function') {
              // Compiled template
              view.el.innerHTML = view.template({model: model});
            } else if (typeof(view.template) === 'string') {
              // Simple, non-dynamic HTML
              view.el.innerHTML = view.template;
            }
            
            return view;
          };
          // `innerRender()` is actually overridden by specifying a `view.render()` method
          if (typeof(view.render) !== 'undefined') innerRender = view.render;

          var shouldRenderLayout = view.layoutView ? true : false;
          view.render = function render() {
            // Walk up the view chain rendering layout views on the initial render
            if(shouldRenderLayout) {
              view.layoutView.render();
              shouldRenderLayout = false;
            }

            // Call the method that actually renders the view
            var innerRenderReturnValue = innerRender.call(this, arguments);

            // When a layout view is rendered it should attach it's child to it's content placeholder
            if (view.childView) {
              var contentPlaceholder = view.el.querySelector('#' + view.contentPlaceholderId);
              contentPlaceholder.innerHTML = '';
              contentPlaceholder.appendChild(view.childView.el);
            }

            // Return the value from the original render method
            return innerRenderReturnValue;
          };

          // view.remove() - remove the view from the DOM
          if (typeof(view.remove) === 'undefined') {
            view.remove = function remove() {
              if (view.el.parentElement !== null) {
                view.el.parentElement.removeChild(view.el);
              }
            };
          }

          // view.events - delegate events that are bound once to the root object so subsequent calls to
          // view.render() don't need to re-bind events.
          //
          // Events work slightly differently than jQuery delegate events since there aren't native ECMAScript
          // delegate events.
          //
          // var MyView = View.extend({
          //   this.events: { 'click span a': 'anchorEventHandler' },
          //   this.anchorEventHandler: function(event) {
          //     // `this` will reference `MyView`.
          //     // `event.target` will reference the DOM element the action took place on. This is `a` in this example.
          //     // `event.currentTarget` will reference `this.el` which is the root element that all events are bound to.
          //    }
          // })
          if (typeof(view.events) === 'undefined') view.events = {};
          var eventListeners = {};
          for (var eventProperty in view.events) {
            // 'anchorEventHandler' from example
            var callbackName = view.events[eventProperty];
            var eventParts = eventProperty.split(' ');

            // 'click' from example
            var action = eventParts[0];

            // 'span a' from example
            var selector = eventParts.splice(1).join(' ');

            // Bind all events to the root element
            (function(action, selector, callbackName) {
              var eventListener = function eventListener(event) {
                // Check if the event was triggered on an element that matches the query selector
                var matchingElements = view.el.querySelectorAll(selector);
                for (var i in matchingElements) {
                  if (event.target === matchingElements[i]) {
                    view[callbackName].call(view, event);
                    break;
                  }
                }
              };
              if (window.addEventListener) {
                view.el.addEventListener(action, eventListener, true);
              } else {
                // IE 8 and older
                view.el.attachEvent(action, eventListener);
              }
              if (typeof(eventListeners[action]) === 'undefined') eventListeners[action] = [];
              eventListeners[action].push(eventListener);
            })(action, selector, callbackName);
          }

          // view.displatchMockEvent() - triggers a mock event for integration testing event handlers
          view.dispatchMockEvent = function dispatchMockEvent(mockEvent) {
            if (typeof(mockEvent) === 'undefined') throw 'You must pass a mock event';
            if (typeof(mockEvent.type) === 'undefined') throw 'You specify an event type';
            if (typeof(mockEvent.target) === 'undefined') throw 'You specify an event target';
            if (typeof(eventListeners[mockEvent.type]) === 'undefined') throw 'There are no event handlers set up for ' + mockEvent.type + 'events';
            eventListeners[mockEvent.type].forEach(function(eventListener) {
              eventListener(mockEvent);
            });
          };

          // view.initialize() - a hook to add additional logic when creating an instance of the view
          if (typeof(view.initialize) === 'function') {
            view.initialize.apply(view, arguments);
          }
        };
      }
    }
  };

  return Nex;
}));
