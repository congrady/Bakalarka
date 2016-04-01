'use strict';

var App = {
  init: function() {
    if (!App.router) {
      App.router = new Router();
      App.resourceLoader = new ResourceLoader();
      App.authenticator = new Authenticator();
      App.dataStore = new DataStore();
    }
    App.router.servePage();
  },
  dataHandler: function(params){
    this.dataStore.dataHandler(params);
  },
  updateData: function(params){
    this.dataStore.updateData(params);
  },
  putData: function(params){
    this.dataStore.putData(params);
  },
  deleteData: function(params){
    this.dataStore.deleteData(params);
  },
  putClientData: function(params){
    this.dataStore.putClientData(params)
  },
  updateClientData: function(params){
    this.dataStore.updateClientData(params)
  },
  deleteClientData: function(params){
    this.dataStore.deleteClientData(params);
  },
  syncData: function(params){
    this.dataStore.syncData(params)
  },
  navigate: function(param, relative) {
    if (typeof param == 'string'){
      App.router.navigate(param)
    } else {
      param.preventDefault();
      function getHref(element) {
        if (element.href) {
          return element.href.substring(App.router.defaultUrlLength);
        }
        if (element.parentElement) {
          return getHref(element.parentElement);
        }
        return "404";
      }
      let href = getHref(param.target);
      if (href === "404") {
        App.router.showError("pageNotFound");
        return
      }
      if (relative) {
        App.router.navigate(href, true);
      } else {
        App.router.navigate(href);
      }
    }
  },
  login: function(options) {
    var self = App;
    App.authenticator.loginRequest(
      options.login,
      options.password,
      AppConfig.loginPath,
      function(response) {
        response = response.split(",");
        self.userName = response[0]
        self.token = response[1];
        self.authLevel = response[2];
        sessionStorage.setItem('userName', response[0]);
        sessionStorage.setItem('token', response[1]);
        sessionStorage.setItem('authLevel', response[2]);
        options.success();
        self.router.servePage();
      },
      options.error
    );
  },
  logout: function() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('authLevel');
    delete App.userName;
    delete App.token;
    delete App.authLevel;
    App.router.servePage();
  },
  newPage: function(page) {
    App.router.Pages.set(App.router.currentPage, page);
  }
}

App.init();
window.addEventListener('popstate', App.init);
