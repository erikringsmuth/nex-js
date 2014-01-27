/*global define*/
define([
  'nex',
  'handlebars',
  'text!./childTemplate.html',
  'js/dev/parent/parentView',
  'js/util/utilities'
], function(Nex, Handlebars, childTemplate, ParentView, utilities) {
  'use strict';

  return Nex.View.extend({
    initialize: function initialize(routeArguments) {
      // Store the route arguments during initialization
      this.model.routeArguments = JSON.stringify(routeArguments, null, 2);
    },

    template: Handlebars.compile(childTemplate),

    model: {
      inputText: 'Child input text'
    },
    
    layout: ParentView,

    render: function render() {
      this.html(this.template({model: this.model}));
      utilities.formatCode(this.el);
      return this;
    },

    on: {
      'click button#child-input-text-button': function updateInputText() {
        this.model.inputText = this.el.querySelector('#child-input-text').value;
        this.render();
      },

      'keypress #child-input-text': function updateInputTextOnEnter(event) {
        if (event.keyCode === 13) {
          this.model.inputText = event.target.value;
          this.render();
        }
      }
    }
  });
});
