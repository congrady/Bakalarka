'use strict';

class Router {
  constructor() {
    this.siteName = window.location.hostname + ':' + window.location.port;
    this.defaultUrlLength = this.siteName.length + window.location.protocol.length + 2;
    this.currentURL = this.siteName + window.location.pathname;
    this.dataForPage = new Map();
    this.Pages = new Map();
    this.routes = {};
    this.availableResources = new Set();
    this.needAuthentication = new Map();
    this.appTitle = AppConfig.title ? AppConfig.title : '';
    this.registeredReactComponents = new Set();
    this.htmlTemplates = new Map();
    this.layouts = {};
    for (let pageName in AppConfig.pages) {
      let page = AppConfig.pages[pageName];
      if (page.path.constructor === Array) {
        for (let path of page.path) {
          this.setRoute(pageName, path);
        }
      } else {
        this.setRoute(pageName, page.path);
      }
      if (page.data) {
        this.dataForPage.set(pageName, page.data);
      }
      if (page.auth !== undefined) {
        this.needAuthentication.set(pageName, page.auth);
      }
    }
  }
  
  // Initializes router paths and it's needed url params
  setRoute(pageName, path) {
    let index = path.indexOf(':');
    let urlParams;
    if (index != -1) {
      let adjustedPath = path.slice(0, index);
      let rest = path.slice(index, path.length);
      urlParams = rest.split(':');
      urlParams.map(function (_, i) {
        if (urlParams[i] == '') {
          urlParams.splice(i, 1);
        }
        if (urlParams[i].endsWith('/')) {
          urlParams[i] = urlParams[i].slice(0, -1);
        }
      })
      path = adjustedPath;
    }
    if (path.endsWith('/') && path != '/') {
      path = path.slice(0, -1);
    }
    this.routes[path] = { page: pageName, urlParams: urlParams };
  }
  
  
  // Navigates to desired URL
  // Uses history API routing
  // If newPath is the same as last, doesnt add new record to history, 
  // just reloads the page
  navigate(newPath, relative) {
    this.detachedHandler();
    if (relative) {
      this.currentURL += newPath;
    } else {
      this.currentURL = this.siteName + newPath;
    }
    if (sessionStorage.getItem('lastURL') == this.currentURL) {
      window.history.replaceState(null, null, 'http://' + this.currentURL);
    } else {
      window.history.pushState(null, null, 'http://' + this.currentURL);
      sessionStorage.setItem('lastURL', this.currentURL);
    }
    this.servePage(false);
  }
  
  // Sets curent page and it's URL params depending on current URL
  // and path/url params set in page config
  setCurrentPageAndUrlParams() {
    let url = location.pathname;
    let max = 0;
    let currentPath;

    for (let path in this.routes) {
      if (url.startsWith(path)) {
        let len = path.length;
        if (len > max) {
          max = len;
          currentPath = path;
        }
      }
    }
    this.urlParams = {};
    this.currentPage = this.routes[currentPath].page;
    let unassignedParams = url.substring(max, url.length).split('/');

    let inappropriateChars = unassignedParams.shift();
    if (max == 0 || inappropriateChars != '') {
      return
    } else {
      this.currentPage = this.routes[currentPath].page;
      if (this.routes[currentPath].urlParams) {
        let i = 0;
        for (let param of this.routes[currentPath].urlParams) {
          if (unassignedParams[i]) {
            this.urlParams[param] = unassignedParams[i];
            i++;
          } else {
            break
          }
        }
      }
    }
  }
  
  // Decides which page to load
  // If theres an error, shows error
  // If page needs dependencies that are not already loaded, loads dependencies
  servePage() {
    //App.removeAllEventListeners();
    this.setCurrentPageAndUrlParams();
    let errorLayout = this.currentLayout ? this.currentLayout : 'default';
    if (!this.currentPage) {
      this.loadResources({ needAuthentication: false, layout: errorLayout, error: 'pageNotFound' });
      return
    }
    let layout = AppConfig.pages[this.currentPage].layout ?
      AppConfig.pages[this.currentPage].layout : 'default';
    if (this.needAuthentication.has(this.currentPage)) {
      if (App.authLevel != undefined) {
        if (App.authLevel <= this.needAuthentication.get(this.currentPage)) {
          this.loadResources({ needAuthentication: true, layout: layout });
        } else {
          this.loadResources({ needAuthentication: false, layout: errorLayout, error: 'unauthorized' });
        }
      } else {
        this.loadResources({ needAuthentication: false, layout: errorLayout, error: 'unauthorized' });
      }
    } else {
      this.loadResources({ needAuthentication: false, layout: layout });
    }
  }
  
