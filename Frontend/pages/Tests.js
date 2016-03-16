'use strict';

App.newPage({
  title: "Tests",
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: this.title});
    page.add("p");

    App.onDataLoad("TestsInfo", function(data){
      alert(data);
      let p = page.select("p");
      for (let testData of data){
        p.add("test-component").setData(testData);
      }
    });

    return page;
  }
})
