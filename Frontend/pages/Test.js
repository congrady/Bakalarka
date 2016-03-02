'use strict';

App.newPage({
  title: "Test ",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add("div");

    App.onDataLoad("TestData", function(data){
      let div = document.querySelector("div") || root.querySelector("div");
      let name = data[0];
      div.add("h3", {id: "page-title", innerHTML: name});
      div.add("p", {innerHTML: `Name: ${name}`});
      div.add("p", {innerHTML: `Added by: ${data[1]}`});
      div.add("p", {innerHTML: `Uploaded: ${data[2]}`});
      div.add("p", {innerHTML: `Last Modified: ${data[3]}`});
      //div.addImg(`/data/tests/${name}/frame.jpeg`, {width: "640", height: "360"});
      div.add("img", {src: `/data/tests/${name}/frame.jpeg`, width: "640", height: "360"});
    });

    return root;
  }
})
