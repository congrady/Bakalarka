'use strict';

App.newPage({
  title: "Home",
  init: function(urlParams) {
    let root = new DocumentFragment();
    root.add({elementType: "h3", id: "page-title", innerHTML: this.title});
    let div = root.add({elementType: "div"});
    for (let urlParam of urlParams){
      div.add({elementType: "p", innerHTML: `Parameter: ${urlParam[0]}`});
    }
    root.add({elementType: "p",
              innerHTML: `</b><br>Lorem ipsum dolor sit amet, arcu per erat sit metus ac neque, feugiat quam neque sagittis nunc <br>sed. Duis laoreet. Pharetra felis, eros vehicula accumsan in egestas. Malesuada pretium amet. Luctus erat sagittis nulla, non ligula, nonummy imperdiet morbi nibh sodales, morbi ultrices donec, mattis in massa sed. Ut penatibus pretium, <br>duis mollis aliquam sit ligula fringilla, lacus pede id sapien rhoncus nam. Sed lacus condimentum <br>mauris et. A sit dictum justo mollis interdum, nam eros et sollicitudin, ridiculus magni integer nec auctor cras, quis hac in ipsum wisi, diam risus semper. Repellendus pariatur mi neque faucibus, molestie nam ipsum, senectus at nisl ac augue adipiscing volutpat, hendrerit donec, justo donec eu amet duis. Metus luctus ut mi ut. Fringilla eget magna id tincidunt neque, nascetur vestibulum ut a velit accumsan praesent, ac massa fames.
Nunc libero, interdum ipsum venenatis, nunc justo ac, risus etiam. Vitae vitae mi pellentesque proin <br>lorem orci. Feugiat ultrices lectus, accumsan pede etiam volutpat quae, ultricies in mollis sit mollis. Fringilla cras praesent luctus non aliquam laoreet. Adipiscing vestibulum maecenas quam rhoncus, convallis accumsan duis lorem nec non. Pulvinar <br>venenatis esse praesent, pellentesque enim sollicitudin nascetur justo, varius maecenas suscipit dictumst vivamus leo quis, vitae integer at <br>praesent et. Mi nunc molestie, vitae inceptos senectus ad.
Nec est est semper condimentum enim donec,<br> vehicula vehicula molestie, amet scelerisque, vel nullam elit volutpat orci. Volutpat sollicitudin wisi massa vel risus, ullamcorper fusce sit arcu. Ligula nisl placerat eu elit enim, lectus proin non cras, eros sapien enim at purus dui. Donec sed orci libero erat, dui fringilla commodo <br>fusce, malesuada nec ac integer ornare viverra cras. Nibh nec ante. Sollicitudin arcu turpis quam, suspendisse ante. Tincidunt ultricies <br>magna quisque bibendum sed vitae, ante wisi a, nibh litora sed eget proin vitae rutrum. Volutpat aliquam dui a pharetra, curabitur quos quam volutpat quis elit torquent, mauris dui sem. Eget pellentesque ante nisl lorem, lorem eget scelerisque vitae, in vel maecenas, proin massa sodales, ut ipsum. Et tortor risus vestibulum, ullamcorper eu tincidunt, donec imperdiet mauris fames malesuada cursus, sed consequat mollis quod praesent ante malesuada. Duis in eget nulla. Nonummy tincidunt phasellus euismod nonummy blandit est.
Varius scelerisque pede<br> placerat. Optio risus volutpat gravida. Ultricies enim, nec a integer non neque suspendisse, tincidunt <br>velit pellentesque. Eos massa rutrum pellentesque, dapibus quis fermentum hendrerit sagittis pede arcu. Eget massa risus elit, nam placerat bibendum, elit pede nec, et sodales in, sollicitudin elit orci consequat imperdiet sit. Donec morbi condimentum elit et, fermentum libero metus, accumsan lectus tincidunt lorem ac, <br>integer vitae pulvinar.</b>`
    })
    return root;
  }
})
