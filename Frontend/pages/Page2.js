'use strict';

router.showPage({
  title: "Page 2",
  template: `
  <h3 id="page-title"></h3>
  <div id="main-div"></div>
  `,
  init: function(urlParams) {
    let root = createFragment(this.template);
    root.getElementById("page-title").innerHTML = this.title;
    let $mainDIV = root.getElementById("main-div");
    let $mainUL = document.createElement("ul");
    for (let urlParam of urlParams){
      $mainUL.innerHTML += `<li>${urlParam}</li>`;
    }
    $mainDIV.appendChild($mainUL);
    return root;
  }
});
