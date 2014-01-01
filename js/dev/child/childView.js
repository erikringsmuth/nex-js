/*global define*/
define([
  'nex',
  'handlebars',
  'text!./childTemplate.html',
  'dev/parent/parentView'
], function(Nex, Handlebars, childTemplate, ParentView) {
  'use strict';

  return Nex.View.extend({
    events: {
      'click button#child-input-text-button': 'updateInputText',
      'keypress #child-input-text': 'updateInputTextOnEnter'
    },

    template: Handlebars.compile(childTemplate),

    model: {
      inputText: 'Child input text'
    },
    
    layoutView: new ParentView(),

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
