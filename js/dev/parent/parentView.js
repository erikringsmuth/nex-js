/*global define*/
define([
  'nex',
  'handlebars',
  'text!./parentTemplate.html',
  'js/layout/layoutView'
], function(Nex, Handlebars, parentTemplate, LayoutView) {
  'use strict';

  return Nex.View.extend({
    template: Handlebars.compile(parentTemplate),

    model: {
      inputText: 'Parent input text'
    },
    
    contentPlaceholder: '#parent-content-placeholder',
    
    layout: LayoutView,

    on: {
      'click button#parent-input-text-button': function updateInputText() {
        this.model.inputText = this.el.querySelector('#parent-input-text').value;
        this.render();
      },

      'keypress #parent-input-text': function updateInputTextOnEnter(event) {
        if (event.keyCode === 13) {
          this.model.inputText = event.target.value;
          this.render();
        }
      }
    }
  });
});
