'use strict';

App.newPage({
  title: "New Test",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({
     elementType: "h3",
     id: "page-title",
     innerHTML: this.title
    });
    return root;
  }
})
