'use strict';

class PageView {
  show() {
    if (this.title) {
      document.getElementsByTagName('title')[0].innerHTML = this.title;
    }
    var $mainContent = document.getElementById("main-content");
    while ($mainContent.lastChild) {
      $mainContent.removeChild(mainContent.lastChild);
    }
    $mainContent.appendChild(this.root);
  }
}
