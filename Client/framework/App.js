'use strict';

var App = {
  
  // Initializes framework
  // This happens on every browser page reload or navigation back/forward
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
  
  // Unique application-wise id generator
  // API
  getUniqueId(){
    if (!this.idSerial){
      this.idSerial = 0;
    }
    this.idSerial++;
    return `_appId_${this.idSerial}`
  },
  
  // removes all event listeners
  // API
  removeAllEventListeners(){
    if (this.eventListeners){
      this.eventListeners = {};
    }
  },
  
  // Gets specified url parameter from current url
  // API
  getUrlParam(param){
    if (App.router.urlParams[param]){
      return copy(App.router.urlParams[param]);
    }
  },
  
  // Emits even with specified name and optionally data
  // API
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
  
  // removes specified event listener
  // API
  removeEventListener(eventName, id){
    if (this.eventListeners && this.eventListeners[eventName]){
      delete this.eventListeners[eventName][id];
    }
  },
  
  // Adds event listener with specified parameters
  // API
  on({event, callback, id}){
    if (!this.eventListeners[event]){
      this.eventListeners[event] = {};
    }
    this.eventListeners[event][id] = {callback: callback};
  },
  
  // Makes specified action for specified data, when they are succesfully loaded
  // API For non blocking data
  // API
  dataHandler(params) {
    this.dataStore.dataHandler(params);
  },
  
  // updates data for both client and server
  // API
  updateData(params) {
    this.dataStore.updateData(params);
  },
  
  // puts data for both client and server
  // API
  putData(params) {
    this.dataStore.putData(params);
  },
  
  // deletes data for both client and server
  // API
  deleteData(params) {
    this.dataStore.deleteData(params);
  },
  
  // puts specified data only for client (memory)
  // API
  putClientData(params) {
    this.dataStore.putClientData(params)
    params.action = 'PUT';
    this.dataStore.enqueueDataChange(params);
  },
  
  // updates specified data only for client (memory)
  // API
  updateClientData(params) {
    this.dataStore.updateClientData(params);
    params.action = 'UPDATE';
    this.dataStore.enqueueDataChange(params);
  },
  
  // deletes specified data only from client (memory)
  // API
  deleteClientData(params) {
    this.dataStore.deleteClientData(params);
    params.action = 'DELETE';
    this.dataStore.enqueueDataChange(params);
  },
  
  // API
  syncData(params) {
    this.dataStore.syncData(params)
  },
  
  // invalidates specified data, meaning they should load from server
  // when they are next time needed
  // API
  invalidateData(dataName, index){
    App.dataStore.invalidateData(dataName, index);
  },
  
  
  // navigates user inside the application
  // if href is not set, tries to get it from event.target and recursively from it's parents
  // API
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
  
  // shows page without renderLayout set to False, meaning all contents of the page will reload
  // API
  reloadPage(){
    App.router.showPage();
  },
  
  // sets authorization level
  // API
  setAuthLevel(level){
    App.authLevel = level;
  },
  
  // returns copy of authorization level
  // API
  getAuthLevel(){
    return copy(App.authLevel);
  },
  
  // returns copy of userName
  // API
  getUserName(){
    return copy(App.userName);
  },
  
  // logs in user with given parameters
  // API
  login({userName, token, authLevel}){
    App.userName = userName;
    App.token = token;
    App.authLevel = authLevel;
  },
  
  // logouts current user
  // API
  logout(){
    if (App.userName) delete App.userName;;
    if (App.token) delete App.token;
    if (App.authLevel) delete App.authLevel;
  },
  
  // adds new page to application memory
  // API
  newPage(page) {
    App.router.Pages.set(App.router.currentPage, page);
  },
  
  // adds new layout to application memory
  // API
  newLayout(layout){
    App.router.layouts[App.router.latestLoadedLayout] = layout;
  }

}

App.init();
window.addEventListener('popstate', App.init);
