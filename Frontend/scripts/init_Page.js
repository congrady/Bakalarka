function initRouter(){
  var routes = [
            {path: "/", handler: 'Home', navigation: false, isRelative: false},
            {path: "/Page1", handler: 'Page1', navigation: true, isRelative: false},
            {path: "/Page2", handler: 'Page2', navigation: true, isRelative: false}
            ];
  router = new Router(routes);
}
function servePage(){
  if (!window["router"]){
    initRouter();
    router.servePage();
  }
}

servePage();
window.addEventListener('popstate', servePage);
