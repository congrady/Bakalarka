'use strict';

class Router {
  constructor() {
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.currentURL = this.siteName + window.location.pathname;
    this.routes = new Map();
    this.resourcesForPage = new Map();
    this.Pages = new Map(); //key: name of the page, value: page object
    this.resourcePaths = new Map();
    this.availableResources = new Set();
    this.needAuthentication = new Set();
    this.navigationNames = new Map();
    this.navigationPaths = [];
    this.appTitle = FrameworkConfig.title;
    for (let resource of FrameworkConfig.resources){
      this.resourcePaths.set(resource.name, resource.path);
    }
    for (let route of FrameworkConfig.routes){
      this.routes.set(route.path, route.page);
      if (route.navigation){
        this.navigationPaths.push(route.path);
        this.navigationNames.set(route.path, route.navigation);
      }
      if (route.resources){
        let resourceMap = new Map();
        for (let resource of route.resources){
          resourceMap.set(resource, this.resourcePaths.get(resource));
        }
        this.resourcesForPage.set(route.page, resourceMap);
      }
      if (route.auth){
        this.needAuthentication.add(route.path);
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
    let urlPath = ("/"+this.urlParams.shift()).split("=");
    let path = urlPath[0];
    if (urlPath[1]){
      this.urlParams.unshift(urlPath[1]);
    }
    if (!this.routes.has(path)){
      this.detachedHandler();
      this.showError({pageNotFound: true});
      return;
    }
    this.currentPage = this.routes.get(path);
    document.getElementsByTagName("main-navigation")[0].setAttribute("active", this.currentPage);
    if (this.needAuthentication.has(path)){
      if (App.userName){
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
      $mainContent.innerHTML = "<p>This page is available only to logged in users.</p>";
      $title.innerHTML += "Unauthorized access";
    }
    else if (error.timeout){
      $mainContent.innerHTML = "<p>We can't load this page. Server timeout.</p>";
      $title.innerHTML += "Server timeout";
    }
    else if (error.pageNotFound){
      $mainContent.innerHTML = "<p>Page does not exist.</p>";
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
    /*
    let neededResources = [];
    neededResources.push("/Frontend/pages/"+this.currentPage+".js");
    let resourcesForCurrentPage
    if (resourcesForCurrentPage = this.resourcesForPage.get(this.currentPage)){
      for (let resourceName of resourcesForCurrentPage){
        let resourcePath = this.resourcePaths.get(resourceName);
        //alert(`${resourcePath} ${sessionStorage.getItem(resourcePath)}`);
        if (!this.availableResources.has(resourcePath)) {
          if (resourcePath.includes("components/") && sessionStorage.getItem(resourcePath)){
            //alert(sessionStorage.getItem(resourcePath));
            continue; //web component is already registered, no need to load again
          }
          neededResources.push(resourcePath);
        }
      }
    }*/
    let neededResources = new Map();
    if (this.resourcesForPage.has(this.currentPage)){
      for (let mapItem of this.resourcesForPage.get(this.currentPage)){
        if (!this.availableResources.has(mapItem[0])){
          neededResources.set(mapItem[0], mapItem[1]);
        }
      }
    }
    neededResources.set("#", "/Frontend/pages/"+this.currentPage+".js")
    var self = this;
    if (!needAuthentication) {
      App.resourceLoader.loadScript(
        neededResources,
        function(){
          neededResources.delete("#");
          for (let resource of neededResources){
            self.availableResources.add(resource[0]);
            if (resource[1].includes("components/")){
              sessionStorage.setItem(resource, true);
            }
          }
          self.showPage();
        },
        function(){
          self.showError({timeout: true});
        }
      );
    }
    else {
      App.resourceLoader.loadRestrictedScript(
        neededResources,
        function(){
          neededResources.delete("#");
          for (let resource of neededResources){
            self.availableResources.add(resource[0]);
            if (resource[1].includes("components/")){
              sessionStorage.setItem(resource, true);
            }
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
  }
}
