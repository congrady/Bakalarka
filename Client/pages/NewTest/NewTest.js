'use strict';

App.newPage({
  init: function() {
    let page = new DocumentFragment();
    page.add('h3', {id: 'page-title', innerHTML: 'New Test'});
    page.importTemplate();
    let form = page.select('form');
    let message = page.select('#message');

    form.onsubmit = function(event){
      event.preventDefault();
      var self = this;
      xhr_post({
        url: '/SaveNewTest',
        data: {
          name: self.name.value,
          userName: App.userName
        },
        success: function(){
          App.navigate('/Tests')
        },
        otherError: function() {
          message.innerHTML = 'Test with this name already exists.'
          message.style.color = 'red';
        }
      });
    }

    return page;
  }
})
