'use strict';

var Page2 = {
  init: function(params){
    this.isInitialized = true;
    this.message = "------> Page 2 <------";
    if (params){
      for (let param of params){
        this.message += "<br> param: "+param;
      }
    }
  },
  show: function(){
    document.getElementById('main-content').innerHTML = this.message;
  }
};
