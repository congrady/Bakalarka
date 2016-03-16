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

    function testPOST() {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/DELETE/', true);
      xhr.onload = function(event) {
        if (xhr.status == 200){
          alert("success load")
        }
      };
      let formData = new FormData();
      formData.append("table", "tests");
      formData.append("where", "name=igor,name=peto");
      xhr.send(formData);
    }

    testPOST();

    page.importTemplate();
    return page;
  }
})
