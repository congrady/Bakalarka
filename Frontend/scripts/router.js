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
    var routeParams = location.pathname.substring(1).split("/");
    var path = "/"+routeParams.shift();
    if (!this.routes.has(path)){
      document.getElementById('main-content').innerHTML = "Page does not exist.";
      return
    }
    var handler = this.routes.get(path).handler;
    if (handler.isInitialized){
      window[handler].show();
    }
    else {
      loadScript("/Frontend/pages/"+handler+".js", function(){
        if (routeParams != ""){
          window[handler].init(routeParams);
        } else {
          window[handler].init();
        }
        window[handler].show();
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
