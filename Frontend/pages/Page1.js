'use strict';

router.newPage({
  title: "Page1",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
    let div = root.add({elementType: "div"});
    for (let urlParam of urlParams){
      div.add({elementType: "p", innerHTML: `Parameter: ${urlParam[0]}`});
    }
    return root;
  }
})
