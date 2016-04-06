'use strict';

App.newPage({
  init: function(urlParams) {
    let page = new DocumentFragment();

    let div = page.add('div');
    App.dataHandler({dataName: "TestData", specific: urlParams[0], action: function (data){
      div.add("h3", {id: "page-title", innerHTML: "Test: " + data.name});
      div.add("p", {id: 'added_by', innerHTML: `Added by: ${data.added_by}`});
      div.add("p", {id: 'uploaded', innerHTML: `Added: ${parseDate(data.uploaded)}`});
      div.add("p", {id: 'last_modified', innerHTML: `Last Modified: ${parseDate(data.last_modified)}`});
      div.add("p", {id: 'segments_amount', innerHTML: `Amount of segments: ${data.segments_amount}`});
      if (data.segments_amount == '0'){
        div.addImg({id: 'frame', width: "400", height: "250", src: `/data/imgs/error.gif`}, "scaleDown");
      } else {
        div.addImg({id: 'frame', width: "640", height: "360", src: `/data/tests/${data.id}/frame.jpeg`}, "scaleDown");
      }
    }});

    return page;
  }
})
