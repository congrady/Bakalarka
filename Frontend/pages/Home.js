'use strict';

App.newPage({
  beforePageShow: function(){
    //alert("beforeAttachedCallback");
  },
  afterPageShow: function(){
    //alert("afterAttachedCallback");
  },
  detachedCallback: function(){
    //alert("detachedCallback");
  },
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: 'Home'});
    if (urlParams){
      let div = page.add("div");
      for (let urlParam of urlParams){
        div.add("p", {innerHTML: `Parameter: ${urlParam}`});
      }
    }
    /*
    let p = page.add("p");

    let reactElement = p.add("Hello", {name: "Matus"});
    //reactElement.sayHello();

    page.add("button", {innerHTML: "Test"}).onclick = function(){
      App.updateData({
        dataName: "TestData",
        data: {name: "matus", added_by: "p"},
        key: "matus",
        success: function(response){ console.log(JSON.parse(response)) },
        error: function() { alert("error - nepridane") }
      });
    };

    page.add("button", {innerHTML: "Put"}).onclick = function(){
      App.putClientData({
        dataName: "TestData",
        data: {name: "matus", added_by: "p"}
      });
      console.log(App.dataStore.data);
    };

    page.add("button", {innerHTML: "Update"}).onclick = function(){
      App.updateClientData({
        dataName: "TestData",
        key: 'matus',
        data: {name: "matus", added_by: "kloaka"},
      });
      console.log(App.dataStore.data);
    };

    page.add("button", {innerHTML: "Delete"}).onclick = function(){
      App.deleteClientData({
        dataName: "TestData",
        key: 'matus'
      });
      console.log(App.dataStore.data);
    };

    page.add("button", {innerHTML: "Sync"}).onclick = function(){
      App.syncData({
        dataName: "TestData",
        success: function(){ alert("ahoj") }
      });
      console.log(App.dataStore.data);
    };*/

    page.importTemplate();
    return page;
  }
})
