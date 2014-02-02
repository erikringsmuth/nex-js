/*global define*/
define([
  'jquery',
  'bower_components/google-code-prettify/src/prettify'
], function($, prettify) {
  'use strict';

  var utilities = {
    // Test if the browser supports common HTML5 DOM APIs
    html5: 'querySelector' in document && 'localStorage' in window && 'addEventListener' in window,

    // Format code for readability. This will look for every code block in the element and format it.
    formatCode: function formatCode(element) {
      // Google doesn't even support IE8...
      if (utilities.html5) {
        $(element).find('code').each(function() {
          var $el = $(this);
          // If the code block has class 'pln' don't format the code
          if (!$el.hasClass('pln')) {
            $el.html(prettify.prettyPrintOne($el.html()));
          }
        });
      }
      return element;
    }
  };

  return utilities;
});
