'use strict';

var App = {

  init() {
    if (!App.router) {
      App.router = new Router();
      App.resourceLoader = new ResourceLoader();
      App.dataStore = new DataStore();
    }
    this.eventListeners = {};
    if (AppConfig.onAppInit) {
      for (let func of AppConfig.onAppInit) {
        func();
      }
    }
    App.router.servePage();
  },
  
  getUniqueId(){
    if (!this.idSerial){
      this.idSerial = 0;
    }
    this.idSerial++;
    return `_appId_${this.idSerial}`
  },
  
  removeAllEventListeners(){
    if (this.eventListeners){
      this.eventListeners = {};
    }
  },
  
  getUrlParam(param){
    if (App.router.urlParams[param]){
      return copy(App.router.urlParams[param]);
    }
  },
  
  emit(eventName, data){
    if (this.eventListeners && this.eventListeners[eventName]){
      for (let id in App.eventListeners[eventName]){
        let eventListener = this.eventListeners[eventName][id];
        if (data){
          eventListener.callback(data);
        } else {
          eventListener.callback();
        }
      }
    }
  },
  
  removeEventListener(eventName, id){
    if (this.eventListeners && this.eventListeners[eventName]){
      delete this.eventListeners[eventName][id];
    }
  },
  
  on({event, callback, id}){
    if (!this.eventListeners[event]){
      this.eventListeners[event] = {};
    }
    this.eventListeners[event][id] = {callback: callback};
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
  
  reloadPage(){
    // shows page without renderLayout set to False, meaning all contents of the page will reload
    App.router.showPage();
  },
  
  setAuthLevel(level){
    App.authLevel = level;
  },
  
  getAuthLevel(){
    return copy(App.authLevel);
  },
  
  getUserName(){
    return copy(App.userName);
  },
  
  login({userName, token, authLevel}){
    App.userName = userName;
    App.token = token;
    App.authLevel = authLevel;
  },
  
  logout(){
    if (App.userName) delete App.userName;;
    if (App.token) delete App.token;
    if (App.authLevel) delete App.authLevel;
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
