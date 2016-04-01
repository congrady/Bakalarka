'use strict';

App.newPage({
  title: "Tests",
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: this.title});
    let button = page.add("button", {innerHTML: 'Add new test'});
    button.onclick = function(){
      App.navigate('/NewTest')
    }

    page.add("div");
    App.dataHandler({dataName: "TestData", action: function(data){
      let div = page.select("div");
      div.add("Test-collection", {tests: data})
    }});

    return page;
  }
})
