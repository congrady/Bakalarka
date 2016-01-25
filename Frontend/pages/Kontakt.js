'use strict';

App.newPage({
  title: "Page2",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({
     elementType: "h3",
     id: "page-title",
     innerHTML: this.title
    });
    let div = root.add({
      elementType: "div"
    });
    for (let urlParam of urlParams){
      div.add({
        elementType: "p",
        innerHTML: `Parameter: ${urlParam[0]}`
      });
    }
    alert("kkk");
    root.importTemplate();
    return root;
  }
})
