'use strict';

App.newPage({
  title: "Tests",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add("h3", {id: "page-title", innerHTML: this.title});
    root.add("p", {id: "p1"});
    App.onDataLoad("TestsInfo", function(data){
      let p = document.querySelector("#p1") || root.querySelector("#p1");
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

    return root;
  }
})
