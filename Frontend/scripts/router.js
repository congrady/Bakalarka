'use strict';

window["navigationPaths"] = [];

class Router {
  constructor(routes) {
    this.siteName = window.location.hostname + ":" + window.location.port;
    this.currentURL = this.siteName + window.location.pathname;
    this.routes = new Map();
    this.resources = new Map();
    this.availableComponents = new Set();
    for (let route of window["routes"]){
      if (route.navigation){
        window["navigationPaths"].push(route.path);
      }
      this.routes.set(route.path, route.page);
      this.resources.set(route.page, route.resources);
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
    var path = "/"+this.urlParams.shift();
    if (!this.routes.has(path)){
      document.querySelector('main').innerHTML = "Page does not exist.";
      return
    }
    this.currentPage = this.routes.get(path);
    if (window[this.currentPage]){
      this.showPage();
    } else {
      this.loadPage();
    }
  }

  showPage(){
    let page = window[this.currentPage];
    let $mainContent = document.querySelector('main');
    if (page.title) {
      document.getElementsByTagName('title')[0].innerHTML = page.title;
    }
    if (page.css){
      let $style = document.createElement("style");
      $style.innerHTML = page.css;
      $mainContent.appendChild($style);
    }
    while ($mainContent.lastChild) {
      $mainContent.removeChild($mainContent.lastChild);
    }
    $mainContent.appendChild(page.root);
  }

  loadPage(){
    let neededResources = [];
    neededResources.push("/Frontend/pages/"+this.currentPage+".js");
    for (let component of this.resources.get(this.currentPage)){
      if (!this.availableComponents.has(component)){
        neededResources.push("/Frontend/components/"+component+".js");
        this.availableComponents.add(component);
      }
    }
    var self = this;
    ResourceLoader.load(neededResources, function(){
      window[self.currentPage].init(self.urlParams);
      self.showPage();
    });
  }

  addRoute(route){
    this.routes.set(route.path, route.page);
  }
}
