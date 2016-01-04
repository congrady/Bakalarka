'use strict';
(function() {

let template = `
<h3 id="page-title">Page 1</h3>
<div id="main-div"></div>
`;

window["Page1"] = {
  root: createFragment(template),
  title: "Page 1",
  init: function(urlParams) {
    var $mainDIV = this.root.getElementById("main-div");
    var $mainUL = document.createElement("ul");
    for (let urlParam of urlParams){
      $mainUL.innerHTML += `<li>${urlParam}</li>`;
    }
    $mainDIV.appendChild($mainUL);
  }
}

})();
