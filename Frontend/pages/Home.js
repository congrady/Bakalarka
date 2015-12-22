'use strict';

var Home = {
  init: function(params){
    this.isInitialized = true;
    this.message = "------> Home page <------"
  },
  show: function(){
    document.getElementById('main-content').innerHTML = this.message;
  }
};
