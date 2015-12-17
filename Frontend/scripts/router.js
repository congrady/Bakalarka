'use strict';

var Home = {
    init: function(){
      this.message = "------> Home page <------"
    },
    show: function(){
      document.getElementById('main-content').innerHTML = this.message;
    }
};

var Page1 = {
    init: function(){
      this.message = "------> Page 1 <------"
    },
    show: function(){
      document.getElementById('main-content').innerHTML = this.message;
    }
};

var Page2 = {
    init: function(){
      this.message = "------> Page 2 <------"
    },
    show: function(){
      document.getElementById('main-content').innerHTML = this.message;
    }
};

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
/*
var Router = {
    routes: [],
    mode: null,
    root: '/',
    config: function(options) {
        this.mode = options && options.mode && options.mode == 'history'
                    && !!(history.pushState) ? 'history' : 'hash';
        this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
        return this;
    },
    getFragment: function() {
        var fragment = '';
        if(this.mode === 'history') {
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
        } else {
            var match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }
        return this.clearSlashes(fragment);
    },
    clearSlashes: function(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
    add: function(re, handler) {
        if(typeof re == 'function') {
            handler = re;
            re = '';
        }
        this.routes.push({ re: re, handler: handler});
        return this;
    },
    remove: function(param) {
        for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
            if(r.handler === param || r.re.toString() === param.toString()) {
                this.routes.splice(i, 1);
                return this;
            }
        }
        return this;
    },
    flush: function() {
        this.routes = [];
        this.mode = null;
        this.root = '/';
        return this;
    },
    check: function(f) {
        var fragment = f || this.getFragment();
        for(var i=0; i<this.routes.length; i++) {
            var match = fragment.match(this.routes[i].re);
            if(match) {
                match.shift();
                this.routes[i].handler.apply({}, match);
                return this;
            }
        }
        return this;
    },
    listen: function() {
        var self = this;
        var current = self.getFragment();
        var fn = function() {
            if(current !== self.getFragment()) {
                current = self.getFragment();
                self.check(current);
            }
        }
        clearInterval(this.interval);
        this.interval = setInterval(fn, 50);
        return this;
    },
    navigate: function(path) {
        path = path ? path : '';
        if(this.mode === 'history') {
            history.pushState(null, null, this.root + this.clearSlashes(path));
        } else {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }
        return this;
    }
}*/
