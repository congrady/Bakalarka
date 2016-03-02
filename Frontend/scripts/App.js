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
  onDataLoad(dataName, func) {
    for (let urlParam of App.router.urlParams){
      dataName += ":" + urlParam;
    }
    let data = App.data[dataName];
    if (data) {
      func(data);
    } else {
      App.resourceLoader.worker.addEventListener("message", function(message) {
        if (message.data.name == dataName) {
          func(message.data.response);
        }
      });
    }
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
        let userName = response[0];
        let token = response[1];
        let authLevel = response[2];
        self.userName = userName
        self.token = token;
        self.authLevel = authLevel;
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('authLevel', authLevel);
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
