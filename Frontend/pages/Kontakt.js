'use strict';

App.newPage({
  title: "Kontakt",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({
     elementType: "h3",
     id: "page-title",
     innerHTML: this.title
    });
    root.importTemplate();
    return root;
  }
})
