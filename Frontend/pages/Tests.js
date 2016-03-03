'use strict';

App.newPage({
  title: "Tests",
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: this.title});
    page.add("p", {id: "p1"});

    App.onDataLoad("TestsInfo", function(data){
      let p = page.select("p");
      for (let test of data){
        p.add("test-component", {
          name: test.name,
          addedBy: test.addedBy,
          uploaded: test.uploaded,
          lastModified: test.lastModified,
          numSegments: test.numSegments
        })
      }
    });

    return page;
  }
})
