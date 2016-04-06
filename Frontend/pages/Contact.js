'use strict';

App.newPage({
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: 'Contact'});
    page.importTemplate("Contact");
    return page;
  }
})
