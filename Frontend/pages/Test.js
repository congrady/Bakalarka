'use strict';

App.newPage({
  title: "Test ",
  init: function(urlParams) {
    let root = new DocumentFragment();
    let id = decodeURIWithSlashes(urlParams[0]);
    root.add("h3", {id: "page-title", innerHTML: this.title + id});
    return root;
  }
})
