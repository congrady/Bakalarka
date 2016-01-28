'use strict';

var App = {
  htmlTemplates: new Map(),
  init: function(){
    if (!this.router){
      this.router = new Router();
      this.resourceLoader = new ResourceLoader();
      this.authenticator = new Authenticator();
    }
    this.router.servePage();
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
    var self = this;
    App.authenticator.loginRequest(
      options.login,
      options.password,
      "/login",
      function(response){
        response = response.split(",");
        let userName = response[0];
        let token = response[1];
        self.userName = userName
        self.token = token;
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('token', token);
        options.success();
        self.router.servePage();
        document.getElementsByTagName("main-navigation")[0].setAttribute("mode", "auth");
      },
      options.error
    );
  },
  logout: function(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    App.userName = null;
    App.token = null;
    document.getElementsByTagName("main-navigation")[0].setAttribute("mode", "free");
    this.router.servePage();
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
