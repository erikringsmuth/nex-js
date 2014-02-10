/*global define*/
define([
  'amd/describe',
  'amd/it',
  'amd/expect',
  'js/notes/notesPage'
], function(describe, it, expect, NotesPage) {
  'use strict';

  describe('The notes page', function() {
    it('should load', function() {
      expect(NotesPage).toBeDefined();
    });

    it('should have a layout page', function() {
      var notesPage = new NotesPage();
      expect(notesPage.outerEl.querySelector('.navbar')).toBeTruthy();
    });
  });
});
