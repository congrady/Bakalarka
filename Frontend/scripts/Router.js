'use strict';

class Router {
  constructor() {
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.defaultUrlLength = this.siteName.length + window.location.protocol.length + 2;
    this.currentURL = this.siteName + window.location.pathname;
    this.routes = new Map();
    this.resourcesForPage = new Map();
    this.Pages = new Map(); //key: name of the page, value: page object
    this.resourcePaths = new Map();
    this.availableResources = new Set();
    this.needAuthentication = new Set();
    this.navigation = new Map();
    this.resourceParams = new Object();
    this.pageData = new Map();
    this.appTitle = AppConfig.title ? AppConfig.title : '';
    for (let resource of AppConfig.resources){
      this.resourcePaths.set(resource.name, resource.path);
    }
    for (let route of AppConfig.routes){
      this.pageData.set(route.page, []);
      if (route.path.constructor === Array){
        for (let path of route.path){
          this.routes.set(path, route.page);
        }
      }
      else {
        this.routes.set(route.path, route.page);
      }
      if (route.navigation){
        if (route.path.constructor === Array) {
          this.navigation.set(route.path[0], route.navigation);
        }
        else {
          this.navigation.set(route.path, route.navigation);
        }
      }
      if (route.resources){
        let resourceMap = new Map();
        for (let resourceName of route.resources){
          resourceMap.set(resourceName, this.resourcePaths.get(resourceName));
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
    if (sessionStorage.getItem("lastURL") == this.currentURL){
      window.history.replaceState(null, null, "http://" + this.currentURL);
    }
    else {
      window.history.pushState(null, null, "http://" + this.currentURL);
      sessionStorage.setItem("lastURL", this.currentURL);
    }
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
      this.showError("pageNotFound");
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
        this.showError("unauthorized");
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
    $title.innerHTML = this.appTitle + "Error";
    if (error === "unauthorized"){
      $mainContent.innerHTML = "<p>This page is available only to logged in users.</p>";
      $title.innerHTML += "Unauthorized access";
    }
    else if (error === "timeout"){
      $mainContent.innerHTML = "<p>We can't load this page. Server timeout.</p>";
      $title.innerHTML += "Server timeout";
    }
    else if (error === "pageNotFound"){
      $mainContent.innerHTML = "<p>Page does not exist.</p>";
      $title.innerHTML += "Page not found";
    }
  }

  showPage(){
    let data;
    let currentPageData = App.router.pageData.get(this.currentPage);
    if (currentPageData){
      data = new Object();
      for (let dataName of currentPageData){
        data[dataName] = App.data[dataName];
      }
    }
    let page = this.Pages.get(this.currentPage);
    let urlParams = this.urlParams != "" ? this.urlParams : null;
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
    if (data !== undefined){
      $mainContent.appendChild(page.init(urlParams, data));
    }
    else {
      $mainContent.appendChild(page.init(urlParams, null));
    }
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
    let neededResources = new Map();
    if (this.resourcesForPage.has(this.currentPage)){
      for (let mapItem of this.resourcesForPage.get(this.currentPage)){
        if (!this.availableResources.has(mapItem[0])){
          if (!mapItem[1].includes("components")){
            if (mapItem[1].endsWith(".html") || mapItem[1].endsWith(".js")){
              neededResources.set(mapItem[0], mapItem[1]);
            }
            else {
              if (mapItem[1].endsWith("}")){
                let pos = mapItem[1].indexOf("{");
                let paramNames = mapItem[1].slice(pos+1,-1).split(",");
                let realParams = location.pathname.substring(1).split("/");
                realParams.shift();
                let queryString = "";
                let len = realParams.length;
                for (let i = 0; i < len; i++){
                  queryString += "&" + paramNames[i] + "=" + realParams[i];
                }
                let URL = mapItem[1].slice(0, pos) + queryString;
                neededResources.set(mapItem[0], encodeURIForServer(URL));
                alert(encodeURIForServer(URL));
              }
            }
          }
          else {
            if (!isRegistered(mapItem[1].substring(mapItem[1].lastIndexOf("/")+1, mapItem[1].lastIndexOf(".")))){
              neededResources.set(mapItem[0], mapItem[1]);
            }
          }
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
            App.router.availableResources.add(resource[0]);
            if (resource[1].endsWith("}")){
              App.router.pageData.get(App.router.currentPage).push(resource[0]);
            }
          }
          App.router.showPage();
        },
        function(){
          App.router.showError("timeout");
      });
    }
    else {
      App.resourceLoader.loadRestrictedScript(
        neededResources,
        function(){
          neededResources.delete("#");
          for (let resource of neededResources){
            App.router.availableResources.add(resource[0]);
            if (resource[1].startsWith("/GET") || resource[1].startsWith("/POST") || resource[1].startsWith("/PUT") || resource[1].startsWith("/DELETE")
                || resource[1].startsWith("/EXP")){
              App.router.pageData.get(App.router.currentPage).push(resource[0]);
            }
          }
          App.router.showPage();
        },
        function(){
          App.router.showError("unauthorized");
        },
        function(){
          App.router.showError("timeout");
        }
      );
    }
  }
}
