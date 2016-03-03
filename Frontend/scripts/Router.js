'use strict';

class Router {
  constructor() {
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.defaultUrlLength = this.siteName.length + window.location.protocol.length + 2;
    this.currentURL = this.siteName + window.location.pathname;
    this.routes = new Map();
    this.resourcesForPage = new Map();
    this.dataForPage = new Map();
    this.Pages = new Map(); //key: name of the page, value: page object
    this.resourcePaths = new Map();
    this.availableResources = new Set();
    this.needAuthentication = new Map();
    this.navigation = new Map();
    this.resourceParams = {};
    this.pageData = new Map();
    this.appTitle = AppConfig.title ? AppConfig.title : '';
    for (let resource of AppConfig.resources) {
      this.resourcePaths.set(resource.name, resource.path);
    }
    for (let route of AppConfig.routes) {
      this.pageData.set(route.page, []);
      if (route.path.constructor === Array) {
        for (let path of route.path) {
          this.routes.set(path, route.page);
        }
      } else {
        this.routes.set(route.path, route.page);
      }
      if (route.navigation) {
        if (route.path.constructor === Array) {
          this.navigation.set(route.path[0], route.navigation);
        } else {
          this.navigation.set(route.path, route.navigation);
        }
      }
      if (route.resources) {
        let resourceMap = new Map();
        for (let resourceName of route.resources) {
          resourceMap.set(resourceName, this.resourcePaths.get(resourceName));
        }
        this.resourcesForPage.set(route.page, resourceMap);
      }
      if (route.data) {
        let neededData = [];
        for (let dataName of route.data) {
          neededData.push(dataName);
        }
        this.dataForPage.set(route.page, neededData);
      }
      if (route.auth !== undefined) {
        this.needAuthentication.set(route.path, route.auth);
      }
    }
  }

  navigate(newPath, relative) {
    if (relative) {
      this.currentURL += newPath;
    } else {
      this.currentURL = this.siteName + newPath;
    }
    if (sessionStorage.getItem("lastURL") == this.currentURL) {
      window.history.replaceState(null, null, "http://" + this.currentURL);
    } else {
      window.history.pushState(null, null, "http://" + this.currentURL);
      sessionStorage.setItem("lastURL", this.currentURL);
    }
    this.servePage();
  }

  servePage() {
    this.urlParams = location.pathname.substring(1).split("/");
    let path = "/" + this.urlParams.shift();
    if (!this.routes.has(path)) {
      this.detachedHandler();
      this.showError("pageNotFound");
      return;
    }
    this.currentPage = this.routes.get(path);
    if (this.needAuthentication.has(path)) {
      if (App.hasOwnProperty("authLevel")) {
        if (App.authLevel <= this.needAuthentication.get(path)) {
          if (this.Pages.has(this.currentPage)) {
            if (!this.dataForPage.has(this.currentPage)){
              this.showPage();
            } else {
              let dataName = this.currentPage;
              for (let urlParam of this.urlParams){
                dataName += ":" + urlParam;
              }
              if (!App.data[dataName]){
                this.loadData(true);
              }
              this.showPage();
            }
          } else {
            this.loadPage(true);
            if (this.dataForPage.has(this.currentPage)) {
              this.loadData(true);
            }
          }
        }
      } else {
        this.detachedHandler();
        this.showError("unauthorized");
      }
    } else {
      if (this.Pages.has(this.currentPage)) {
        this.showPage();
      } else {
        this.loadPage(false);
        if (this.dataForPage.has(this.currentPage)) {
          this.loadData(false);
        }
      }
    }
  }

  showError(error) {
    let $mainContent = document.getElementsByTagName('main')[0];
    let $title = document.getElementsByTagName('title')[0];
    $title.innerHTML = this.appTitle + "Error";
    if (error === "unauthorized") {
      $mainContent.innerHTML = "<p>This page is available only to logged in users.</p>";
      $title.innerHTML += "Unauthorized access";
    } else if (error === "timeout") {
      $mainContent.innerHTML = "<p>We can't load this page. Server timeout.</p>";
      $title.innerHTML += "Server timeout";
    } else if (error === "pageNotFound") {
      $mainContent.innerHTML = "<p>Page does not exist.</p>";
      $title.innerHTML += "Page not found";
    } else {
      $mainContent.innerHTML = "<p>Unexpected Error occured.</p>";
      $title.innerHTML += "Unexpected Error";
    }
  }

