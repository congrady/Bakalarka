'use strict';

App.newPage({
  title: "Test ",
  init: function(urlParams) {
    let root = new DocumentFragment();
    let id = urlParams[0];
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title + id});
    return root;
  }
})
