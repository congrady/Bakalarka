'use strict';

App.newPage({
  title: "Home",
  beforeAttachedCallback: function(){
    //alert("beforeAttachedCallback");
  },
  afterAttachedCallback: function(){
    //alert("afterAttachedCallback");
  },
  detachedCallback: function(){
    //alert("detachedCallback");
  },
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
    if (urlParams.length != 0){
      let div = root.add({elementType: "div"});
      for (let urlParam of urlParams){
        div.add({elementType: "p", innerHTML: `Parameter: ${urlParam}`});
      }
    }
    root.importTemplate();
    return root;
  }
})
