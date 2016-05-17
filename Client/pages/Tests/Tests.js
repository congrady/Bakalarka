'use strict';

App.newPage({
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add('h3', {id: 'page-title', innerHTML: 'Tests'});
    let button = page.add('button', {innerHTML: 'Add new test'});
    button.onclick = function(){
      App.navigate('/NewTest')
    }

    let div = page.add('div');
    App.dataHandler({dataName: 'TestData', action: function(data){
      for (let testName in data){
        let test = data[testName];
        div.add('test-component', {
          id: `t${test.id}`,
          name: test.name,
          added_by: test.added_by,
          uploaded: test.uploaded,
          last_modified: test.last_modified,
          segments_amount: test.segments_amount
        })
      }
    }});

    return page;
  }
})
