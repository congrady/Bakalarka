'use strict';

App.newPage({
  title: "Tests",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
    root.add({
      elementType: "test-component",
      attributes: {
        cattegory: "cattegory",
        date: "26.1.2016",
        added_by: "Matus Congrady",
        subject: "Janko Hrasko",
        id: "80231035221"
      }
    })
    return root;
  }
})
