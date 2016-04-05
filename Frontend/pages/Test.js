'use strict';

App.newPage({
  title: "Test ",
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title"});
    page.add("p", {id: 'added_by'});
    page.add("p", {id: 'uploaded'});
    page.add("p", {id: 'last_modified'});
    page.add("p", {id: 'segments_amount'});
    page.addImg({id: 'frame', width: "640", height: "360"}, "scaleDown");

    App.dataHandler({dataName: "TestData", specific: urlParams[0], action: function (data){
      page.select('#page-title').innerHTML = "Test: " + data.name;
      page.select('#added_by').innerHTML = `Added by: ${data.added_by}`;
      page.select('#uploaded').innerHTML = `Uploaded: ${parseDate(data.uploaded)}`;
      page.select('#last_modified').innerHTML = `Last Modified: ${parseDate(data.last_modified)}`;
      page.select('#frame').src = `/data/tests/${data.name}/frame.jpeg`;
    }});
    App.dataHandler({dataName: "SegmentsCount", specific: urlParams[0], action: function (data){
      page.select('#segments_amount').innerHTML = `Amount of segments: ${data.count}`;
    }});

    return page;
  }
})
