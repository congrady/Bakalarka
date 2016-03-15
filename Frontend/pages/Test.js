'use strict';

App.newPage({
  title: "Test ",
  init: function(urlParams) {
    let page = new DocumentFragment();
    let div = page.add("div");

    App.onDataLoad("TestData", function (data){
      let div = page.select("div");
      div.add("h3", {id: "page-title", innerHTML: "Test : " + data[0]});
      div.add("p", {innerHTML: `Name: ${data[0]}`});
      div.add("p", {innerHTML: `Added by: ${data[1]}`});
      div.add("p", {innerHTML: `Uploaded: ${data[2]}`});
      div.add("p", {innerHTML: `Last Modified: ${data[3]}`});
      div.addImg({src: `/data/tests/${data[0]}/frame.jpeg`, width: "640", height: "360"}, "scaleDown");
    });

    return page;
  }
})
