'use strict';

class Router {
  constructor() {
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.defaultUrlLength = this.siteName.length + window.location.protocol.length + 2;
    this.currentURL = this.siteName + window.location.pathname;
    this.routes = new Map();
    this.resourcesForPage = new Map();
    this.dataForPage = new Map();
    this.Pages = new Map();
    this.availableResources = new Set();
    this.needAuthentication = new Map();
    this.navigation = new Map();
    this.appTitle = AppConfig.title ? AppConfig.title : '';
    this.registeredReactComponents = new Set();
    this.htmlTemplates = new Map();
    for (let pageName in AppConfig.pages) {
      let page = AppConfig.pages[pageName];
      if (page.path.constructor === Array) {
        for (let path of page.path) {
          this.routes.set(path, pageName);
        }
      } else {
        this.routes.set(page.path, pageName);
      }
      if (page.navigation) {
        if (page.path.constructor === Array) {
          this.navigation.set(page.path[0], {navigation: page.navigation, page: pageName});
        } else {
          this.navigation.set(page.path, {navigation: page.navigation, page: pageName});
        }
      }
      if (page.resources) {
        this.resourcesForPage.set(pageName, page.resources);
      }
      if (page.data) {
        this.dataForPage.set(pageName, page.data);
      }
      if (page.auth !== undefined) {
        this.needAuthentication.set(pageName, page.auth);
      }
    }
    if (AppConfig.onAppInit) {
      for (let func of AppConfig.onAppInit) {
        func();
      }
    }
  }

  navigate(newPath, relative) {
    this.detachedHandler();
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

  getDataNamesWithParamsMap() {
    let res = new Map();
    for (let dataEntry of AppConfig.data) {
      if (dataEntry.name == this.currentPage) {
        if (dataEntry.blocking) {
          App.resourceLoader.loadBlockingData(dataName, prepareRequestURL(dataEntry.url), true, App.router.showPage());
        } else {
          this.loadData(true);
          this.showPage();
        }
      }
    }
  }

	getURLPath(){
		let url = location.pathname;
    let max = 0;
    let path;
    for (let p of this.routes.keys()) {
      if (url.startsWith(p)) {
        let len = p.length;
        if (len > max) {
          max = len;
          path = p;
        }
      }
    }
    this.urlParams = url.substring(max, url.length).split("/");
    let inappChars = this.urlParams.shift();
    if (max == 0 || inappChars != "") {
      this.showError("pageNotFound");
    } else {
			return path;
		}
	}

  servePage() {
		let path = this.getURLPath()
    this.currentPage = this.routes.get(path);
    if (this.needAuthentication.has(this.currentPage)) {
      if (App.authLevel != undefined) {
				if (App.authLevel <= this.needAuthentication.get(this.currentPage)){
					this.loadResources(true);
				} else {
					this.showError("unauthorized");
				}
      } else {
        this.showError("unauthorized");
      }
    } else {
			this.loadResources(false);
		}
  }

  showError(error) {
    let $mainContent = document.getElementsByTagName('main')[0];
    let $title = document.getElementsByTagName('title')[0];
    $title.innerHTML = this.appTitle + "Error: ";
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
    while ($mainContent.lastChild) {
      $mainContent.removeChild($mainContent.lastChild);
    }
    if (page.beforePageShow) {
      page.beforePageShow(urlParams);
    }
    if (AppConfig.beforePageShow) {
      let param = {};
      param.page = this.currentPage;
      param.urlParams = urlParams;
      for (let func of AppConfig.beforePageShow) {
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
    if (AppConfig.afterPageShow) {
      let param = {};
      param.page = this.currentPage;
      param.urlParams = urlParams;
      for (let func of AppConfig.afterPageShow) {
        func(param);
      }
    }
    this.detached = null;
    if (AppConfig.beforePageDetach) {
      this.detached = true;
    }
    if (page.beforePageDetach) {
      this.detached = page.beforePageDetach;
    }
  }

  detachedHandler() {
    if (this.detachedHandler) {
      let param = {};
      param.page = this.currentPage;
      param.urlParams = this.urlParams;
      if (AppConfig.beforePageDetach) {
        for (let func of AppConfig.beforePageDetach) {
          func(param);
        }
      }
      if (typeof this.detached === `function`) {
        this.detachedHandler();
      }
    }
  }

  prepareRequestURL(url) {
    let len = this.urlParams.length;
    let res = url;
    for (let i = 0; i < len; i++) {
      if (!res.includes("{}")) {
        break
      } else {
        res = res.replace("{}", this.urlParams[i])
      }
    }
    return encodeURIForServer(res);
  }

  loadNonBlockingDataGetBlockingData(needAuthentication) {
    let blockingData = [];
    let nonBlockingData = [];
		if (!this.dataForPage.has(this.currentPage)){
			return []
		}
    let neededData = this.dataForPage.get(this.currentPage);
    for (let dataName in neededData) {
      let url = AppConfig.data[dataName].getURL ?
      AppConfig.data[dataName].getURL :
      AppConfig.getURL;
      let dataModel = AppConfig.data[dataName];
      if (neededData[dataName] == "specific") {
        if (App.dataStore.data[dataName] && dataModel.key && (dataModel.keyIndex !== 'undefined')){
          if (App.dataStore.data[dataName][this.urlParams[dataModel.keyIndex]]){
            continue
          }
        }
        url += dataModel.get;
      } else if (neededData[dataName] == "all"){
        url += dataModel.getAll;
      }
      if (dataModel.blocking) {
        blockingData.push({name: dataName, url: this.prepareRequestURL(url)});
      } else {
        nonBlockingData.push({name: dataName, url: this.prepareRequestURL(url)});
      }
    }
    App.resourceLoader.loadData(nonBlockingData, needAuthentication);

    return blockingData;
  }

  loadResources(needAuthentication) {
    let blockingData = this.loadNonBlockingDataGetBlockingData(needAuthentication);

    let neededResources = [];
    if (this.resourcesForPage.has(this.currentPage)) {
      for (let resourceName of this.resourcesForPage.get(this.currentPage)) {
        if (!this.availableResources.has(resourceName)) {
          let resource = AppConfig.resources[resourceName];
          resource.name = resourceName;
          if (resource.type == 'web-component' && isRegisteredElement(resource.componentName)){
            continue
          } else if (resource.componentName && this.registeredReactComponents.has(resource.componentName)) {
            continue
          } else {
            neededResources.push(resource);
          }
        }
      }
    }
    if (!this.availableResources.has("#" + this.currentPage)){
      neededResources.push({name: "#" + this.currentPage, url: "/Frontend/pages/" + this.currentPage + ".js"});
    }

    for (let data of blockingData){
      neededResources.push(data);
    }

    function onResourceLoad() {
      for (let resource of neededResources) {
        App.router.availableResources.add(resource.name);
        if (resource.type == "react-component"){
          App.router.registeredReactComponents.add(resource.componentName);
        }
      }
      App.router.showPage();
    }
    if (neededResources.length) {
      App.resourceLoader.loadResources(neededResources, needAuthentication, onResourceLoad);
    } else {
      this.showPage();
    }
  }
}
