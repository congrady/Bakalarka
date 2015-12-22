'use strict';

class Router {
  constructor(routes) {
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.currentURL = this.siteName;
    this.routes = new Map();
    this.navigationPaths = [];
    for (let route of routes){
      if (route.navigation){
        this.navigationPaths.push(route.path);
      }
      this.routes.set(route.path, {
                      handler: route.handler,
                      navigation: route.navigation,
                      isRelative: route.isRelative,
                      });
      }
  }
  
  createNavigation(){
    var navigation = document.createElement("nav");
    var body = document.getElementsByTagName("body")[0];
    var mainContent = document.getElementById("main-content");
    for (let path of this.navigationPaths){
      var nav = document.createElement("P");
      nav.innerHTML = path.substring(1);
      nav.onclick = this.navigate(path);
      navigation.appendChild(nav);
    }
    body.insertBefore(navigation, mainContent);
  }

  navigate(newPath){
    if (this.routes.get(newPath).isRelative){
        this.currentURL += newPath;
    }
    else {
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
      if (typeof loadResourcesWorker === null){
        dontLoadByWorker(handler+".js");
      }
      loadScript("/Frontend/pages/"+handler+".js", function(){
        if (routeParams != ""){
          window[handler].init(routeParams);
        }
        else {
          window[handler].init();
        }
        window[handler].show();
      });
      if (typeof loadResourcesWorker === null){
        loadResources();
      }
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
