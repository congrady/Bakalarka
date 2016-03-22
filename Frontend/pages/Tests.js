'use strict';

App.newPage({
  title: "Tests",
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: this.title});
    page.add("div");

    App.dataHandler({dataName: "TestData", action: function(data){
      let div = page.select("div");
      for (let index in data){
        let testComponent = div.add("test-component");
        testComponent.setData(data[index]);
      }
    }});

    return page;
  }
})
