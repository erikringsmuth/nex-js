/*global define*/
define([
  'nex',
  'handlebars',
  'text!./childTemplate.html',
  'js/dev/parent/parentPage',
  'js/util/utilities'
], function(Nex, Handlebars, childTemplate, ParentPage, utilities) {
  'use strict';

  return Nex.defineComponent('child-dev-page', {
    initialize: function initialize(routeArguments) {
      // Store the route arguments during initialization
      this.model.routeArguments = JSON.stringify(routeArguments, null, 2);
    },

    template: Handlebars.compile(childTemplate),

    model: {
      inputText: 'Child input text'
    },
    
    layout: ParentPage,

    render: function render() {
      this.html(this.template(this));
      utilities.formatCode(this);
      return this;
    },

    updateInputText: function updateInputText() {
      this.model.inputText = this.el.querySelector('#child-input-text').value;
      this.render();
    },

    updateInputTextOnEnter: function updateInputTextOnEnter(event) {
      if (event.keyCode === 13) {
        this.model.inputText = event.target.value;
        this.render();
      }
    }
  });
});
