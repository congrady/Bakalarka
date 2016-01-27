'use strict';

var App = {
  htmlTemplates: new Map(),
  init: function(){
    if (!this.router){
      this.router = new Router();
      this.resourceLoader = new ResourceLoader();
      this.authenticator = new Authenticator();
      this.router.servePage();
    }
  },
  navigate: function(event, relative){
    event.preventDefault();
    let href;
    if (event.target.href){
      href = event.target.href.substring(21);
    }
    else if (event.target.parentElement.href) {
      href = event.target.parentElement.href.substring(21);
    }
    else {
      href = event.target.parentElement.parentElement.href.substring(21);
    }
    if (relative) {
      App.router.navigate(href, true);
    }
    else {
      App.router.navigate(href);
    }
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

App.init();
window.addEventListener('popstate', App.init);
/*window.addEventListener('unload', function(){
  sessionStorage.removeItem('token')
});*/
