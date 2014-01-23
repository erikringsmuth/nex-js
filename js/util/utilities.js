/*global define*/
define([
  'bower_components/google-code-prettify/src/prettify'
], function(prettify) {
  'use strict';

  return {
    html5: function html5() {
      return ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window);
    },

    formatCode: function formatCode(element) {
      var codeElements = element.querySelectorAll('code');
      for (var i in codeElements) {
        var el = codeElements[i];
        if (el.className !== 'pln') {
          el.innerHTML = prettify.prettyPrintOne(el.innerHTML);
        }
      }
      return element;
    }
  };
});