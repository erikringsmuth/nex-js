/*global define*/
define([
  'jquery',
  'bower_components/google-code-prettify/src/prettify'
], function($, prettify) {
  'use strict';

  return {
    html5: function html5() {
      return ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window);
    },

    formatCode: function formatCode(element) {
      $(element).find('code').each(function() {
        var $el = $(this);
        if (!$el.hasClass('pln')) {
          $el.html(prettify.prettyPrintOne($el.html()));
        }
      });
      return element;
    }
  };
});
