'use strict';

var App = {

  init() {
    if (!App.router) {
      App.router = new Router();
      App.resourceLoader = new ResourceLoader();
      App.authenticator = new Authenticator();
      App.dataStore = new DataStore();
    }
    App.router.servePage();
  },
  
  getUrlParam(param){
    if (App.router.urlParams[param]){
      return App.router.urlParams[param].slice(0, App.router.urlParams[param].length);
    }
  },

  dataHandler(params) {
    this.dataStore.dataHandler(params);
  },

  updateData(params) {
    this.dataStore.updateData(params);
  },

  putData(params) {
    this.dataStore.putData(params);
  },

  deleteData(params) {
    this.dataStore.deleteData(params);
  },

  putClientData(params) {
    this.dataStore.putClientData(params)
    params.action = 'PUT';
    this.dataStore.enqueueDataChange(params);
  },

  updateClientData(params) {
    this.dataStore.updateClientData(params);
    params.action = 'UPDATE';
    this.dataStore.enqueueDataChange(params);
  },

  deleteClientData(params) {
    this.dataStore.deleteClientData(params);
    params.action = 'DELETE';
    this.dataStore.enqueueDataChange(params);
  },

  syncData(params) {
    this.dataStore.syncData(params)
  },

  navigate(param, relative) {
    if (typeof param == 'string') {
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
        return '404';
      }
      let href = getHref(param.target);
      if (href === '404') {
        App.router.showError('pageNotFound');
        return
      }
      if (relative) {
        App.router.navigate(href, true);
      } else {
        App.router.navigate(href);
      }
    }
  },

  login(options) {
    App.authenticator.loginRequest(
      options.login,
      options.password,
      AppConfig.loginPath,
      function(response) {
        response = response.split(',');
        App.userName = response[0]
        App.token = response[1];
        App.authLevel = response[2];
        sessionStorage.setItem('userName', response[0]);
        sessionStorage.setItem('token', response[1]);
        sessionStorage.setItem('authLevel', response[2]);
        options.success();
        App.router.servePage();
      },
      options.error
    );
  },

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('authLevel');
    delete App.userName;
    delete App.token;
    delete App.authLevel;
    App.router.servePage();
  },

  newPage(page) {
    App.router.Pages.set(App.router.currentPage, page);
  },
  
  newLayout(layout){
    App.router.layouts[App.router.latestLoadedLayout] = layout;
  }

}

App.init();
window.addEventListener('popstate', App.init);
