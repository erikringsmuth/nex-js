/*global define*/
define([
  'bower_components/google-code-prettify/src/prettify'
], function(prettify) {
  'use strict';

  return {
    formatCode: function formatCode(element) {
      [].forEach.call(element.querySelectorAll('code'), function(el) {
        if (el.className !== 'pln') {
          el.innerHTML = prettify.prettyPrintOne(el.innerHTML);
        }
      });
      return element;
    }
  };
});