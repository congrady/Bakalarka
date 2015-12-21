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
    var handler = this.routes.get(pathName).handler;
    if (!handler){
      main_content.innerHTML = "Page does not exist.";
      alert("neni path");
    }
    if (handler.isInitialized){
      window[handler].show();
    }
    else {
      loadScript("Frontend/pages/"+handler+".js", function(){
        window[handler]["init"]();
        window[handler]["show"]();
      });
    }
  }

  addRoute(route){
    this.routes.set(route.path, {
                    handler: route.handler,
                    navigation: route.navigation,
                    isRelative: route.isRelative,
                    });
  }
}
