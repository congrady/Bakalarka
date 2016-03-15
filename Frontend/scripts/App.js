'use strict';

var App = {
  htmlTemplates: new Map(),
  data: {},
  init: function() {
    if (!App.router) {
      App.router = new Router();
      App.resourceLoader = new ResourceLoader();
      App.authenticator = new Authenticator();
    }
    App.router.servePage();
  },
  onDataLoad: function(dataName, func) {
    for (let urlParam of App.router.urlParams){
      dataName += ":" + urlParam;
    }
    let data = App.data[dataName];
    if (data) {
      func(data);
    } else {
      App.resourceLoader.worker.addEventListener("message", function(message) {
        if (message.data.name == dataName) {
          func(JSON.parse(message.data.response));
        }
      });
    }
  },
  getData: function(dataName){
    for (let data of App.data){
      alert(data);
    }
    for (let urlParam of App.router.urlParams){
      dataName += ":" + urlParam;
    }
    let res = {};
    if (App.data[dataName]){
      //res.data = App.data[dataName];
      return App.data[dataName]
    } /*else {
      let dataEntry;
      for (let data of AppConfig.data){
        if (data.name == dataName){
          dataEntry = data;
        }
        if (dataEntry.alt.constructor === Array){
          for (let alt of dataEntry.alt){
            if (App.data[alt]){
              return res.alt = alt;
            }
          }
        } else {
          if (App.data[dataEntry.alt]){
            res.alt = dataEntry.alt;
            return res
          }
        }
      }
    }*/
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
window.addEventListener("hashchange", function(){ alert("ahoj"); })
