'use strict';

App.newPage({
  title: "Tests",
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: this.title});
    page.add("p");

    App.dataHandler({dataName: "TestData", onload: function(data){
      let p = page.select("p");
      for (let index in data){
        p.add("test-component").setData(data[index]);
      }
    }});

    return page;
  }
})
