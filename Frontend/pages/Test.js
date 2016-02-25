'use strict';

App.newPage({
  title: "Test ",
  init: function(urlParams, data) {
    alert(data.TestData[0]);
    if (!data.TestData){
      return "pageNotFound"
    }
    let root = new DocumentFragment();
    let id = decodeURIWithUnderscores(urlParams[0]);
    root.add("h3", {id: "page-title", innerHTML: this.title + id});

    return root;
  }
})