  // Sends error message content to renderPage
  // Sets error title
  showError(error) {
    let title = document.getElementsByTagName('title')[0];
    let errorMessage = document.createElement('p');
    title.innerHTML = this.appTitle + 'Error: ';
    if (error === 'unauthorized') {
      errorMessage.innerHTML = '<p>This page is available only to logged in users.</p>';
      title.innerHTML += 'Unauthorized access';
    } else if (error === 'timeout') {
      errorMessage.innerHTML = '<p>We can\'t load this page. Server timeout.</p>';
      title.innerHTML += 'Server timeout';
    } else if (error === 'pageNotFound') {
      errorMessage.innerHTML = '<p>Page does not exist.</p>';
      title.innerHTML += 'Page not found';
    } else {
      errorMessage.innerHTML = '<p>Unexpected Error occured.</p>';
      title.innerHTML += 'Unexpected Error';
    }
    this.renderPage({ contents: errorMessage, layout: 'default' });
  }
  
  // Renders page contents
  // If page needs different then current layouts, renders layout aswell
  renderPage({contents, layout, renderLayout}) {
    let body = document.getElementsByTagName('body')[0];
    if (this.currentLayout == layout && !renderLayout) {
      let routerOutlet = document.getElementById('router-outlet');
      while (routerOutlet.lastChild) {
        routerOutlet.removeChild(routerOutlet.lastChild);
      }
      routerOutlet.appendChild(contents);
    } else {
      while (body.lastChild) {
        body.removeChild(body.lastChild);
      }
      let newContent = new DocumentFragment();
      this.currentLayout = layout;
      newContent.appendChild(this.layouts[layout].render());
      let routerOutlet = newContent.querySelector('#router-outlet');
      routerOutlet.appendChild(contents);
      body.appendChild(newContent);
    }
  }
  
  
  // Handles showing of page contents itself
  // Calls init of current page, and renders result in router outlet (using renderPage)
  // If theres an error, renders error message
  // Calls page's lifecycle events, such as beforePageShow, afterPageShow and beforePageDetach
  showPage(renderLayout) {
    if (renderLayout === 'undefined'){
      renderLayout = true;
    }
    let page = this.Pages.get(this.currentPage);
    if (AppConfig['pages'][this.currentPage]['title']) {
      document.getElementsByTagName('title')[0].innerHTML = this.appTitle + AppConfig['pages'][this.currentPage]['title'];
    }
    if (page.beforePageShow) {
      page.beforePageShow();
    }
    if (AppConfig.beforePageShow) {
      for (let func of AppConfig.beforePageShow) {
        func();
      }
    }
    // Todo: Add prefix to apply inline-string-css only to current page
    if (page.css) {
      let style = document.createElement('style');
      style.innerHTML = page.css;
      document.body.appendChild(style);
    }
    let contents = page.init();
    if (contents.constructor === DocumentFragment) {
      let layout = page.layout ? page.layout : 'default';
      this.renderPage({ contents: contents, layout: layout, renderLayout: renderLayout });
    } else {
      this.showError();
    }
    if (page.afterPageShow) {
      page.afterPageShow();
    }
    if (AppConfig.afterPageShow) {
      for (let func of AppConfig.afterPageShow) {
        func();
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
  
  // Handles execution of detached callbacks, that should be
  // executed after page has been detached
  detachedHandler() {
    if (this.detachedHandler) {
      if (AppConfig.beforePageDetach) {
        for (let func of AppConfig.beforePageDetach) {
          func();
        }
      }
      if (typeof this.detached === 'function') {
        this.detachedHandler();
      }
    }
  }
  
  
  // Prepares data request url, replacing needed params with real params
  prepareDataRequestURL(url) {
    for (let param in this.urlParams) {
      url = url.replace(`{${param}}`, this.urlParams[param]);
    }
    return encodeURIForServer(url);
  }
  
  // Starts loading of non-blocking data, and returns blocking data
  // Blocking data are added then loaded together with other resources
  loadNonBlockingDataGetBlockingData(needAuthentication) {
    let blockingData = [];
    let nonBlockingData = [];
    if (!this.dataForPage.has(this.currentPage)) {
      return []
    }
    let neededData = this.dataForPage.get(this.currentPage);
    for (let dataName in neededData) {
      let url;
      let dataModel = AppConfig.data[dataName];
      if (neededData[dataName] == 'specific') {
        let keyIndex = dataModel.keyIndex ? dataModel.keyIndex : 0;
        if (App.dataStore.data[dataName] && dataModel.key) {
          if (App.dataStore.data[dataName][this.urlParams[keyIndex]]) {
            continue
          }
        }
        url = dataModel.get;
      } else if (neededData[dataName] == 'all') {
        url = dataModel.getAll;
      }
      if (dataModel.blocking) {
        blockingData.push({ name: dataName, url: this.prepareDataRequestURL(url) });
      } else {
        nonBlockingData.push({ name: dataName, url: this.prepareDataRequestURL(url) });
      }
    }
    App.resourceLoader.loadData(nonBlockingData, needAuthentication);

    return blockingData;
  }
  
  // returns needed scripts
  getNeededScripts(neededScripts){
    let neededResources = [];
    
    for (let scriptName of neededScripts) {
      let script = AppConfig.scripts[scriptName];
      if (!this.availableResources.has(script.url)) {
        neededResources.push({ url: script.url, type: 'script' });
      }
    }
    return neededResources;
  }
  
  // returns needed templates
  getNeededTemplates(neededTemplates){
    let neededResources = [];
    
    for (let templateName of neededTemplates) {
      let template = AppConfig.templates[templateName];
      if (!this.availableResources.has(template.url)) {
        neededResources.push({ url: template.url, type: 'template', name: templateName });
      }
    }
    return neededResources;
  }
  
  // returns needed components and it's dependencies
  getNeededComponents(neededComponents){
    let neededResources = [];
    
    for (let componentName of neededComponents) {
      let component = AppConfig.components[componentName];
      if (!this.availableResources.has(component.url)) {
        if (isRegisteredHTMLElement(componentName)) {
          //component already registered or can't be registered because of name conflict with native element
        } else if (component.type == 'react' && this.registeredReactComponents.has(componentName)) {
          //react component already registered 
        } else {
          let resource = { url: component.url };
          if (component.template){
            neededResources = neededResources.concat(this.getNeededTemplates(component.template));
          }
          if (component.scripts){
            neededResources = neededResources.concat(this.getNeededScripts(component.scripts));
          }
          if (component.type == 'react') {
            resource.type = 'react';
            resource.componentName = componentName;
          } else {
            resource.type = 'web-component';
          }
          neededResources.push(resource);
        }
      }
    }
    return neededResources
  }
  
  
  // Todo: refactor and simplify, using same code twice for loading layout dependencies and page dependencies
  loadResources({needAuthentication, layout, error}) {
    // Adds blocking data to loading list and starts loading of non-blocking data
    let blockingData = this.loadNonBlockingDataGetBlockingData(needAuthentication);
    
    let neededResources = [];
    neededResources = neededResources.concat(blockingData);
    
    // Loads global dependencies
    if (!this.globalDependenciesLoaded){
      for (let globalDependency of AppConfig.globalDependencies){
        neededResources.push({ 
          url: globalDependency.url, 
          type: 'global-dependency', 
          wrap: globalDependency.wrap ? globalDependency.wrap : undefined
        });
      }
    }
    
    // Adds layout scripts and optionally it's dependencies to loading list
    if (!this.availableResources.has(AppConfig.layouts[layout].url)) {
      // For accessing layout name after it has been loaded
      this.latestLoadedLayout = layout;
      neededResources.push({ url: AppConfig.layouts[layout].url, type: 'script' });
    }
    // Adds templates needed by layout to loading list    
    if (AppConfig.layouts[layout].template) {
      neededResources = neededResources.concat(this.getNeededTemplates(AppConfig.layouts[layout].template));
    }
    // Adds scripts needed by layout to loading list
    if (AppConfig.layouts[layout].scripts) {
      neededResources = neededResources.concat(this.getNeededScripts(AppConfig.layouts[layout].scripts));
    }
    // Adds components needed by layout to loading list
    if (AppConfig.layouts[layout].components) {
      neededResources = neededResources.concat(this.getNeededComponents(AppConfig.layouts[layout].components));
    }

    if (!error) {
      // Adds templates needed by page to loading list
      if (AppConfig.pages[this.currentPage].template) {
        neededResources = neededResources.concat(this.getNeededTemplates(AppConfig.pages[this.currentPage].template));
      }
      // Adds scripts needed by page to loading list
      if (AppConfig.pages[this.currentPage].scripts) {
        neededResources = neededResources.concat(this.getNeededScripts(AppConfig.pages[this.currentPage].scripts));
      }
      // Adds components needed by page to loading list
      if (AppConfig.pages[this.currentPage].components) {
        neededResources = neededResources.concat(this.getNeededComponents(AppConfig.pages[this.currentPage].components));
      }
      // Adds page script itself to loading list
      if (!this.availableResources.has(AppConfig.pages[this.currentPage].url)) {
        neededResources.push({ url: AppConfig.pages[this.currentPage].url, type: 'script' });
      }
    }
    
    let afterResourceLoad = error ?
      function () { App.router.showError(error) } :
      function () { App.router.showPage() };
    // Sends loading list and callback (that shows curent page or error) to resource loader
    // Adds loaded resources to available resources set
    if (neededResources.length) {
      App.resourceLoader.loadResources(neededResources, needAuthentication, function () {
        for (let resource of neededResources) {
          App.router.availableResources.add(resource.url);
        }
        App.router.globalDependenciesLoaded = true;
        afterResourceLoad();
      });
    } else {
      afterResourceLoad();
    }
  }
}
