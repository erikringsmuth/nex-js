/*global define*/
define([
  'jasmineAmd',
  'js/notes/notesView'
], function(jasmine, NotesView) {
  'use strict';

  var env = jasmine.getEnv(), describe = env.describe, it =  env.it, expect = env.expect;

  describe('The notes view', function() {
    it('should load', function() {
      expect(NotesView).toBeDefined();
    });

    it('should have a layout view', function() {
      var notesView = new NotesView();
      notesView.render();
      expect(notesView.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
