'use strict';

var App = {
  router: new Router(),
  start: function(){
    if (!this.router){
      App.router = new Router();
      var self = this;
      window.addEventListener('popstate', self.start);
    }
    this.router.servePage();
  },
  navigate: function(event){
    event.preventDefault();
    App.router.navigate(event.target.href.substring(21)); //todo
  },
  login: function(options){
    this.router.login(options);
  },
  logout: function(){
    this.router.logout();
  },
  newPage: function(page){
    this.router.Pages.set(this.router.currentPage, page);
  }
}

App.start();
