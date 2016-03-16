'use strict';

App.newPage({
  title: "Test ",
  init: function(urlParams) {
    let page = new DocumentFragment();
    let div = page.add("div");

    App.onDataLoad("TestData", function (data){
      let div = page.select("div");
      div.add("h3", {id: "page-title", innerHTML: "Test : " + data.name});
      div.add("p", {innerHTML: `Name: ${data.name}`});
      div.add("p", {innerHTML: `Added by: ${data.added_by}`});
      div.add("p", {innerHTML: `Uploaded: ${data.uploaded}`});
      div.add("p", {innerHTML: `Last Modified: ${data.last_modified}`});
      div.addImg({src: `/data/tests/${data.name}/frame.jpeg`, width: "640", height: "360"}, "scaleDown");
    });

    return page;
  }
})
