'use strict';

class Router {
  constructor() {
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.currentURL = this.siteName + window.location.pathname;
    this.routes = new Map();
    this.resources = new Map();
    this.templates = new Map();
    this.Pages = new Map(); //key: name of the page, value: page object
    this.availableResources = new Set();
    this.needAuthentication = new Set();
    this.navigationPaths = [];
    this.appTitle = FrameworkConfig.title;
    for (let route of FrameworkConfig.routes){
      if (route.navigation){
        this.navigationPaths.push(route.path);
      }
      this.templates.set(route.page, route.template);
      this.routes.set(route.path, route.page);
      this.resources.set(route.page, route.resources);
      if (route.auth){
        this.needAuthentication.add(route.page);
      }
    }
  }

  navigate(newPath, relative){
    if (relative){
      this.currentURL += newPath;
    }
    else {
      this.currentURL = this.siteName + newPath;
    }
    window.history.pushState(null, null, "http://" + this.currentURL);
    this.servePage();
  }

  logout(){
    sessionStorage.removeItem('token');
    for (let page of this.needAuthentication){
      this.Pages.delete(page);
    }
    App.authenticator.userName = null;
    this.servePage();
  }

  login(options){
    var self = this;
    App.authenticator.loginRequest(
      options.login,
      options.password,
      "/login",
      function(userName){
        options.success(userName);
      self.servePage();
      },
      options.error
    );
  }

  servePage() {
    this.urlParams = location.pathname.substring(1).split("/");
    var path = "/"+this.urlParams.shift();
    if (!this.routes.has(path)){
      this.detachedHandler();
      this.showError({pageNotFound: true});
      return;
    }
    this.currentPage = this.routes.get(path);
    document.getElementsByTagName("main-navigation")[0].setAttribute("active", this.currentPage);
    if (this.needAuthentication.has(this.currentPage)){
      if (sessionStorage.token){
        if (this.Pages.has(this.currentPage)){
          this.showPage();
        } else{
          this.loadPage(true);
        }
      }
      else {
        this.detachedHandler();
        this.showError({unauthorized: true});
      }
    }
    else {
      if (this.Pages.has(this.currentPage)){
        this.showPage();
      } else{
        this.loadPage(false);
      }
    }
  }

  showError(error){
    let $mainContent = document.getElementsByTagName('main')[0];
    let $title = document.getElementsByTagName('title')[0];
    $title.innerHTML = this.appTitle;
    if (error.unauthorized){
      $mainContent.innerHTML = "This page is available only to logged in users.";
      $title.innerHTML += "Unauthorized access";
    }
    else if (error.timeout){
      $mainContent.innerHTML = "We can't load this page. Server timeout.";
      $title.innerHTML += "Server timeout";
    }
    else if (error.pageNotFound){
      $mainContent.innerHTML = "Page does not exist.";
      $title.innerHTML += "Page not found";
    }
  }

  showPage(){
    let page = App.router.Pages.get(this.currentPage);
    let urlParams = this.urlParams;
    let $mainContent = document.getElementsByTagName('main')[0];
    if (page.title) {
      document.getElementsByTagName('title')[0].innerHTML = this.appTitle + page.title;
    }
    this.detachedHandler(page.detachedCallback);
    while ($mainContent.lastChild) {
      $mainContent.removeChild($mainContent.lastChild);
    }
    if (page.beforeAttachedCallback) {
      page.beforeAttachedCallback(urlParams);
    }
    if (page.css){
      let $style = document.createElement("style");
      $style.innerHTML = page.css;
      $mainContent.appendChild($style);
    }
    $mainContent.appendChild(page.init(urlParams));
    if (page.afterAttachedCallback) {
      page.afterAttachedCallback(urlParams);
    }
  }

  detachedHandler(newPageDetachedCallback){
    if (this.detachedCallback){
      this.detachedCallback(this.previousPageUrlParams);
    }
    if (newPageDetachedCallback){
      this.detachedCallback = newPageDetachedCallback;
      this.previousPageUrlParams = this.urlParams;
    }
    else {
      this.detachedCallback = null;
      this.previousPageUrlParams = [];
    }
  }

  loadPage(needAuthentication){
    let neededResources = [];
    neededResources.push("/Frontend/pages/"+this.currentPage+".js");
    if (this.templates.get(this.currentPage)){
      neededResources.push("/Frontend/pages/templates/"+this.currentPage+".html");
    }
    for (let component of this.resources.get(this.currentPage)){
      if (!this.availableResources.has(component)){
        neededResources.push("/Frontend/components/"+component+".js");
      }
    }
    var self = this;
    if (needAuthentication) {
      App.resourceLoader.loadRestrictedScript(
        neededResources,
        function(){
          for (let component of neededResources.shift()){
            self.availableResources.add(component);
          }
          self.showPage();
        },
        function(){
          self.showError({unauthorized: true});
        },
        function(){
          self.showError({timeout: true});
        }
      );
    }
    else {
      App.resourceLoader.loadScript(
        neededResources,
        function(){
          for (let component of neededResources.shift()){
            self.availableResources.add(component);
          }
          self.showPage();
        },
        function(){
          self.showError({timeout: true});
        }
      );
    }
  }
}
