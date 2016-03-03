'use strict';

App.newPage({
  title: "Home",
  beforePageShow: function(){
    alert("beforeAttachedCallback");
  },
  afterPageShow: function(){
    alert("afterAttachedCallback");
  },
  detachedCallback: function(){
    //alert("detachedCallback");
  },
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add("h3", {id: "page-title", innerHTML: this.title});
    if (urlParams){
      let div = root.add("div");
      for (let urlParam of urlParams){
        div.add("p", {innerHTML: `Parameter: ${urlParam}`});
      }
    }
    root.importTemplate();
    return root;
  }
})
