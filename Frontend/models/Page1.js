'use strict';

export var Page1 = {
    init: function(){
      this.message = "------> Page 1 <------"
    },
    show: function(){
      document.getElementById('main-content').innerHTML = this.message;
    }
};
