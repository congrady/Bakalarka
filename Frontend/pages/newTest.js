'use strict';

App.newPage({
  title: "New Test",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
    root.importTemplate();
    let form = root.select("form");
    //alert(root.select("form").innerHTML);
    let select = form.select("#cattegory");
    form.onsubmit = function(event){
      event.preventDefault();
      let value = select.options[select.selectedIndex].value;
      alert(value);
    }
    //let fileInput = document.getElementById('fileInput');
    //var fileDisplayArea = document.getElementById('fileDisplayArea');
    /*
    fileInput.addEventListener('change', function(e) {
      // Put the rest of the demo code here.
    });
    var e = document.getElementById("ddlViewBy");
    var strUser = e.options[e.selectedIndex].value;

    */

    return root;
  }
})
