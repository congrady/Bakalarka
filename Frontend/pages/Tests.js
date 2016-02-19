'use strict';

App.newPage({
  title: "Tests",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add("h3", {id: "page-title", innerHTML: this.title});
    root.add("p", {id: "p1"});
    xhr_get({
      url: "/getTestsInfo",
      success: function(response){
        if (response == null || response == "null"){
          return
        }
        let tests = JSON.parse(response);
        let p = document.querySelector("#p1");
        for (let test of tests){
          p.add("test-component", {
            name: test.name,
            addedBy: test.addedBy,
            uploaded: test.uploaded,
            lastModified: test.lastModified,
            numSegments: test.numSegments
          })
        }
      }
    })
    return root;
  }
})
