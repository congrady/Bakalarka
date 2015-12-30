'use strict';
(function() {

let style = `
li {
  color: blue;
}
`;

let template = `
<h3 id="page-title">Page 2<h3>
`;

window["Home"] = {
  root: createFragment(template),
  css: style,
  title: "Home Page",
  init: function(urlParams) {
    this.root.getElementById("page-title").innerHTML = this.title;
  }
}

})();
