'use strict';

class Router {
  constructor(routes) {
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.currentURL = this.siteName;
    this.routes = new Map();
    for (let route of routes){
      this.routes.set(route.path, {
                      handler: route.handler,
                      navigation: route.navigation,
                      isRelative: route.isRelative,
                      isInitialized: false
                      });
      }
  }

  navigate(newPath){
    if (this.routes.get(newPath).isRelative){
        this.currentURL += newPath;
    } else{
        this.currentURL = this.siteName + newPath;
    }
    window.history.pushState(null, null, "http://" + this.currentURL);
    this.servePage();
  }

  servePage() {
    let pathName = location.pathname;
    let additionalParams = pathName.substring(1).split("/");
    additionalParams.shift();
    let currentRoute = this.routes.get(pathName);
    if (!currentRoute.isInitialized){
      //import currentRoute.handler from "../models/"+currentRoute.handler+".js";
      //todo AJAX resource call
      currentRoute.handler.init(additionalParams);
      this.routes.get(pathName).isInitialized = true;
    }
    currentRoute.handler.show();
  }

  addRoute(route){
    this.routes.set(route.path, {
                    handler: route.handler,
                    navigation: route.navigation,
                    isRelative: route.isRelative,
                    isInitialized: false
                    });
  }
}
