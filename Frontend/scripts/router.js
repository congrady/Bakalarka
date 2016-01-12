'use strict';

class Router {
  constructor(routes) {
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.currentURL = this.siteName + window.location.pathname;
    this.routes = new Map();
    this.resources = new Map();
    this.availableComponents = new Set();
    this.needAuthentication = new Set();
    this.navigationPaths = [];
    for (let route of FrameworkConfig.routes){
      if (route.navigation){
        this.navigationPaths.push(route.path);
      }
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

  servePage() {
    this.urlParams = location.pathname.substring(1).split("/");
    var path = "/"+this.urlParams.shift();
    if (!this.routes.has(path)){
      this.detachedHandler(null);
      this.showError({pageNotFound: true});
      return
    }
    this.currentPage = this.routes.get(path);
    if (this.needAuthentication.has(this.currentPage)){
      if (sessionStorage.token){
        this.loadPage(true);
      }
      else {
        this.detachedHandler(null);
        this.showError({unauthorized: true});
      }
    }
    else {
      this.loadPage(false);
    }
  }

  showError(error){
    let $mainContent = document.getElementsByTagName('main')[0];
    if (error.unauthorized){
      $mainContent.innerHTML = "This page is available only to logged in users.";
    }
    else if (error.timeout){
      $mainContent.innerHTML = "We can't load this page. Server timeout.";
    }
    else if (error.pageNotFound){
      $mainContent.innerHTML = "Page does not exist.";
    }
  }

  showPage(page){
    let urlParams = this.urlParams;
    let $mainContent = document.getElementsByTagName('main')[0];
    if (page.title) {
      document.getElementsByTagName('title')[0].innerHTML = page.title;
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
    for (var component of this.resources.get(this.currentPage)){
      if (!this.availableComponents.has(component)){
        neededResources.push("/Frontend/components/"+component+".js");
      }
    }
    var self = this;
    if (needAuthentication) {
      ResourceLoader.loadRestrictedScript(neededResources,
                                          function(){
                                            self.availableComponents.add(component);
                                          },
                                          function(){
                                            self.showError({unauthorized: true});
                                          },
                                          function(){
                                            self.showError({timeout: true});
                                          });
    }
    else {
      ResourceLoader.loadScript(neededResources,
                                function(){
                                  self.availableComponents.add(component);
                                },
                                function(){
                                  self.showError({timeout: true});
                                });
    }
  }
}
