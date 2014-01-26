/*global define*/
define([
  'nex',
  'handlebars',
  'text!./parentTemplate.html',
  'js/layout/layoutView'
], function(Nex, Handlebars, parentTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    events: {
      'click button#parent-input-text-button': 'updateInputText',
      'keypress #parent-input-text': 'updateInputTextOnEnter'
    },

    template: Handlebars.compile(parentTemplate),

    model: {
      inputText: 'Parent input text'
    },
    
    contentPlaceholderId: 'parent-content-placeholder',
    
    layout: LayoutView,

    updateInputText: function updateInputText() {
      this.model.inputText = this.el.querySelector('#parent-input-text').value;
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
