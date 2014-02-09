/*global define*/
define([
  'nex',
  'handlebars',
  'text!./notesTemplate.html',
  'js/layout/layout',
  'js/util/utilities'
], function(Nex, Handlebars, notesTemplate, Layout, utilities) {
  'use strict';

  return Nex.defineComponent('notes-page', {
    template: Handlebars.compile(notesTemplate),
    
    layout: Layout,

    render: function render() {
      this.html(this.template(this));
      utilities.formatCode(this);
      return this;
    }
  });
});
