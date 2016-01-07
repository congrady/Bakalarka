'use strict';

router.showPage({
  title: "Home",
  template: `
  <h3 id="page-title"></h3>
  <div id="main-div"></div>
  `,
  init: function(urlParams) {
    let root = createFragment(this.template);
    root.getElementById("page-title").innerHTML = this.title;
    return root;
  }
});
