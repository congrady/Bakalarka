'use strict';

(function() {
  let template = `
    <nav></nav>
  `;
  class MainNavigation extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$nav = this.shadowRoot.querySelector('nav');
      for (let path of window["navigationPaths"]){
          var anchor = document.createElement("a");
          anchor.innerHTML = path.substring(1);
          anchor.href = path;
          anchor.onclick = window["navigate"];
          this.$nav.appendChild(anchor);
      }
    };
  }
  document.registerElement('main-navigation', MainNavigation);
})();
