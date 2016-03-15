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
    this.resourcePaths = new Map();
    this.availableResources = new Set();
    this.needAuthentication = new Map();
    this.navigation = new Map();
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
          this.navigation.set(route.path[0], {navigation: route.navigation, page: route.page});
        } else {
          this.navigation.set(route.path, {navigation: route.navigation, page: route.page});
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
        this.needAuthentication.set(route.page, route.auth);
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
    let blockingData = new Map();
    let nonBlockingData = new Map();
		if (!this.dataForPage.has(this.currentPage)){
			return []
		}
    for (let neededData of this.dataForPage.get(this.currentPage)) {
      for (let dataEntry of AppConfig.data) {
        if (App.data[dataEntry.alt]){
          continue;
        }
        if (dataEntry.name === neededData) {
          let dataName = dataEntry.name;
          for (let urlParam of this.urlParams) {
            dataName += ":" + urlParam;
          }
          if (!App.data[dataName]) {
            let url = this.prepareRequestURL(dataEntry.url);
            if (dataEntry.blocking) {
              blockingData.set(dataName, url);
            } else {
              nonBlockingData.set(dataName, url);
            }
          }
        }
      }
    }
    App.resourceLoader.loadData(nonBlockingData, needAuthentication);
    return blockingData;
  }

  loadResources(needAuthentication) {
    let blockingData = this.loadNonBlockingDataGetBlockingData(needAuthentication);

    let neededResources = new Map();
    if (this.resourcesForPage.has(this.currentPage)) {
      for (let mapItem of this.resourcesForPage.get(this.currentPage)) {
        if (!this.availableResources.has(mapItem[0])) {
          if (!mapItem[1].includes("web-components")) {
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
    neededResources.set("#", "/Frontend/pages/" + this.currentPage + ".js");

    for (let data of blockingData){
      neededResources.set(data[0], data[1]);
    }

    function onResourceLoad() {
      neededResources.delete("#");
      for (let resource of neededResources) {
        App.router.availableResources.add(resource[0]);
      }
      App.router.showPage();
    }
    if (neededResources.size) {
      App.resourceLoader.loadResources(neededResources, needAuthentication, onResourceLoad);
    } else {
      this.showPage();
    }
  }
}
