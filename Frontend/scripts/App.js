'use strict';

var App = {
  self: this,
  router: new Router(),
  resourceLoader: new ResourceLoader(),
  authenticator: new Authenticator(),
  htmlSchemas: new Map(),
  start: function(){
    this.router = new Router();
    this.resourceLoader = new ResourceLoader();
    this.authenticator = new Authenticator();
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
window.addEventListener('popstate', App.start);
