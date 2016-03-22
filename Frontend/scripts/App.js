'use strict';

var App = {
  htmlTemplates: new Map(),
  data: {},
  actionPool: [],
  init: function() {
    if (!App.router) {
      App.router = new Router();
      App.resourceLoader = new ResourceLoader();
      App.authenticator = new Authenticator();
    }
    App.router.servePage();
  },
  dataHandler: function(params) {
    if (params.specific && App.data[params.dataName] && App.data[params.dataName][params.specific]){
      params.action(App.data[params.dataName][params.specific]);
    } else if (App.data[params.dataName]){
      params.action(App.data[params.dataName])
    } else {
      App.actionPool.push(params);
    }
  },
  fillForm: function(params){
    let formData = new FormData();
    let getURL;
    if (AppConfig.data[params.dataName]['get']){
      getURL = AppConfig.data[params.dataName]['get'].split("$")[0];
    } else {
      getURL = AppConfig.data[params.dataName]['getAll'].split("$")[0];
    }
    let table;
    if (getURL.startsWith(AppConfig.getURL)){
      table = getURL.slice(AppConfig.getURL.length, getURL.length);
    } else {
      table = getURL;
    }
    formData.append("table", table);
    if (params.key){
      formData.append("where", AppConfig.data[params.dataName].key + "=" + params.key);
    }
    if (params.data){
      let colString = "";
      for (let col in params.data){
        colString += (col + "=" + params.data[col]+",");
      }
      colString = colString.slice(0, -1);
      formData.append("columns", colString);
    }
    return formData
  },
  deleteData: function(params){
    let requestParams = {};
    requestParams.method = "DELETE";
    requestParams.url = AppConfig.deleteURL;
    requestParams.formData = this.fillForm({
      key: params.key,
      dataName: params.dataName
    });
    if (params.success){
      requestParams.success = function(){
        App.deleteLocally();
        params.success();
      };
    }
    if (params.error){
      requestParams.error = params.error;
    }
    ajaxREST(requestParams)
  },
  updateData: function(params){
    let requestParams = {};
    requestParams.method = "POST";
    requestParams.url = AppConfig.updateURL;
    requestParams.formData = this.fillForm({
      key: params.key,
      data: params.data,
      dataName: params.dataName
    });
    if (params.success){
      requestParams.success = function(){
        App.updateLocally();
        params.success();
      }
    }
    if (params.error){
      requestParams.error = params.error;
    }
    ajaxREST(requestParams)
  },
  putData: function(params){
    let requestParams = {};
    requestParams.method = "PUT";
    requestParams.url = AppConfig.putURL;
    requestParams.formData = this.fillForm({
      key: params.key,
      data: params.data,
      dataName: params.dataName
    });
    if (params.success){
      requestParams.success = function(){
        App.putLocally();
        params.success();
      }
    }
    if (params.error){
      requestParams.error = params.error;
    }
    ajaxREST(requestParams)
  },
  deleteLocally: function(){

  },
  updateLocally: function(){

  },
  putLocally: function(){

  },
  navigate: function(event, relative) {
    event.preventDefault();

    function getHref(element) {
      if (element.href) {
        return element.href.substring(App.router.defaultUrlLength);
      }
      if (element.parentElement) {
        return getHref(element.parentElement);
      }
      return "404";
    }
    let href = getHref(event.target);
    if (href === "404") {
      App.router.showError("pageNotFound");
    }
    if (relative) {
      App.router.navigate(href, true);
    } else {
      App.router.navigate(href);
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
        document.getElementsByTagName("main-navigation")[0].setAttribute("mode", "auth");
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
    document.getElementsByTagName("main-navigation")[0].setAttribute("mode", "free");
    App.router.servePage();
  },
  newPage: function(page) {
    App.router.Pages.set(App.router.currentPage, page);
  }
}

App.init();
window.addEventListener('popstate', App.init);
