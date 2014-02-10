/*global define*/
define([
  'nex',
  'handlebars',
  'text!./parentTemplate.html',
  'js/layout/layout'
], function(Nex, Handlebars, parentTemplate, Layout) {
  'use strict';

  return Nex.defineComponent('parent-dev-page', {
    template: Handlebars.compile(parentTemplate),

    model: {
      inputText: 'Parent input text'
    },
    
    contentPlaceholder: '#parent-content-placeholder',
    
    layout: Layout,

    updateInputText: function updateInputText() {
      this.model.inputText = this.querySelector('#parent-input-text').value;
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
