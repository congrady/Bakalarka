'use strict';

export var Page2 = {
    init: function(){
      this.message = "------> Page 2 <------"
    },
    show: function(){
      document.getElementById('main-content').innerHTML = this.message;
    }
};
