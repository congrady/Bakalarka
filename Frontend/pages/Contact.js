'use strict';

App.newPage({
  title: "Contact",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add("h3", {id: "page-title", innerHTML: this.title});
    root.importTemplate("Contact");
    return root;
  }
})
