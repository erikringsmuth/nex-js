/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/notes/notesView'
], function(describe, it, expect, NotesView) {
  'use strict';

  describe('The notes view', function() {
    it('should load', function() {
      expect(NotesView).toBeDefined();
    });

    it('should have a layout view', function() {
      var notesView = new NotesView();
      expect(notesView.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
