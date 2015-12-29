'use strict';

window["navigationPaths"] = [];

class Router {
  constructor(routes) {
    var self = this;
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.currentURL = this.siteName;
    this.routes = new Map();
    for (let route of window["routes"]){
      if (route.navigation){
        window["navigationPaths"].push(route.path);
      }
      this.routes.set(route.path, route.handler);
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
    var urlParams = location.pathname.substring(1).split("/");
    var path = "/"+urlParams.shift();
    if (!this.routes.has(path)){
      document.getElementById('main-content').innerHTML = "Page does not exist.";
      return
    }
    var handler = this.routes.get(path);
    if (window[handler]){
      window[handler].init();
      window[handler].show();
      return
    }
    loadScript(handler, function(){
      window[handler].urlParams = urlParams;
      window[handler].init();
      window[handler].show();
    });
  }

  addRoute(route){
    this.routes.set(route.path, route.handler);
  }
}