  showPage() {
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
    if (page.beforePageShow) {
      page.beforePageShow(urlParams);
    }
    if (AppConfig.beforePageShow){
      for (let func of AppConfig.beforePageShow){
        let param = {};
        param.page = this.currentPage;
        param.urlParams = urlParams;
        func(param);
      }
    }
    if (page.css) {
      let $style = document.createElement("style");
      $style.innerHTML = page.css;
      $mainContent.appendChild($style);
    }
    let res = page.init(urlParams);
    if (res.constructor === DocumentFragment) {
      $mainContent.appendChild(res);
    } else {
      this.showError(res);
    }
    if (page.afterPageShow) {
      page.afterPageShow(urlParams);
    }
    if (AppConfig.afterPageShow){
      for (let func of AppConfig.afterPageShow){
        let param = {};
        param.page = this.currentPage;
        param.urlParams = urlParams;
        func(param);
      }
    }
  }

  detachedHandler(newPageDetachedCallback) {
    if (this.detachedCallback) {
      this.detachedCallback(this.previousPageUrlParams);
    }
    if (newPageDetachedCallback) {
      this.detachedCallback = newPageDetachedCallback;
      this.previousPageUrlParams = this.urlParams;
    } else {
      this.detachedCallback = null;
      this.previousPageUrlParams = [];
    }
  }

  prepareRequestURL(dataEntry){
    let requestURL = "/GET/" + dataEntry.table + "$";
    let urlParams = this.urlParams;
    if (dataEntry.columns) {
      for (let sl of dataEntry.columns) {
        requestURL += sl + ",";
      }
    } else {
      requestURL += "*,";
    }
    requestURL = requestURL.slice(0, -1) + "$";
    AppConfig.title ? AppConfig.title : '';
    let condLen = dataEntry.conditions.length;
    let urlParamsLen = urlParams.length;
    let len = condLen <= urlParamsLen ? condLen : urlParamsLen;
    for (let i = 0; i < len; i++) {
      if (dataEntry.conditions[i].endsWith("{}")) {
        requestURL += dataEntry.conditions[i].replace("{}", urlParams[i]) + ",";
      } else {
        requestURL += "," + urlParams[i];
      }
      requestURL = requestURL.slice(0, -1);
    }
    requestURL += "$";
    if (dataEntry.groupBy) {
      for (let o of dataEntry.groupBy) {
        requestURL += o + ",";
      }
      requestURL = requestURL.slice(0, -1);
    }
    requestURL += "$";
    if (dataEntry.orderBy) {
      for (let o of dataEntry.orderBy) {
        requestURL += o + ",";
      }
      requestURL = requestURL.slice(0, -1);
    }
    return encodeURIForServer(requestURL);
  }

  loadData(needAuthentication) {
    let neededDataMap = new Map();
    let urlParams = this.urlParams;
    for (let neededData of this.dataForPage.get(this.currentPage)) {
      for (let dataEntry of AppConfig.data) {
        if (dataEntry.name === neededData) {
          let dataName = dataEntry.name;
          if (dataEntry.conditions) {
            for (let urlParam of urlParams) {
              dataName += ":" + urlParam;
            }
          }
          if (!App.data[dataName]) {
            if (dataEntry.url) {
              neededDataMap.set(dataName, dataEntry.url);
            } else {
              let url = this.prepareRequestURL(dataEntry);
              neededDataMap.set(dataName, url);
            }
          }
        }
      }
    }
    if (needAuthentication) {
      App.resourceLoader.loadData(neededDataMap, true);
    } else {
      App.resourceLoader.loadData(neededDataMap, false);
    }
  }

  loadPage(needAuthentication) {
    let neededResources = new Map();
    if (this.resourcesForPage.has(this.currentPage)) {
      for (let mapItem of this.resourcesForPage.get(this.currentPage)) {
        if (!this.availableResources.has(mapItem[0])) {
          if (!mapItem[1].includes("components")) {
            if (mapItem[1].endsWith(".html") || mapItem[1].endsWith(".js")) {
              neededResources.set(mapItem[0], mapItem[1]);
            }
          } else {
            if (mapItem[1].endsWith(".js") && !isRegistered(mapItem[1].substring(mapItem[1].lastIndexOf("/") + 1, mapItem[1].lastIndexOf(".")))) {
              neededResources.set(mapItem[0], mapItem[1]);
            }
          }
        }
      }
    }

    neededResources.set("#", "/Frontend/pages/" + this.currentPage + ".js")

    function onResourceLoad(){
      neededResources.delete("#");
      for (let resource of neededResources) {
        App.router.availableResources.add(resource[0]);
      }
      App.router.showPage();
    }

    App.resourceLoader.loadResources(neededResources, needAuthentication, onResourceLoad);
  }
}
