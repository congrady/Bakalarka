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
  init: function() {
    let page = new DocumentFragment();
    page.add('h3', {id: 'page-title', innerHTML: 'Home'});

    /*
    let p = page.add("p");


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
        data: {name: "matus", added_by: "..."},
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
        success: function(){ alert("success") }
      });
      console.log(App.dataStore.data);
    };*/

    page.importTemplate();
    return page;
  }
})
