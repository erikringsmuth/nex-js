/*global define*/
define([], function () {
  'use strict';
  
  return {
    LOCAL_STORAGE_KEY: 'todos-nexjs',
    ENTER_KEY: 13,
    ESCAPE_KEY: 27,
    guid: function guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
  };
});
