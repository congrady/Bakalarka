'use strict';

export var Home = {
    init: function(){
      this.message = "------> Home page <------"
    },
    show: function(){
      document.getElementById('main-content').innerHTML = this.message;
    }
};
