'use strict';

router.showPage({
  title: "Page 1",
  template: `
  <h3 id="page-title"></h3>
  <div id="main-div"></div>
  `,
  beforeAttachedCallback: function(urlParams){
    alert("beforeAttachedCallback");
  },
  afterAttachedCallback: function(urlParams){
    alert("afterAttachedCallback");
  },
  detachedCallback: function(urlParams){
    alert("detachedCallback");
  },
  init: function(urlParams) {
    let root = createFragment(this.template);
    root.getElementById("page-title").innerHTML = this.title;
    let $mainDIV = root.getElementById("main-div");
    let $mainUL = document.createElement("ul");
    var self = this;
    for (let urlParam of urlParams){
      let $li = document.createElement("li");
      $li.innerHTML = urlParam;
      $li.onclick = function(event){
        self.showAlert(event);
      }
      $mainUL.appendChild($li);
    }
    $mainDIV.appendChild($mainUL);
    return root;
  },
  showAlert: function(event){
    alert(`Alert od ${event.target.innerHTML}`);
  }
});
