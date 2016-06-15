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

    page.importTemplate();
    return page;
  }
})
