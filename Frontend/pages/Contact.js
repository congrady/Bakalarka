'use strict';

App.newPage({
  title: "Contact",
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: this.title});
    page.importTemplate("Contact");
    return page;
  }
})
