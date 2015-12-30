'use strict';
(function() {

let style = `
li {
  color: blue;
}
`;

let template = `
<h3 id="page-title">Page 2<h3>
<div id="main-div"></div>
`;

window["Page2"] = {
  root: createFragment(template),
  css: style,
  title: "Page 2",
  init: function(urlParams) {
    var $mainDIV = this.root.getElementById("main-div");
    var $mainUL = document.createElement("ul");
    for (let urlParam of urlParams){
      $mainUL.innerHTML += '<li> ${urlParam} </li>';
    }
    $mainDIV.appendChild($mainUL);
  }
}

})();
