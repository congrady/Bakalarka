'use strict';

App.newPage({
  title: "Home",
  beforePageShow: function(){
    //alert("beforeAttachedCallback");
  },
  afterPageShow: function(){
    //alert("afterAttachedCallback");
  },
  detachedCallback: function(){
    //alert("detachedCallback");
  },
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: this.title});
    if (urlParams){
      let div = page.add("div");
      for (let urlParam of urlParams){
        div.add("p", {innerHTML: `Parameter: ${urlParam}`});
      }
    }

    page.add("button", {innerHTML: "Test"}).onclick = function(){
      App.putData({
        dataName: "TestData",
        data: {name: "matus", added_by: "asdasdad"},
        key: "matus",
        success: function(){ alert("pridane") },
        error: function() { alert("error - nepridane") }
      });
    };

    page.importTemplate();
    return page;
  }
})
