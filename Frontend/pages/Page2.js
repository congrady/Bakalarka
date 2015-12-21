Page2 = {
  init: function(){
    this.isInitialized = true;
    this.message = "------> Page 2 <------"
  },
  show: function(){
    document.getElementById('main-content').innerHTML = this.message;
  }
};
