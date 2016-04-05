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

    let div = page.add('div');
    App.dataHandler({dataName: "TestData", action: function(data){
      console.log(data);
      for (let testName in data){
        let test = data[testName];
        let testElement = page.select(`#test-${test.name}`)
        if (testElement){
          testElement.setAttribute('added_by', test.added_by);
          testElement.setAttribute('uploaded', test.uploaded);
          testElement.setAttribute('last_modified', test.last_modified);
        } else {
          div.add("test-component", {
            id: `test-${test.name}`,
            name: test.name,
            added_by: test.added_by,
            uploaded: test.uploaded,
            last_modified: test.last_modified
          })
        }
      }
    }});
    App.dataHandler({dataName: "SegmentsCount", action: function(data){
      console.log(data);
      for (let testName in data){
        let test = data[testName];
        let testElement = page.select(`#test-${test.name}`)
        if (testElement) {
          testElement.setAttribute("segments_amount", test.count);
        } else {
          div.add("test-component", {
            id: `test-${test.name}`,
            segments_amount: test.count,
            name: test.name
          })
        }
      }
    }});

    return page;
  }
})
