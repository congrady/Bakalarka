AppConfig.beforePageShow = [
  function(params){ document.getElementsByTagName("main-navigation")[0].setAttribute("active", params.page); }
];
AppConfig.afterPageShow = [
  //function(params){ console.log("afterPageShow"); }
];
AppConfig.beforePageDetach = [
  //function(params){ console.log("beforePageDetach"); }
];
AppConfig.onAppInit = [
  //function(){ console.log("onAppInit"); }
];
