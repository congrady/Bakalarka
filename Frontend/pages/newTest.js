'use strict';

App.newPage({
  title: "New Test",
  init: function(urlParams) {
    let page = new DocumentFragment();
    page.add("h3", {id: "page-title", innerHTML: this.title});
    page.importTemplate();
    let form = page.select("form");
    let message = page.select("#message");

    form.onsubmit = function(event){
      event.preventDefault();
      let name = this.name.value;
      App.putData({
        dataName: "TestData",
        data: {
          'name': name,
          'added_by': App.userName
        },
        success: function(response){
          App.putClientData({
            dataName: "TestData",
            data: JSON.parse(response)
          });
          App.navigate('/Tests')
        },
        error: function() {
          message.innerHTML = "Test with this name already exists."
          message.style.color = "red";
        }
      });
    }

    return page;
  }
})
