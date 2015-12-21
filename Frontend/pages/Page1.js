Page1 = {
  init: function(){
    this.isInitialized = true;
    this.message = "------> Page 1 <------"
  },
  show: function(){
    document.getElementById('main-content').innerHTML = this.message;
  }
};
