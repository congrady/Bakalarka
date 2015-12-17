function pageInit(){
  routes = [
            {path: "/", handler: Home, navigation: false, isRelative: false},
            {path: "/Page1", handler: Page1, navigation: false, isRelative: false},
            {path: "/Page2", handler: Page2, navigation: false, isRelative: false}
           ];
  router = new Router(routes);
}
function servePage(){
  if (!router){
    pageInit();
  }
  router.servePage();
}

pageInit()
router.servePage();
window.addEventListener('popstate', servePage);
