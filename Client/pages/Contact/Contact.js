'use strict';

App.newPage({  
  
  init() {
    let page = new DocumentFragment();
    page.add('h3', {id: 'page-title', innerHTML: 'Contact'});
    page.importTemplate('Contact');
    
    console.log(App.getUrlParam('id'));
    
    return page;
  }
  
})
