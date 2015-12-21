Home = {
  init: function(){
    this.isInitialized = true;
    this.message = "------> Home page <------"
  },
  show: function(){
    document.getElementById('main-content').innerHTML = this.message;
  }
};
