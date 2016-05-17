'use strict';

(function() {
  let template = `
    <style>
    a{
      text-shadow:
        -0.5px -0.5px 0 #000,
        0.5px -0.5px 0 #000,
        -0.5px 0.5px 0 #000,
        0.5px 0.5px 0 #000;
      color: #fff;
      text-decoration: none;
      font-weight: bold;
      display: block;
      float: left;
      height: 100%;
      text-align: center;
      line-height: 45px;
      box-shadow: -0.7px 0px 0.7px 0.7px #666666;
    }
    .active {
      background-color: #fff;
      color: #404040;
      text-shadow: none;
    }
    a:hover {
      background-color: #fff;
      color: #404040;
      text-shadow: none;
      -moz-box-shadow:    inset 0 0 2px #000000;
      -webkit-box-shadow: inset 0 0 2px #000000;
      box-shadow:         inset 0 0 2px #000000;
    }
    nav {
      overflow: hidden;
      height: 45px;
      background-color: #333333;
      box-shadow: 0 0 4px #000000;
      margin-top: 0.4%;
      border-radius: 5px;
    }
    </style>
    <nav></nav>
  `;
  class MainNavigation extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.nav = this.shadowRoot.querySelector('nav');
      
      this.modes = {
        'auth0': {
          requiredAuthLevel: 0,
          navItems: [
            {name: 'Home', path: ['/Home', '/']},
            {name: 'New Segment', path:'/NewSegment'},
            {name: 'Tests', path: '/Tests'},
            {name: 'Contact', path: '/Contact'}
          ]
        },
        'free': {
          navItems: [
            {name: 'Home', path: ['/Home', '/']},
            {name: 'Contact', path: '/Contact'}
          ]
        }
      }
      
      if (App.authLevel <= this.modes['auth0'].requiredAuthLevel){
        this.activeMode = 'auth0';
      } else {
        this.activeMode = 'free';
      }
      
      this.makeNavigation(window.location.pathname);
    }
    
    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName == 'active'){
        this.makeNavigation(newVal);
      }
    }

    makeNavigation(active){
      this.nav.innerHTML = '';
      let navItems = this.modes[this.activeMode].navItems;

      let width = `${100/navItems.length}%`;
      for (let navItem of navItems){
        let path = navItem.path.constructor === Array ? 
          navItem.path.sort(function (a, b) { return b.length - a.length; })[0] : 
          navItem.path;
        let anchor = document.createElement('a');
        anchor.innerHTML = navItem.name;
        anchor.style.width = width;
        anchor.href = path;
        if (navItem.path.constructor === Array){
          if (navItem.path.indexOf(active) != -1){
            anchor.classList.add('active');
          }
        } else if (navItem.path == active) {
          anchor.classList.add('active');
        }
        var self = this;
        anchor.onclick = function(event){
          App.navigate(event);
          self.setAttribute('active', path)
        }
        this.nav.appendChild(anchor);
      }
    }
  }
  document.registerElement('main-navigation', MainNavigation);
})();
