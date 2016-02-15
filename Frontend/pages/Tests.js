'use strict';

App.newPage({
  title: "Tests",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
    root.add({
      elementType: "test-component",
      attributes: {
        name: "IB vytvorenie uctu",
        numSegments: "3",
        uploaded: "26.1.2016",
        uploadedBy: "Matus Congrady",
        lastModified: "23.2.2016"
      }
    })
    return root;
  }
})
