'use strict';

App.newPage({
  title: "Test ",
  init: function(urlParams, data) {
    if (!data.TestData){
      return "pageNotFound"
    }
    let root = new DocumentFragment();
    let name = data.TestData[0];
    let addedBy = data.TestData[1];
    let uploaded = data.TestData[2];
    let lastModified = data.TestData[3];

    root.add("h3", {id: "page-title", innerHTML: this.title + name});
    root.add("p", {innerHTML: `Name: ${name}`});
    root.add("p", {innerHTML: `Added by: ${addedBy}`});
    root.add("p", {innerHTML: `Uploaded: ${uploaded}`});
    root.add("p", {innerHTML: `Last Modified: ${lastModified}`});
    root.addImg(`/data/tests/${name}/frame.jpeg`);

    return root;
  }
})
